from fastapi import FastAPI
from routes.winner_camels_route import router as winner_camels_router
app = FastAPI()



#add all routes here and then .use it from routes folder
app.include_router(winner_camels_router)

#server run gate
# run command is: python -m uvicorn App:app --reload
@app.get("/")
def root():
    return {"message": "Server is running"}