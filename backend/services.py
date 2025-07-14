#serveces.py file
import jwt, random
from fastapi import status
# from main import Depends, HTTPException
from fastapi import Depends, HTTPException
from auth import oauth2schema

from database import _orm, engine, SessionLocal, Base
import models, schemas
import passlib.hash as _hash
import datetime as _dt

JWT_SECRET = "myjwtsecret"

# oauth2schema = _security.OAuth2PasswordBearer(tokenUrl="/api/token")

def create_database():
    return Base.metadata.create_all(bind = engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
async def get_user_by_email(useremail: schemas.PullUser, db: _orm.Session):
    return db.query(models.User).filter(models.User.email == useremail.email).first()

def auth_user(user: dict, db: _orm.Session = Depends(get_db)):
    email = user.get('email')
    the_user = db.query(models.User).filter(models.User.email == email).first()

    if not the_user:
        raise HTTPException(status_code=401, detail="Email not found")

    if not the_user.verify_password(user.get('password')):
        raise HTTPException(status_code=403, detail="Incorrect Details Entered")

    return the_user

async def create_user(user: schemas.UserCreate, db: _orm.Session):
    try:
        hashed_password = _hash.bcrypt.hash(user.hashed_password)
        user_data = user.model_dump()
        user_data.pop('hashed_password')  # Remove hashed_password from user_data
        
        user_obj = models.User(hashed_password=hashed_password, **user_data)
        db.add(user_obj)
        db.commit()
        db.refresh(user_obj)
        
        user_account = models.AccountBalance(user_id=user_obj.id)
        db.add(user_account)
        db.commit()
        db.refresh(user_account)
        
        
        note_to_add = models.Notifications(user_id=user_obj.id, note_body = f"{user_obj.name}, Your Account Has Been Successfully Created!")
        db.add(note_to_add)
        db.commit()
        db.refresh(note_to_add)
        return f"{user_obj.name}, Your Account Has Been Successfully Created!"
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Client error: {str(e)}")

async def authenticate_user(email:str, password:str, db: _orm.Session):
    user = await get_user_by_email(db=db, email=email)
    
    if not user:
        return False
    
    if not user.verify_password(password):
        return False
    
    return user


async def get_my_notifications(userid: str, db: _orm.Session):
    note = db.query(models.Notifications).filter_by(user_id=userid)
    
    
    return list(map(schemas.Notification.from_orm, note))

async def notification_selector(note_id: str, user: schemas.Users, db: _orm.Session):
    note =(
        db.query(models.Notifications)
        .filter_by(user_id = user.id)
        .filter(models.Notifications.note_id == note_id)
        .first()        
    )
    
    if note is None:
        raise HTTPException(status_code=404, detail="No Notifications Found!")
    
    return note

async def get_notification(note_id: str, user: schemas.Users, db):
    note = await notification_selector(note_id=note_id, user=user, db=db)
    
    return schemas.Notification.from_orm(note)

async def get_account(userid: int, db: _orm.Session):
    account = db.query(models.AccountBalance).filter_by(user_id=userid)
    
    return list(map(schemas.AccountBalance.from_orm, account))

async def pay_for_Lot(amount: float, userid: str, db: _orm.Session):
    account = db.query(models.AccountBalance).filter_by(user_id=userid).first()
    holder = db.query(models.User).filter_by(id=userid).first()
    
    
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    if account.balance == 0 or account.balance < amount:
        raise HTTPException(status_code=400, detail="Insufficient Credits to carry out this transaction")
    
    new_balance = account.balance - amount
    account.balance = new_balance
    
    db.commit()  # Commit the changes to update the balance in the database
    await generate_notification(db=db, userid=userid, note_type="normal", note_body=f"{holder.name}, Your transaction Was Successfdull")
    
    return {"message": "Transaction successful", "new_balance": new_balance}

async def book_my_parking_lot(details: schemas.Reserve, db: _orm.Session):
    vacant_lots = db.query(models.ParkingLots).filter_by(lot_status="vacant").all()
    user_obj = db.query(models.User).filter(models.User.id == details.userid).first()  # Fetch the user object
    user_acc = db.query(models.AccountBalance).filter(models.AccountBalance.user_id == user_obj.id).first()
    
    if not vacant_lots:
        raise HTTPException(status_code=404, detail="No vacant parking lots available")
    
    selected_lot = random.choice(vacant_lots)
    
    # Assume the payment amount is based on the number of hours booked
    payment_amount = calculate_payment_amount(details.hours)
    current_balance = user_acc.balance
    booking_start_time = _dt.datetime.utcnow()
    booking_end_time = booking_start_time + _dt.timedelta(hours=details.hours)
    
    if (current_balance >= payment_amount):
        new_balance = current_balance - payment_amount
    else:
        raise HTTPException(status_code=400, detail="You Have Insufficient Funds To Complete This Transaction!")  
    try:
        if details.immediate_booking:
            # payment_result = await pay_for_Lot(payment_amount, userid=userid, db=db)
            
            
            
            db.query(models.ParkingLots).filter(models.ParkingLots.lot_id==selected_lot.lot_id).update({"lot_status": "booked"})
            db.query(models.User).filter(models.User.id == details.userid).update({"havelot": True})
            
            note_body = f"{user_obj.name}, You have successfully booked parking lot {selected_lot.lot_id} for {details.hours} hours for ${payment_amount}."
        else:
            db.query(models.ParkingLots).filter(models.ParkingLots.lot_id==selected_lot.lot_id).update({"lot_status": "reserved"})
            db.query(models.User).filter(models.User.id == details.userid).update({"havelot": True})
            
            note_body = f"{user_obj.name}, You have successfully reserved parking lot {selected_lot.lot_id} for {details.hours} hours for ${payment_amount}."
        
        db.query(models.AccountBalance).filter(models.AccountBalance.user_id == user_obj.id).update({"balance": f"{new_balance}"})
        booking = models.Booking(lot_id=selected_lot.lot_id, user_id=user_obj.id, start_time=booking_start_time, end_time=booking_end_time)
            
        db.add(booking)
        db.commit()
        db.refresh(booking)
        return await generate_notification(db=db, note_type="transaction", note_body=note_body, userid=details.userid)
    
    except HTTPException as e:
        # Undo changes if payment fails
        db.rollback()
        raise e

def calculate_payment_amount(hours: int):
    # Implement your logic to calculate the payment amount based on hours booked
    return hours * 2  # Assuming $2 per hour for parking

async def generate_notification(db: _orm.Session, note_type: str, note_body: str, userid: str):
    note_data = {"note_type": note_type, "note_body": note_body, "user_id": userid}
        
    note = models.Notifications(**note_data)
        
    db.add(note)
    db.commit()
    db.refresh(note)
        
    return schemas.Notification.from_orm(note)

async def revoke_my_reservation(user: schemas.PullNotes, db: _orm.Session):
    # Find the booking based on the user's user_id
    booking = db.query(models.Booking).filter(models.Booking.user_id == user.user_id).first()

    if booking:
        lot_id = booking.lot_id

        # Update the lot_status for the identified lot_id to vacant
        parking_lot = db.query(models.ParkingLots).filter(models.ParkingLots.lot_id == lot_id).first()
        
        if parking_lot:
            parking_lot.lot_status = "vacant"
            db.delete(booking)
            db.query(models.User).filter(models.User.id == user.user_id).update({"havelot": False})
            note_to_add = models.Notifications(user_id=user.user_id, note_body = f"You Have Successfully Revoke Your ParkingLot {parking_lot.lot_id} Reservation!")
            db.add(note_to_add)
            db.commit()
            db.refresh(note_to_add)
            return f"Booking successfully unreserved. Parking lot {parking_lot.lot_id} is now vacant."
        else:
            return "Parking lot not found."
    else:
        return "Booking not found for the user."
    
async def lot_selector(userid: str, db: _orm.Session):
    booked_lot = db.query(models.Booking).filter(models.Booking.user_id == userid).first()
    
    if not booked_lot:
        raise HTTPException(status_code=404, detail="No Lots For This User Found!, Please Consider Making A Reservation")
    note =(
        db.query(models.ParkingLots)
        .filter(models.ParkingLots.lot_id == booked_lot.lot_id)
        .first()        
    )
    
    if note is None:
        raise HTTPException(status_code=404, detail="No Lots For This User Found!, Please Consider Making A Reservation")
    
    return note

async def reset_balance(userid: str, db: _orm.Session):
    db.query(models.AccountBalance).filter(models.AccountBalance.user_id == userid).update({"balance": 99})
    db.commit()
    account = db.query(models.AccountBalance).filter(models.AccountBalance.user_id == userid).first()
    return {"message": f"New Account Balance: ${account.balance}"}

async def return_your_lot(user: schemas.PullNotes, db: _orm.Session):
    userLot = db.query(models.Booking).filter(models.Booking.user_id == user.user_id )
    return userLot

async def revoke_my_lot(user: schemas.PullNotes, db: _orm.Session):
    userlot = db.query(models.Booking).filter(models.Booking.user_id == user.user_id).first()
    
    if userlot:
        db.query(models.ParkingLots).filter(models.ParkingLots.lot_id == userlot.lot_id).update({"lot_status": "vacant"})
        db.query(models.User).filter(models.User.id == userlot.user_id).update({"havelot": False})
        db.delete(userlot)
        note_body = "You Have Successfully Revoked Your Parking Lot Reservation!"
    
    else:
        raise HTTPException(status_code=404, detail="You Don't Have A Parking Lot! Consider Reserving One")
    
    db.commit()
    # db.refresh(userlot)
    
    return generate_notification(db=db, note_type="Revocation", note_body=note_body, userid=user.user_id)

