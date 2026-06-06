from dotenv import load_dotenv
import google.generativeai as genai
import os

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

def generate_match_explanation(customer, match, strengths, concerns, score):
    """
    Generates a warm 2-3 sentence explanation of why this is a good match.
    Uses customer and match details + compatibility data.
    """
    strengths_text = ", ".join(strengths[:3]) if strengths else "shared values"
    concerns_text = ", ".join(concerns[:2]) if concerns else "none"
    label = "High Potential" if score >= 75 else "Good Match" if score >= 55 else "Possible Match"

    prompt = f"""
You are Synora, a warm and professional AI matchmaker for an elite Indian matrimonial service.

Customer: {customer.first_name} {customer.last_name}, {customer.age} years old, 
{customer.city}, {customer.religion}, {customer.designation} at {customer.company},
Family values: {customer.family_values}, wants kids: {customer.want_kids}

Suggested Match: {match.first_name} {match.last_name}, {match.age} years old,
{match.city}, {match.religion}, {match.designation} at {match.company},
Family values: {match.family_values}, wants kids: {match.want_kids}

Compatibility score: {score}/100 — {label}
Key strengths: {strengths_text}
Potential concerns: {concerns_text}

Write a warm, human, specific 2-3 sentence explanation of why this could be a meaningful match.
Do NOT use generic phrases like "great match" or "perfect for each other".
Be specific to their actual details. Mention one strength naturally.
Tone: professional yet warm, like a trusted friend who is a matchmaker.
Keep it under 60 words.
"""

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception:
        return f"{match.first_name} and {customer.first_name} share {strengths_text}, making this a {label.lower()} with strong potential for a meaningful connection."


def generate_intro_email(customer, match, score, strengths):
    """
    Generates a personalized introduction email from the matchmaker
    to send to the customer introducing their match.
    """
    strengths_text = ", ".join(strengths[:2]) if strengths else "compatible values and life goals"

    prompt = f"""
You are Priya Sharma, a senior matchmaker at Synora — a premium Indian matrimonial service.

Write a short, warm, personalized introduction email (4-5 sentences) introducing 
{customer.first_name} to their potential match {match.first_name}.

Customer: {customer.first_name} {customer.last_name}, {customer.age}, 
{customer.city}, {customer.designation} at {customer.company}

Match: {match.first_name} {match.last_name}, {match.age}, 
{match.city}, {match.designation} at {match.company},
Religion: {match.religion}, Family values: {match.family_values}

Key compatibility: {strengths_text}
Compatibility score: {score}/100

Rules:
- Start with: Dear {customer.first_name},
- Mention one specific detail about the match naturally
- End with an encouraging next step
- Tone: warm, personal, professional
- No generic phrases
- Under 100 words
- Sign off as: Warm regards, Priya Sharma, Synora Matchmaker
"""

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception:
        return f"""Dear {customer.first_name},

We are delighted to introduce you to {match.first_name} {match.last_name}, a {match.age}-year-old {match.designation} based in {match.city}. They share {strengths_text} with you, which we believe creates a strong foundation for a meaningful relationship.

We encourage you to review their profile and let us know if you would like to take this forward.

Warm regards,
Priya Sharma, Synora Matchmaker"""