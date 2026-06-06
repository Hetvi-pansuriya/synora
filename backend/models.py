from sqlalchemy import Column,Integer,String,Float,Boolean,Text,DateTime
from datetime import datetime
from database import Base

class Profile(Base):
    __tablename__="profiles"

    id=Column(Integer, primary_key=True, index=True)

    #personal
    first_name=Column(String)
    last_name=Column(String)
    gender=Column(String)
    age=Column(Integer)
    date_of_birth=Column(String)
    height_cm=Column(Integer)
    weight_kg=Column(Integer)
    complexion=Column(String)
    blood_group=Column(String)
    about_me=Column(Text)
    photo_url=Column(String)

    #location
    city=Column(String)
    state=Column(String)
    country=Column(String, default="India")

    #contact
    email=Column(String)
    phone=Column(String)

    #family
    father_name=Column(String)
    father_occupation=Column(String)
    mother_name=Column(String)
    mother_occupation=Column(String)
    siblings=Column(Integer)
    family_type=Column(String)
    family_values=Column(String)

    #education and career
    degree=Column(String)
    college=Column(String)
    postgraduate=Column(String)
    company=Column(String)
    designation=Column(String)
    annual_income=Column(Float)
    work_mode=Column(String)

    #lifestyle
    diet=Column(String)
    smoking=Column(String)
    drinking=Column(String)
    exercise=Column(String)
    hobbies=Column(String)
    pets=Column(String)

    #identity
    religion=Column(String)
    caste=Column(String)
    languages=Column(String)
    marital_status=Column(String)
    mother_tongue=Column(String)

    #preference
    want_kids=Column(String)
    open_to_relocate=Column(String)
    open_to_pets=Column(String)
    partner_age_min=Column(Integer)
    partner_age_max=Column(Integer)
    timeline_to_marry = Column(String)

    #status
    status=Column(String, default="Active")
    assigned_to=Column(String, default="matchmaker1")
    verified=Column(Boolean, default=True)
    last_activity=Column(String)

class Matchmaker(Base):
    __tablename__="matchmakers"

    id=Column(Integer,primary_key=True)
    username=Column(String, unique=True)
    password=Column(String)
    name=Column(String)


class Note(Base):
    __tablename__="notes"

    id=Column(Integer, primary_key=True)
    profile_id=Column(Integer)
    note=Column(Text)
    
    created_at=Column(
        DateTime,
        default=datetime.utcnow
    )