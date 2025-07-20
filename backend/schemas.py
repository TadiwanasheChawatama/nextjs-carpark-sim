import datetime as dt
from pydantic import BaseModel, Field


# === USERS ===

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    hashed_password: str
    name: str
    surname: str

    class Config:
        orm_mode = True

class UserOut(UserBase):
    id: str

    class Config:
        orm_mode = True
        from_attributes = True

class UserDetails(UserBase):
    id: str
    name: str
    surname: str

    class Config:
        orm_mode = True
        from_attributes = True


# === NOTIFICATIONS ===

class NotificationBase(BaseModel):
    note_type: str = Field(default="normal")
    note_body: str

class NotificationCreate(NotificationBase):
    pass

class NotificationOut(NotificationBase):
    user_id: str
    date_generated: dt.datetime

    class Config:
        orm_mode = True
        from_attributes = True


# === ACCOUNT BALANCE ===

class AccountBase(BaseModel):
    account_id: str

class AccountBalanceOut(AccountBase):
    user_id: str
    balance: float = Field(default=99.00)

    class Config:
        orm_mode = True
        from_attributes = True


# === PAYMENTS ===

class Payment(BaseModel):
    user_id: str
    amount: float


# === PARKING LOT ===

class ParkingLotOut(BaseModel):
    lot_id: int
    lot_status: str

    class Config:
        orm_mode = True
        from_attributes = True


# === BOOKINGS ===

class BookingCreate(BaseModel):
    lot_id: int
    user_id: str
    start_time: dt.datetime
    end_time: dt.datetime

    class Config:
        orm_mode = True
        from_attributes = True


# === AUTH / MISC ===

class Login(BaseModel):
    email: str
    password: str

    class Config:
        orm_mode = True
        from_attributes = True


class PullNotes(BaseModel):
    user_id: str

    class Config:
        orm_mode = True
        from_attributes = True


class PullUser(BaseModel):
    email: str

    class Config:
        orm_mode = True
        from_attributes = True


class Reserve(BaseModel):
    userid: str
    hours: int
    immediate_booking: bool = Field(default=True)

    class Config:
        orm_mode = True
        from_attributes = True
