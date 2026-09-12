from fastapi import FastAPI

app = FastAPI()



#add all routes here and then .use it from routes folder


#server run gate
# run command is: python -m uvicorn App:app --reload
@app.get("/")
def root():
    return {"message": "Server is running"}