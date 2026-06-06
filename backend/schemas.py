from pydantic import BaseModel
from typing import Optional,List
from datetime import datetime

#login schema
class LoginRequest(BaseModel):
    username:str
    password:str
    
class LoginResponse(BaseModel):
    success:bool
    message:str
    name:str
    
#profile
class ProfileBase(BaseModel):
    first_name: str
    last_name: str
    gender: str
    age: int
    date_of_birth: str
    height_cm: int
    weight_kg: int
    complexion: str
    blood_group: str
    about_me: str
    photo_url: str
    city: str
    state: str
    country: str
    email: str
    phone: str
    father_name: str
    father_occupation: str
    mother_name: str
    mother_occupation: str
    siblings: int
    family_type: str
    family_values: str
    degree: str
    college: str
    postgraduate: str
    company: str
    designation: str
    annual_income: float
    work_mode: str
    diet: str
    smoking: str
    drinking: str
    exercise: str
    hobbies: str
    pets: str
    religion: str
    caste: str
    languages: str
    marital_status: str
    mother_tongue: str
    want_kids: str
    open_to_relocate: str
    open_to_pets: str
    partner_age_min: int
    partner_age_max: int
    timeline_to_marry: str
    status: str
    assigned_to: str
    verified: bool
    last_activity: str
    
#dashboard
class ProfileCardResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    gender: str
    age: int
    city: str
    designation: str
    status: str
    photo_url: str
    verified: bool
    
    class Config:
        from_attributes = True
        
#fullprofile
class ProfileDetailResponse(ProfileBase):
    id: int

    class Config:
        from_attributes = True
        
#notes
class NoteCreate(BaseModel):
    profile_id: int
    note: str


class NoteResponse(BaseModel):
    id: int
    profile_id: int
    note: str
    created_at: datetime

    class Config:
        from_attributes = True
        
#match
class MatchResponse(BaseModel):
    profile_id: int
    match_id: int
    score: int
    label: str
    strengths: List[str]
    concerns: List[str]
    ai_explanation: str
    
    
#ai
class AIIntroResponse(BaseModel):
    introduction: str
    
