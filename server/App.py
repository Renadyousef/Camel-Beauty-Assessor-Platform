from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.winner_camels_route import router as winner_camels_router
app = FastAPI()

# Local Vite dev server only (see client/vite.config.js — no custom port is
# set there, so Vite serves on its default 5173).
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#add all routes here and then .use it from routes folder
app.include_router(winner_camels_router)

#server run gate
# run command is: python -m uvicorn App:app --reload
@app.get("/")
def root():
    return {"message": "Server is running"}