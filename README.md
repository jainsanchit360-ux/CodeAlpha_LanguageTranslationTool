# Language Translation Tool

A modern, full-stack language translation application using FastAPI, Googletrans, React, and Tailwind CSS.

## Startup Commands

### 1. Run the Backend (FastAPI)
Open a new terminal, navigate to the `translation-tool/backend` directory, install dependencies, and start the Uvicorn server:
```bash
cd translation-tool/backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
The API will be available at `http://localhost:8000`.

### 2. Run the Frontend (React)
Open a new terminal, navigate to the `translation-tool/frontend` directory, install dependencies (if not already done), and start the Vite dev server:
```bash
cd translation-tool/frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`.
