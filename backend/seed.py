from faker import Faker
from faker.providers import person
import random
from database import engine, SessionLocal, Base
from models import Profile,Matchmaker
from datetime import datetime

fake=Faker('en_IN')
Base.metadata.create_all(bind=engine)

CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", 
          "Pune", "Ahmedabad", "Kolkata", "Jaipur", "Surat",
          "Vadodara", "Indore", "Bhopal", "Lucknow", "Nagpur"]

STATES = {"Mumbai": "Maharashtra", "Delhi": "Delhi", "Bangalore": "Karnataka",
          "Chennai": "Tamil Nadu", "Hyderabad": "Telangana", "Pune": "Maharashtra",
          "Ahmedabad": "Gujarat", "Kolkata": "West Bengal", "Jaipur": "Rajasthan",
          "Surat": "Gujarat", "Vadodara": "Gujarat", "Indore": "Madhya Pradesh",
          "Bhopal": "Madhya Pradesh", "Lucknow": "Uttar Pradesh", "Nagpur": "Maharashtra"}

RELIGIONS = ["Hindu", "Muslim", "Christian", "Sikh", "Jain", "Buddhist"]

CASTES = {"Hindu": ["Brahmin", "Kshatriya", "Vaishya", "Rajput", "Patel", "Maratha"],
          "Muslim": ["Sunni", "Shia", "Ismaili"],
          "Christian": ["Catholic", "Protestant"],
          "Sikh": ["Jat", "Khatri", "Arora"],
          "Jain": ["Digambar", "Shvetambara"],
          "Buddhist": ["Theravada", "Mahayana"]}

DEGREES = ["B.Tech", "B.E.", "B.Sc", "B.Com", "BBA", "MBBS", "B.Arch", "BA"]

POSTGRAD = ["M.Tech", "MBA", "M.Sc", "MCA", "None", "None", "None"]

COMPANIES = ["TCS", "Infosys", "Wipro", "HCL", "Tech Mahindra", "Accenture",
             "Cognizant", "Capgemini", "IBM", "Oracle", "Microsoft", "Google",
             "Amazon", "Flipkart", "Zomato", "Swiggy", "HDFC Bank", "ICICI Bank"]

DESIGNATIONS = ["Software Engineer", "Data Analyst", "Product Manager", "Business Analyst",
                "Senior Developer", "DevOps Engineer", "UI/UX Designer", "Project Manager",
                "Doctor", "Teacher", "Chartered Accountant", "Lawyer", "Architect"]

HOBBIES_LIST = ["Reading", "Travelling", "Cooking", "Music", "Photography",
                "Yoga", "Cricket", "Badminton", "Dancing", "Painting", "Gaming"]

LANGUAGES = ["Hindi", "English", "Gujarati", "Marathi", "Tamil", "Telugu",
             "Kannada", "Bengali", "Punjabi", "Malayalam"]

MOTHER_TONGUES =["Hindi", "English", "Gujarati", "Marathi", "Tamil", "Telugu",
             "Kannada", "Bengali", "Punjabi", "Malayalam"]

ABOUT_MALE = [
    "Family-oriented professional who values traditions while embracing modern outlook.",
    "Passionate about technology and building meaningful relationships.",
    "Adventure lover who believes in growing together as a team.",
    "Simple, honest, and hardworking individual looking for a life partner.",
    "Believes in mutual respect and understanding in relationships."
]

ABOUT_FEMALE = [
    "Independent and ambitious woman who values family bonds deeply.",
    "Creative soul with a passion for art, travel, and meaningful connections.",
    "Warm-hearted professional seeking a partner who values equality and love.",
    "Grounded in values, open to new experiences, and ready to build a future.",
    "Believes that a happy family is built on trust, communication and care."
]

def generate_profile(gender,index):
    religion=random.choice(RELIGIONS)
    city=random.choice(CITIES)

    if gender=="Male":
        first_name=fake.first_name_male()
        age=random.randint(24,35)
        height=random.randint(165,185)
        income=random.randint(400000, 2500000)
        about=random.choice(ABOUT_MALE)
        photo=f"https://randomuser.me/api/portraits/men/{index % 99}.jpg"
        partner_age_min = age - 5
        partner_age_max = age + 1
    else:
        first_name = fake.first_name_female()
        age = random.randint(21, 32)
        height = random.randint(150, 170)
        income = random.randint(300000, 1800000)
        about = random.choice(ABOUT_FEMALE)
        photo = f"https://randomuser.me/api/portraits/women/{index % 99}.jpg"
        partner_age_min = age
        partner_age_max = age + 7

    last_name=fake.last_name()
    current_year = datetime.now().year
    dob_year = current_year - age

    hobbies=",".join(random.sample(HOBBIES_LIST,3))
    languages=",".join(random.sample(LANGUAGES,random.randint(2,4)))
    caste=random.choice(CASTES.get(religion,["General"]))

    return Profile (
        first_name=first_name,
        last_name=last_name,
        gender=gender,
        age=age,
        date_of_birth=f"{random.randint(1,28)}/{random.randint(1,12)}/{dob_year}",
        height_cm=height,
        weight_kg=random.randint(50, 85),
        complexion=random.choice(["Fair", "Wheatish", "Wheatish Brown", "Dark"]),
        blood_group=random.choice(["A+", "B+", "O+", "AB+", "A-", "B-", "O-"]),
        about_me=about,
        photo_url=photo,
        city=city,
        state=STATES.get(city, "Gujarat"),
        country="India",
        email=f"{first_name.lower()}.{last_name.lower()}{random.randint(1,99)}@gmail.com",
        phone=f"+91 {random.randint(7000000000, 9999999999)}",
        father_name=fake.name_male(),
        father_occupation=random.choice(["Business", "Government Service", "Doctor", "Engineer", "Retired"]),
        mother_name=fake.name_female(),
        mother_occupation=random.choice(["Homemaker", "Teacher", "Business", "Government Service"]),
        siblings=random.randint(0, 3),
        family_type=random.choice(["Nuclear", "Joint"]),
        family_values=random.choice(["Traditional", "Moderate", "Liberal"]),
        degree=random.choice(DEGREES),
        college=fake.company() + " University",
        postgraduate=random.choice(POSTGRAD),
        company=random.choice(COMPANIES),
        designation=random.choice(DESIGNATIONS),
        annual_income=income,
        work_mode=random.choice(["Remote", "Office", "Hybrid"]),
        diet=random.choice(["Vegetarian", "Non-Vegetarian", "Eggetarian"]),
        smoking=random.choice(["No", "Occasionally", "Yes"]),
        drinking=random.choice(["No", "Occasionally", "Yes"]),
        exercise=random.choice(["Daily", "Weekly", "Rarely"]),
        hobbies=hobbies,
        pets=random.choice(["Yes", "No", "Maybe"]),
        religion=religion,
        caste=caste,
        languages=languages,
        marital_status=random.choice(["Never Married", "Divorced", "Widowed"]),
        mother_tongue=random.choice(MOTHER_TONGUES),
        want_kids=random.choice(["Yes", "No", "Maybe"]),
        open_to_relocate=random.choice(["Yes", "No", "Maybe"]),
        open_to_pets=random.choice(["Yes", "No", "Maybe"]),
        partner_age_min=partner_age_min,
        partner_age_max=partner_age_max,
        timeline_to_marry=random.choice(["Within 6 Months","Within 1 Year","Within 2 Years","Flexible"]),
        status=random.choice(["New Lead","Profile Verification","Active Matching","Meeting Scheduled","Follow Up","Matched","Closed"]),
        assigned_to="matchmaker1",
        verified=random.choice([True, True, True, False]),
        last_activity=str(fake.date_time_this_month())
)

def seed():
    db=SessionLocal()
    db.query(Profile).delete()
    db.query(Matchmaker).delete()


    matchmaker=Matchmaker(
        username="matchmaker",
        password="tdc123",
        name="Priya Sharma"
    )
    db.add(matchmaker)


    for i in range(50):
        db.add(generate_profile("Male",i))
    for i in range(50):
        db.add(generate_profile("Female",i))


    db.commit()
    db.close()

    print("Database seeded sucessfully with 100 profiles!")

if __name__== "__main__":
    seed()

    