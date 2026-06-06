# SYNORA MATCHING ALGORITHM v2
# Separate scoring logic for Male and Female customers
# Based on Indian matrimonial research (Shaadi.com, Jeevansathi.com, eHarmony)
#
# MALE CUSTOMER SCORING (100 points):
# Religion & Culture    → 25 pts
# Life Goals            → 20 pts  
# Lifestyle             → 15 pts
# Career & Income       → 15 pts (candidate earns less/equal)
# Family Values         → 15 pts
# Location              → 10 pts
#
# FEMALE CUSTOMER SCORING (100 points):
# Life Goals & Values   → 25 pts (women prioritize emotional alignment)
# Religion & Culture    → 20 pts
# Career & Ambition     → 20 pts (stability matters more)
# Lifestyle             → 15 pts
# Family Values         → 10 pts
# Location              → 10 pts


def get_designation_level(designation):
    senior = ["Senior Developer", "Project Manager", "Product Manager",
              "Architect", "Doctor", "Chartered Accountant", "Lawyer"]
    mid = ["Software Engineer", "Data Analyst", "Business Analyst",
           "DevOps Engineer", "UI/UX Designer", "Teacher"]
    if designation in senior:
        return 3
    elif designation in mid:
        return 2
    else:
        return 1


def hard_filter(customer, candidate):
    # Must be opposite gender
    if customer.gender == candidate.gender:
        return False

    # Age must be within preferred range
    if not (customer.partner_age_min <= candidate.age <= customer.partner_age_max):
        return False

    # Marital status
    if customer.marital_status == "Never Married":
        if candidate.marital_status not in ["Never Married", "Divorced"]:
            return False

    return True


# MALE CUSTOMER SCORING FUNCTIONS

def male_score_religion(customer, candidate):
    """Religion & Culture — 25 pts for male customer"""
    score = 0
    strengths = []
    concerns = []

    if customer.religion == candidate.religion:
        score += 18
        strengths.append(f"Same religion ({customer.religion})")
        if customer.caste == candidate.caste:
            score += 5
            strengths.append(f"Same community ({customer.caste})")
        if hasattr(customer, 'mother_tongue'):
            if customer.mother_tongue == candidate.mother_tongue:
                score += 2
                strengths.append(f"Same mother tongue")
    else:
        score += 3
        concerns.append("Different religious backgrounds")

    return min(score, 25), strengths, concerns


def male_score_life_goals(customer, candidate):
    """Life Goals — 20 pts for male customer"""
    score = 0
    strengths = []
    concerns = []

    # Kids
    if customer.want_kids == candidate.want_kids:
        score += 10
        strengths.append(f"Aligned on having children ({customer.want_kids})")
    elif "Maybe" in [customer.want_kids, candidate.want_kids]:
        score += 5
    else:
        concerns.append("Different views on having children")

    # Relocation
    if customer.open_to_relocate == candidate.open_to_relocate:
        score += 6
        strengths.append("Compatible relocation preferences")
    elif "Yes" in [customer.open_to_relocate, candidate.open_to_relocate]:
        score += 3

    # Marriage timeline
    if hasattr(customer, 'timeline_to_marry') and hasattr(candidate, 'timeline_to_marry'):
        if customer.timeline_to_marry == candidate.timeline_to_marry:
            score += 4
            strengths.append(f"Same marriage timeline")
        elif "Flexible" in [customer.timeline_to_marry, candidate.timeline_to_marry]:
            score += 2

    return min(score, 20), strengths, concerns


def male_score_lifestyle(customer, candidate):
    """Lifestyle — 15 pts for male customer"""
    score = 0
    strengths = []
    concerns = []

    # Diet
    if customer.diet == candidate.diet:
        score += 6
        strengths.append(f"Same diet ({customer.diet})")
    elif customer.diet == "Vegetarian" and candidate.diet == "Non-Vegetarian":
        concerns.append("Diet mismatch — may affect daily life")

    # Smoking
    if customer.smoking == candidate.smoking:
        score += 4
        if customer.smoking == "No":
            strengths.append("Both non-smokers")
    elif customer.smoking == "No" and candidate.smoking == "Yes":
        score -= 3
        concerns.append("Candidate smokes")

    # Drinking
    if customer.drinking == candidate.drinking:
        score += 3
        if customer.drinking == "No":
            strengths.append("Both non-drinkers")

    # Exercise
    if customer.exercise == candidate.exercise:
        score += 2
        strengths.append(f"Similar fitness habits ({customer.exercise})")

    return min(score, 15), strengths, concerns


def male_score_career(customer, candidate):
    """
    Career & Income — 15 pts for male customer
    Traditional Indian matrimony: male prefers candidate who earns 
    equal or less, similar career level
    """
    score = 0
    strengths = []
    concerns = []

    # Income — candidate earns less or equal
    if candidate.annual_income <= customer.annual_income:
        score += 8
        strengths.append("Compatible income levels")
    elif candidate.annual_income <= customer.annual_income * 1.2:
        score += 5  # Slightly more is fine
    else:
        score += 2
        concerns.append("Significant income gap")

    # Work mode
    if customer.work_mode == candidate.work_mode:
        score += 4
        strengths.append(f"Same work style ({customer.work_mode})")
    elif "Remote" in [customer.work_mode, candidate.work_mode]:
        score += 2

    # Career level
    cl = get_designation_level(customer.designation)
    ml = get_designation_level(candidate.designation)
    if abs(cl - ml) <= 1:
        score += 3
        strengths.append("Similar career levels")

    return min(score, 15), strengths, concerns


def male_score_family(customer, candidate):
    """Family Values — 15 pts for male customer"""
    score = 0
    strengths = []
    concerns = []

    if customer.family_values == candidate.family_values:
        score += 9
        strengths.append(f"Shared family values ({customer.family_values})")
    elif abs(
        ["Traditional", "Moderate", "Liberal"].index(customer.family_values) -
        ["Traditional", "Moderate", "Liberal"].index(candidate.family_values)
    ) == 1:
        score += 4
    else:
        concerns.append("Very different family outlooks")

    if customer.family_type == candidate.family_type:
        score += 6
        strengths.append(f"Both from {customer.family_type} families")

    return min(score, 15), strengths, concerns


def male_score_location(customer, candidate):
    """Location — 10 pts for male customer"""
    score = 0
    strengths = []

    if customer.city == candidate.city:
        score += 10
        strengths.append(f"Same city ({customer.city})")
    elif customer.state == candidate.state:
        score += 6
        strengths.append(f"Same state ({customer.state})")

    return min(score, 10), strengths


# FEMALE CUSTOMER SCORING FUNCTIONS

def female_score_life_goals(customer, candidate):
    """
    Life Goals & Emotional Values — 25 pts for female customer
    Women in Indian matrimony prioritize emotional alignment,
    stability, and life vision match more than religion alone
    """
    score = 0
    strengths = []
    concerns = []

    # Kids — most important
    if customer.want_kids == candidate.want_kids:
        score += 10
        strengths.append(f"Aligned on having children ({customer.want_kids})")
    elif "Maybe" in [customer.want_kids, candidate.want_kids]:
        score += 5
    else:
        concerns.append("Different views on having children")

    # Relocation — very important for women
    if customer.open_to_relocate == candidate.open_to_relocate:
        score += 7
        strengths.append("Compatible relocation preferences")
    elif candidate.open_to_relocate == "Yes":
        score += 4
        strengths.append("Partner is open to relocation")

    # Pets
    if customer.open_to_pets == candidate.open_to_pets:
        score += 4
        strengths.append("Compatible on pets")

    # Marriage timeline
    if hasattr(customer, 'timeline_to_marry') and hasattr(candidate, 'timeline_to_marry'):
        if customer.timeline_to_marry == candidate.timeline_to_marry:
            score += 4
            strengths.append(f"Same marriage timeline")
        elif "Flexible" in [customer.timeline_to_marry, candidate.timeline_to_marry]:
            score += 2

    return min(score, 25), strengths, concerns


def female_score_religion(customer, candidate):
    """Religion & Culture — 20 pts for female customer"""
    score = 0
    strengths = []
    concerns = []

    if customer.religion == candidate.religion:
        score += 14
        strengths.append(f"Same religion ({customer.religion})")
        if customer.caste == candidate.caste:
            score += 4
            strengths.append(f"Same community ({customer.caste})")
        if hasattr(customer, 'mother_tongue'):
            if customer.mother_tongue == candidate.mother_tongue:
                score += 2
                strengths.append("Same mother tongue")
    else:
        score += 2
        concerns.append("Different religious backgrounds")

    return min(score, 20), strengths, concerns


def female_score_career(customer, candidate):
    """
    Career & Ambition — 20 pts for female customer
    Women in Indian matrimony research prioritize partner
    financial stability and career ambition more heavily
    """
    score = 0
    strengths = []
    concerns = []

    # Income — candidate should earn equal or more
    if candidate.annual_income >= customer.annual_income:
        score += 10
        strengths.append("Strong financial stability")
    elif candidate.annual_income >= customer.annual_income * 0.8:
        score += 6
        strengths.append("Comparable income levels")
    else:
        score += 2
        concerns.append("Income gap may need discussion")

    # Career level — equal or higher is preferred
    cl = get_designation_level(customer.designation)
    ml = get_designation_level(candidate.designation)
    if ml >= cl:
        score += 6
        strengths.append("Strong career profile")
    elif ml == cl - 1:
        score += 3

    # Work mode flexibility
    if candidate.work_mode in ["Remote", "Hybrid"]:
        score += 4
        strengths.append(f"Flexible work arrangement ({candidate.work_mode})")

    return min(score, 20), strengths, concerns


def female_score_lifestyle(customer, candidate):
    """Lifestyle — 15 pts for female customer"""
    score = 0
    strengths = []
    concerns = []

    # Diet
    if customer.diet == candidate.diet:
        score += 5
        strengths.append(f"Same diet ({customer.diet})")
    elif customer.diet == "Vegetarian" and candidate.diet == "Non-Vegetarian":
        score -= 2
        concerns.append("Diet preference mismatch")

    # Smoking — women rate this higher concern
    if candidate.smoking == "No":
        score += 5
        strengths.append("Non-smoker")
    elif candidate.smoking == "Yes":
        score -= 3
        concerns.append("Candidate smokes")

    # Drinking
    if candidate.drinking == "No":
        score += 3
        strengths.append("Non-drinker")
    elif candidate.drinking == "Yes":
        score -= 2
        concerns.append("Candidate drinks")

    # Exercise — shared healthy lifestyle
    if customer.exercise == candidate.exercise:
        score += 2
        strengths.append("Similar fitness habits")

    return min(score, 15), strengths, concerns


def female_score_family(customer, candidate):
    """Family Values — 10 pts for female customer"""
    score = 0
    strengths = []
    concerns = []

    if customer.family_values == candidate.family_values:
        score += 6
        strengths.append(f"Shared family values ({customer.family_values})")
    elif abs(
        ["Traditional", "Moderate", "Liberal"].index(customer.family_values) -
        ["Traditional", "Moderate", "Liberal"].index(candidate.family_values)
    ) == 1:
        score += 3
    else:
        concerns.append("Different family outlooks")

    if customer.family_type == candidate.family_type:
        score += 4
        strengths.append(f"Both from {customer.family_type} families")

    return min(score, 10), strengths, concerns


def female_score_location(customer, candidate):
    """Location — 10 pts for female customer"""
    score = 0
    strengths = []

    if customer.city == candidate.city:
        score += 10
        strengths.append(f"Same city ({customer.city})")
    elif customer.state == candidate.state:
        score += 6
        strengths.append(f"Same state ({customer.state})")

    return min(score, 10), strengths


# MASTER FUNCTIONS

def get_match_label(score):
    if score >= 75:
        return "High Potential", "🟣"
    elif score >= 55:
        return "Good Match", "🔵"
    elif score >= 35:
        return "Possible Match", "⚪"
    else:
        return "Low Compatibility", "🔴"


def calculate_compatibility(customer, candidate):
    """
    Runs gender-specific scoring pipeline.
    Male customer → male scoring functions
    Female customer → female scoring functions
    """
    total_score = 0
    all_strengths = []
    all_concerns = []

    if customer.gender == "Male":
        s1, str1, con1 = male_score_religion(customer, candidate)
        s2, str2, con2 = male_score_life_goals(customer, candidate)
        s3, str3, con3 = male_score_lifestyle(customer, candidate)
        s4, str4, con4 = male_score_career(customer, candidate)
        s5, str5, con5 = male_score_family(customer, candidate)
        s6, str6 = male_score_location(customer, candidate)
        total_score = s1+s2+s3+s4+s5+s6
        all_strengths = str1+str2+str3+str4+str5+str6
        all_concerns = con1+con2+con3+con4+con5

    else:
        s1, str1, con1 = female_score_life_goals(customer, candidate)
        s2, str2, con2 = female_score_religion(customer, candidate)
        s3, str3, con3 = female_score_career(customer, candidate)
        s4, str4, con4 = female_score_lifestyle(customer, candidate)
        s5, str5, con5 = female_score_family(customer, candidate)
        s6, str6 = female_score_location(customer, candidate)
        total_score = s1+s2+s3+s4+s5+s6
        all_strengths = str1+str2+str3+str4+str5+str6
        all_concerns = con1+con2+con3+con4+con5

    # Bonus points
    if candidate.verified:
        total_score += 3
        all_strengths.append("Verified profile ✓")

    total_score = min(total_score, 100)
    label, emoji = get_match_label(total_score)

    return {
        "score": total_score,
        "label": label,
        "emoji": emoji,
        "strengths": all_strengths[:5],
        "concerns": all_concerns[:3]
    }


def get_matches(customer, all_profiles):
    """Main entry — filter, score, sort, return top 10"""
    results = []

    for candidate in all_profiles:
        if candidate.id == customer.id:
            continue
        if not hard_filter(customer, candidate):
            continue

        match_data = calculate_compatibility(customer, candidate)

        if match_data["score"] >= 20:
            results.append({
                "profile": candidate,
                **match_data
            })

    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:10]