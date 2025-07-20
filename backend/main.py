#main.py file
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
# import fastapi.security as _security
from typing import List
from schemas import *
import services
import models
from database import engine, SessionLocal
from sqlalchemy.orm import Session


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Define a list of allowed origins
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "https://localhost:5000"
]

# Configure CORS middleware with allowed origins, methods, and headers
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  # Ensures cookies & authentication headers work
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def read_root():
    return {"message": "Backend is working!"}

@app.post("/api/users")
async def create_user(user: UserCreate, db: Session = Depends(services.get_db)):
    db_user = services.get_user_by_email(user, db)
    
    if db_user:
        raise HTTPException(status_code=400, detail="Email Already In Use")
    
    created_user = services.create_user(user, db)
    return created_user
    


@app.post("/api/login")
async def log_in(user: Login, db:Session = Depends(services.get_db)):
    user = services.auth_user(user.model_dump(), db=db)
    return user



@app.get("/api/notifications/{userid}", response_model=List[NotificationOut])
async def get_notifications(userid: str, db: Session = Depends(services.get_db)):
    return services.get_my_notifications(userid=userid, db=db)


@app.get("/api/my_account/", response_model=List[AccountBalanceOut])
async def get_my_account(user_id:str, db:Session = Depends(services.get_db)):
    return services.get_account(user_id, db=db)

@app.put("/api/pay_now/{userid}/{amount}", status_code=200)
async def pay_for_parking_now(amount: float, userid: str, db: Session = Depends(services.get_db)):
    return services.pay_for_Lot(amount, userid,db)    

@app.post("/api/book_parking", status_code=200)
async def book_parking_lot(details: Reserve, immediate_booking: bool = True, db: Session = Depends(services.get_db)):
    return services.book_parking_lot(details=details, db=db)

@app.get("/api/revoke_my_resrvation/{userid}")
async def revoke_my_parking_lot(userid: str, db: Session = Depends(services.get_db)):
    return services.revoke_reservation(userid=userid, db=db)

@app.get("/api/my_parkinglot")
async def get_my_parking_lot(userid: str, db: Session = Depends(services.get_db)):
    return services.get_user_lot(userid=userid, db=db)

@app.get("/resetAccount")
async def reset_account_balance(userid: str, db: Session = Depends(services.get_db)):
    return services.reset_balance(userid=userid, db=db)

@app.get("/api")
async def root():
    return {"message": "Success!"}

@app.post("/api/curr_user")
async def get_user(useremail: PullUser, db: Session = Depends(services.get_db)):
    return services.get_user_by_email(useremail=useremail, db=db)

@app.post("/my_lot")
async def show_my_lot(user: PullNotes, db: Session = Depends(services.get_db)):
    return services.return_your_lot(user=user, db=db)

@app.post("/api/revoke")
async def revoke_my_lot(user: PullNotes, db: Session = Depends(services.get_db)):
    return services.revoke_my_reservation(user=user, db=db)

#if you want to add lots to the db, uncommnet the code below
@app.get("/populate_lots")
def populate_the_lots(db: Session = Depends(services.get_db)):
    for x in range(1, 51):
        lot = models.ParkingLots(lot_id=x)
        db.add(lot)
        db.commit()
        db.refresh(lot)
    return {
        "message": "50 Parking Lots Added Successfully"
    }