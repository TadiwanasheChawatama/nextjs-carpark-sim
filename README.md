# Car Park Booking System

This project is a **full-stack web application** for managing car park bookings, built with [Next.js](https://nextjs.org/) for the frontend and [FastAPI](https://fastapi.tiangolo.com/) for the backend. It allows users to register, log in, book or reserve parking lots, view notifications, and manage their account balance. The backend uses a MySQL-compatible database (MariaDB) and is containerized with Docker for easy deployment.

---

## Features

- **User Registration & Authentication**: Secure sign-up and login flows.
- **Parking Lot Booking & Reservation**: Users can book or reserve parking lots for a specified number of hours.
- **Account Management**: View and manage account balance.
- **Notifications**: Users receive notifications for bookings, payments, and other actions.
- **Parking Lot Navigation**: Visual representation and navigation to the assigned parking lot.
- **Responsive UI**: Built with Tailwind CSS for a modern look.
- **Admin/Reset Tools**: Endpoints for resetting balances and populating lots (for development/demo).

---

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/), React, Tailwind CSS
- **Backend**: [FastAPI](https://fastapi.tiangolo.com/), SQLAlchemy, Passlib (for password hashing)
- **Database**: MariaDB (MySQL-compatible)
- **Containerization**: Docker, Docker Compose

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- (Optional for local dev) [Node.js](https://nodejs.org/) and [Python 3.11+](https://www.python.org/)

### Quick Start (Recommended)

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/nextjs-carpark-sim.git
   cd nextjs-carpark-sim
   ```

2. **Start all services with Docker Compose:**
   ```sh
   docker-compose up --build
   ```
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000](http://localhost:8000)
   - Database: [localhost:3306](localhost:3306)
   - phpMyAdmin: [http://localhost:5480](http://localhost:5480)

3. **Access the app:**  
   Open your browser at [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
.
├── backend/         # FastAPI backend (Python)
│   ├── main.py      # FastAPI app entrypoint
│   ├── models.py    # SQLAlchemy models
│   ├── schemas.py   # Pydantic schemas
│   ├── services.py  # Business logic
│   ├── database.py  # DB connection setup
│   └── ...
├── frontend/        # Next.js frontend (React)
│   ├── app/         # Next.js app directory
│   ├── components/  # React components
│   ├── public/      # Static assets (e.g., car.png)
│   └── ...
├── docker-compose.yaml
└── README.md
```

---

## Usage

- **Register** a new user or **log in** with existing credentials.
- **Book or reserve** a parking lot for a chosen number of hours.
- **View notifications** for booking confirmations, payments, and other events.
- **Check your account balance** and manage your parking lot.
- **Navigate** to your assigned parking lot using the visual interface.

---

## Development

### Frontend

```sh
cd frontend
npm install
npm run dev
```

### Backend

```sh
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Database

- Uses MariaDB (see credentials in `docker-compose.yaml`).
- Access via phpMyAdmin at [http://localhost:5480](http://localhost:5480).

---

## API Endpoints

- `POST /api/users` - Register a new user
- `POST /api/login` - User login
- `GET /api/notifications/{userid}` - Get user notifications
- `GET /api/my_account/` - Get account balance
- `POST /api/book_parking` - Book or reserve a parking lot
- `GET /api/my_parkinglot` - Get user's parking lot
- ...and more (see [backend/main.py](backend/main.py))

---

## Customization

- **Parking lot capacity**: Change in [backend/main.py](backend/main.py) (`/populate_lots` endpoint).
- **Pricing**: Adjust in [backend/services.py](backend/services.py) (`calculate_payment_amount` function).
- **Styling**: Modify Tailwind CSS in [frontend/app/globals.css](frontend/app/globals.css).

---

## License

This project is licensed under the MIT License.

---

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Docker](https://www.docker.com/)
