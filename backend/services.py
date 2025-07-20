import random
import datetime as dt
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.hash import bcrypt

from database import Base, engine, SessionLocal
import models, schemas

# =======================
# Database Setup
# =======================

def create_database():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =======================
# User Services
# =======================

def get_user_by_email(email: str, db: Session):
    return db.query(models.User).filter(models.User.email == email).first()

def authenticate_user(email: str, password: str, db: Session):
    user = get_user_by_email(email=email, db=db)
    if not user or not user.verify_password(password):
        return False
    return user

def auth_user(user: dict, db: Session):
    email = user.get("email")
    password = user.get("password")

    user_obj = get_user_by_email(email, db)
    if not user_obj:
        raise HTTPException(status_code=401, detail="Email not found")

    if not user_obj.verify_password(password):
        raise HTTPException(status_code=403, detail="Incorrect password")

    return user_obj

def create_user(user: schemas.UserCreate, db: Session):
    try:
        hashed_password = bcrypt.hash(user.hashed_password)
        user_data = user.model_dump()
        user_data.pop("hashed_password")

        user_obj = models.User(hashed_password=hashed_password, **user_data)
        db.add(user_obj)
        db.commit()
        db.refresh(user_obj)

        user_account = models.AccountBalance(user_id=user_obj.id)
        db.add(user_account)

        note_body = f"{user_obj.name}, Your Account Has Been Successfully Created!"
        note = models.Notifications(user_id=user_obj.id, note_body=note_body)
        db.add(note)

        db.commit()
        return {"message": note_body}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Client error: {str(e)}")

# =======================
# Notifications
# =======================

def generate_notification(db: Session, note_type: str, note_body: str, userid: str):
    note = models.Notifications(note_type=note_type, note_body=note_body, user_id=userid)
    db.add(note)
    db.commit()
    db.refresh(note)
    return schemas.NotificationOut.from_orm(note)

def get_my_notifications(userid: str, db: Session):
    notes = db.query(models.Notifications).filter_by(user_id=userid).all()
    return [schemas.NotificationOut.from_orm(note) for note in notes]

def get_notification(note_id: str, user: schemas.UserDetails, db: Session):
    note = (
        db.query(models.Notifications)
        .filter_by(user_id=user.id)
        .filter(models.Notifications.note_id == note_id)
        .first()
    )
    if not note:
        raise HTTPException(status_code=404, detail="Notification not found")
    return schemas.NotificationOut.from_orm(note)

# =======================
# Account & Payments
# =======================

def get_account(userid: str, db: Session):
    accounts = db.query(models.AccountBalance).filter_by(user_id=userid).all()
    return [schemas.AccountBalanceOut.from_orm(acc) for acc in accounts]

def pay_for_lot(amount: float, userid: str, db: Session):
    account = db.query(models.AccountBalance).filter_by(user_id=userid).first()
    user = db.query(models.User).filter_by(id=userid).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    if account.balance < amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    account.balance -= amount
    db.commit()

    note_body = f"{user.name}, your transaction was successful."
    return generate_notification(db=db, userid=userid, note_type="normal", note_body=note_body)

def reset_balance(userid: str, db: Session):
    db.query(models.AccountBalance).filter_by(user_id=userid).update({"balance": 99})
    db.commit()
    account = db.query(models.AccountBalance).filter_by(user_id=userid).first()
    return {"message": f"New Account Balance: ${account.balance}"}

# =======================
# Parking Lot Services
# =======================

def book_parking_lot(details: schemas.Reserve, db: Session):
    vacant_lots = db.query(models.ParkingLots).filter_by(lot_status="vacant").all()
    if not vacant_lots:
        raise HTTPException(status_code=404, detail="No vacant lots available")

    user = db.query(models.User).filter_by(id=details.userid).first()
    account = db.query(models.AccountBalance).filter_by(user_id=user.id).first()

    lot = random.choice(vacant_lots)
    cost = calculate_payment_amount(details.hours)

    if account.balance < cost:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    # Booking times
    now = dt.datetime.utcnow()
    end = now + dt.timedelta(hours=details.hours)

    # Update records
    account.balance -= cost
    lot.lot_status = "booked" if details.immediate_booking else "reserved"
    user.havelot = True

    booking = models.Booking(lot_id=lot.lot_id, user_id=user.id, start_time=now, end_time=end)
    db.add(booking)
    db.commit()
    db.refresh(booking)

    note_type = "transaction"
    note_body = f"{user.name}, you booked lot {lot.lot_id} for {details.hours} hours at ${cost}."
    return generate_notification(db, note_type, note_body, user.id)

def calculate_payment_amount(hours: int):
    return hours * 2

def revoke_reservation(user: schemas.PullNotes, db: Session):
    booking = db.query(models.Booking).filter_by(user_id=user.user_id).first()
    if not booking:
        return {"message": "No active reservation found."}

    lot = db.query(models.ParkingLots).filter_by(lot_id=booking.lot_id).first()
    lot.lot_status = "vacant"

    db.delete(booking)
    db.query(models.User).filter_by(id=user.user_id).update({"havelot": False})
    note_body = f"You have successfully revoked reservation for lot {lot.lot_id}."

    db.commit()
    return generate_notification(db=db, note_type="Revocation", note_body=note_body, userid=user.user_id)

def get_user_lot(userid: str, db: Session):
    lot = (
        db.query(models.ParkingLots)
        .join(models.Booking, models.Booking.lot_id == models.ParkingLots.lot_id)
        .filter(models.Booking.user_id == userid)
        .first()
    )
    if not lot:
        raise HTTPException(status_code=404, detail="No reserved lot found")
    return lot
