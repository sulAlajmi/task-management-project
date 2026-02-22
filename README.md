# Task Management App – Run Steps

## Prerequisites

- **Node.js** (v18+)
- **MongoDB** running locally, or a MongoDB connection string
- Two terminals (one for backend, one for frontend)

---

## 1. Backend

### 1.1 Install dependencies

```bash
cd backend
npm install
```

### 1.2 (Optional) Environment variables

Create `backend/.env` if you need to override defaults:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/task-management
JWT_SECRET=your-secret-key
```

- If MongoDB is on another host/port, set `MONGODB_URI`.
- If you skip `.env`, the app uses port `3000` and `mongodb://127.0.0.1:27017/task-management`.

### 1.3 Start MongoDB (if local)

Make sure MongoDB is running. For example, with Homebrew on macOS:

```bash
brew services start mongodb-community
```

Or run `mongod` in the background.

### 1.4 Run the backend

```bash
cd backend
npm run start:dev
```

Backend runs at **http://localhost:3000**.

---

## 2. Frontend

### 2.1 Install dependencies

```bash
cd frontend
npm install
```

### 2.2 (Optional) API URL

If the backend is not at `http://localhost:3000`, create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:3000
```

Change the URL if your backend uses a different host or port.

### 2.3 Run the frontend

```bash
cd frontend
npm start
```

Browser opens at **http://localhost:3000** (or another port if 3000 is taken, e.g. 3001). The React app will use `REACT_APP_API_URL` or `http://localhost:3000` for API calls.

---

## 3. Use the app

1. Open the frontend URL (e.g. **http://localhost:3000** or **http://localhost:3001**).
2. **Register**: go to Register, enter name, email, password (min 6 chars), submit.
3. **Login**: go to Login, enter the same email and password, submit.
4. After login you are on **Tasks**. Create, view, edit, and list tasks.
5. Use the **EN / AR** buttons in the header to switch language (Arabic uses RTL).

---

## Quick reference

| Step        | Where     | Command              |
|------------|-----------|----------------------|
| Backend    | `backend/`| `npm run start:dev`  |
| Frontend   | `frontend/`| `npm start`         |
| Backend URL| —         | http://localhost:3000 |
| Frontend URL| —        | http://localhost:3000 or 3001 |

If the frontend runs on a different port than the backend, CORS is already enabled on the backend so the browser can call the API.
