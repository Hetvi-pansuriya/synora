from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db, engine, Base, SessionLocal
from models import Profile, Matchmaker, Note
from matching import get_matches
from gemini import generate_match_explanation, generate_intro_email
from dotenv import load_dotenv
from seed import seed
import os

load_dotenv()
Base.metadata.create_all(bind=engine)

Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    count = db.query(Profile).count()
    print(f"PROFILE COUNT: {count}")

    if count == 0:
        print("SEEDING DATABASE...")
        seed()
        print("DATABASE SEEDED SUCCESSFULLY")

except Exception as e:
    print("SEED ERROR:", e)

finally:
    db.close()

app = FastAPI(title="Synora API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# AUTH


@app.post("/login")
def login(data: dict, db: Session = Depends(get_db)):
    user = db.query(Matchmaker).filter(
        Matchmaker.username == data["username"],
        Matchmaker.password == data["password"]
    ).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {
        "success": True,
        "name": user.name,
        "username": user.username
    }

# CUSTOMERS

@app.get("/customers")
def get_customers(
    status: str = None,
    gender: str = None,
    city: str = None,
    search: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(Profile)

    if status:
        query = query.filter(Profile.status == status)
    if gender:
        query = query.filter(Profile.gender == gender)
    if city:
        query = query.filter(Profile.city == city)
    if search:
        query = query.filter(
            (Profile.first_name.ilike(f"%{search}%")) |
            (Profile.last_name.ilike(f"%{search}%")) |
            (Profile.designation.ilike(f"%{search}%")) |
            (Profile.company.ilike(f"%{search}%"))
        )

    profiles = query.all()
    return profiles


@app.get("/customers/{id}")
def get_customer(id: int, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.id == id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@app.put("/customers/{id}/status")
def update_status(id: int, data: dict, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.id == id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Not found")
    profile.status = data["status"]
    db.commit()
    return {"success": True}


# NOTES

@app.get("/customers/{id}/notes")
def get_notes(id: int, db: Session = Depends(get_db)):
    notes = db.query(Note).filter(Note.profile_id == id).all()
    return notes


@app.post("/customers/{id}/notes")
def add_note(id: int, data: dict, db: Session = Depends(get_db)):
    note = Note(
        profile_id=id,
        note=data["note"]
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


@app.delete("/notes/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
    return {"success": True}


# MATCHES

@app.get("/customers/{id}/matches")
def get_customer_matches(id: int, db: Session = Depends(get_db)):
    customer = db.query(Profile).filter(Profile.id == id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    all_profiles = db.query(Profile).all()
    matches = get_matches(customer, all_profiles)

    result = []
    for m in matches:
        p = m["profile"]
        explanation = generate_match_explanation(
            customer, p, m["strengths"], m["concerns"], m["score"]
        )
        email = generate_intro_email(customer, p, m["score"], m["strengths"])

        result.append({
            "id": p.id,
            "first_name": p.first_name,
            "last_name": p.last_name,
            "age": p.age,
            "city": p.city,
            "state": p.state,
            "designation": p.designation,
            "company": p.company,
            "annual_income": p.annual_income,
            "religion": p.religion,
            "photo_url": p.photo_url,
            "verified": p.verified,
            "score": m["score"],
            "label": m["label"],
            "emoji": m["emoji"],
            "strengths": m["strengths"],
            "concerns": m["concerns"],
            "ai_explanation": explanation,
            "intro_email": email
        })

    return result


# STATS — for dashboard cards

@app.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    total = db.query(Profile).count()
    active = db.query(Profile).filter(Profile.status == "Active").count()
    matched = db.query(Profile).filter(Profile.status == "Matched").count()
    pending = db.query(Profile).filter(Profile.status == "Pending").count()
    verified = db.query(Profile).filter(Profile.verified == True).count()
    male = db.query(Profile).filter(Profile.gender == "Male").count()
    female = db.query(Profile).filter(Profile.gender == "Female").count()

    return {
        "total": total,
        "active": active,
        "matched": matched,
        "pending": pending,
        "verified": verified,
        "male": male,
        "female": female
    }


# AI STANDALONE ROUTES

@app.post("/ai/intro-email")
def get_intro_email(data: dict, db: Session = Depends(get_db)):
    customer = db.query(Profile).filter(Profile.id == data["customer_id"]).first()
    match = db.query(Profile).filter(Profile.id == data["match_id"]).first()
    if not customer or not match:
        raise HTTPException(status_code=404, detail="Profile not found")
    email = generate_intro_email(customer, match, 0, [])
    return {"email": email}

@app.get("/")
def root():
    return {"status": "Synora Backend Running"}

@app.get("/health")
def health():
    return {"status": "ok"}