from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
import database_conn
from database_conn import ServiceRequest, Bid

# Auto-Sync Database on Start
database_conn.sync_schema()

app = FastAPI(title="LubeLink API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/requests")
def create_request(data: dict, db: Session = Depends(database_conn.get_db)):
    new_req = ServiceRequest(
        customer_name=data.get("name"),
        car_model=data.get("car"),
        address=data.get("address"),
        latitude=data.get("lat"),
        longitude=data.get("lng"),
        service_type=data.get("oil_type"), # Mapping oil choice
        scheduled_date=data.get("date"),
        scheduled_time=data.get("time")
    )
    db.add(new_req)
    db.commit()
    db.refresh(new_req)
    return {"id": new_req.id, "status": "Success"}

@app.get("/api/requests/{req_id}/bids")
def get_bids(req_id: str, db: Session = Depends(database_conn.get_db)):
    """Fetches bids for a specific customer request"""
    return db.query(Bid).filter(Bid.request_id == req_id).all()

@app.post("/api/bids")
def submit_bid(data: dict, db: Session = Depends(database_conn.get_db)):
    """Handles 'SUBMIT BID' from provider view"""
    new_bid = Bid(
        request_id=data.get("request_id"),
        provider_name=data.get("provider"),
        price=data.get("price"),
        eta=data.get("eta")
    )
    db.add(new_bid)
    db.commit()
    return {"status": "Bid Received"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8081)