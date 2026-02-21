# CircleTrust

Full-stack application with a **FastAPI + PyMongo** backend, **Firebase Auth**, and a **React + TypeScript** frontend.

## Prerequisites

- Python 3.11+
- Node.js 18+
- MongoDB (local or Atlas)
- A Firebase project with Authentication enabled

## Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env with your MongoDB URI and Firebase service-account path

uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`. Visit `/docs` for the interactive Swagger UI.

## Frontend Setup

```bash
cd frontend
npm install

cp .env.example .env
# Edit .env with your Firebase client config

npm run dev
```

The app will be available at `http://localhost:5173`.

## Project Structure

```
backend/
  app/
    main.py          # FastAPI app, CORS, root route
    config.py        # Settings via pydantic-settings
    database.py      # PyMongo client + db handle
    auth.py          # Firebase token verification dependency
    models/user.py   # Pydantic models
    routers/users.py # Example CRUD router (protected)

frontend/
  src/
    App.tsx                  # Routes + auth gating
    firebase.ts              # Firebase SDK init
    contexts/AuthContext.tsx  # Auth provider + useAuth hook
    api/client.ts            # Axios instance w/ token interceptor
    pages/Login.tsx          # Sign-in with Google
    pages/Dashboard.tsx      # Protected page
```

## Auth Flow

1. User signs in on the frontend via Firebase (Google popup).
2. Frontend gets a Firebase ID token and sends it as `Authorization: Bearer <token>` on every API request (handled by the Axios interceptor).
3. Backend verifies the token using the Firebase Admin SDK (`get_current_user` dependency).
