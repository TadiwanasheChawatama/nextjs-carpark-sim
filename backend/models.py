import datetime as dt
import uuid
import shortuuid

from sqlalchemy import (
    Column, String, Boolean, DateTime, Float, Integer, ForeignKey
)
from sqlalchemy.orm import relationship
from database import Base
from passlib.hash import bcrypt


class User(Base):
    __tablename__ = "users"

    id = Column(String(100), default=lambda: str(uuid.uuid1()), primary_key=True, index=True)
    name = Column(String(255), index=True)
    surname = Column(String(255), index=True)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    havelot = Column(Boolean, default=False)

    notifications = relationship("Notifications", back_populates="owner")
    accountbalance = relationship("AccountBalance", back_populates="owner")
    bookings = relationship("Booking", back_populates="user")

    def verify_password(self, password: str):
        return bcrypt.verify(password, self.hashed_password)


class Notifications(Base):
    __tablename__ = "notifications"

    note_id = Column(String(255), default=lambda: str(uuid.uuid4()), primary_key=True, index=True)
    user_id = Column(String(100), ForeignKey("users.id"))
    note_type = Column(String(40), default="normal")
    note_body = Column(String(255), default="")
    date_generated = Column(DateTime, default=dt.datetime.utcnow)

    owner = relationship("User", back_populates="notifications")


class AccountBalance(Base):
    __tablename__ = "accountbalance"

    account_id = Column(String(255), default=lambda: str(shortuuid.uuid()), primary_key=True)
    user_id = Column(String(100), ForeignKey("users.id"))
    balance = Column(Float, default=99.00, index=True)

    owner = relationship("User", back_populates="accountbalance")


class ParkingLots(Base):
    __tablename__ = "parkinglots"

    lot_id = Column(Integer, primary_key=True, index=True)
    lot_status = Column(String(50), default="vacant", index=True)

    bookings = relationship("Booking", back_populates="lot")


class Booking(Base):
    __tablename__ = "bookings"

    booking_id = Column(String(255), default=lambda: str(uuid.uuid4()), primary_key=True, index=True)
    lot_id = Column(Integer, ForeignKey("parkinglots.lot_id"))
    user_id = Column(String(100), ForeignKey("users.id"))
    start_time = Column(DateTime)
    end_time = Column(DateTime)

    lot = relationship("ParkingLots", back_populates="bookings")
    user = relationship("User", back_populates="bookings")
