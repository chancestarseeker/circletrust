"""
Static community resource directory for Richmond, VA and keyword matcher.

Resources sourced from the /directory skill (RVAorgs Linktree, findhelp.org,
system_alt_trauma_heal, How_to_build_a_care_collective, GetFlockOut).
"""

from dataclasses import dataclass, field


@dataclass
class Resource:
    name: str
    category: str
    description: str
    contact: str  # URL, phone, or other contact info
    keywords: list[str] = field(default_factory=list)


RESOURCES: list[Resource] = [
    # --- Baby & Family Supplies ---
    Resource(
        name="Little Hands",
        category="baby_supplies",
        description="Free baby and kid supplies including diapers, wipes, formula, clothing, and gear for Richmond-area families.",
        contact="https://linktr.ee/RVAorgs",
        keywords=["diapers", "baby", "formula", "infant", "newborn", "wipes",
                  "baby supplies", "baby clothes", "kids", "children", "toddler",
                  "car seat", "stroller", "family", "need diapers",
                  "baby items", "baby gear", "diaper", "pampers"],
    ),
    # --- Mutual Aid ---
    Resource(
        name="MAD RVA",
        category="mutual_aid",
        description="Free store providing clothing, household goods, and community supplies at no cost.",
        contact="https://madrva.org",
        keywords=["free", "store", "clothing", "household", "supplies", "mutual aid",
                  "goods", "furniture", "donations"],
    ),
    Resource(
        name="Richmond Peoples Assembly",
        category="mutual_aid",
        description="Community organizing and political education collective in Richmond.",
        contact="https://linktr.ee/RVAorgs",
        keywords=["community", "organizing", "political", "assembly", "activism",
                  "mutual aid", "collective"],
    ),
    Resource(
        name="Queer RVA",
        category="mutual_aid",
        description="Queer mutual aid resources and community support in Richmond.",
        contact="https://linktr.ee/RVAorgs",
        keywords=["queer", "lgbtq", "gay", "trans", "nonbinary", "mutual aid",
                  "community", "support"],
    ),
    Resource(
        name="River City Harm Redux",
        category="mutual_aid",
        description="Harm reduction services including naloxone distribution and safer supply resources.",
        contact="https://linktr.ee/RVAorgs",
        keywords=["harm reduction", "naloxone", "narcan", "overdose", "addiction",
                  "substance", "drugs", "recovery", "syringe"],
    ),
    Resource(
        name="Sunrise Mutual Aid Apothecary",
        category="mutual_aid",
        description="Free and low-cost herbalist services and community wellness.",
        contact="https://linktr.ee/RVAorgs",
        keywords=["herbs", "herbalist", "apothecary", "wellness", "natural",
                  "holistic", "healing"],
    ),
    Resource(
        name="RVA Tool Library",
        category="mutual_aid",
        description="Borrow tools for free — power tools, hand tools, gardening equipment.",
        contact="https://rvatoolbox.odoo.com",
        keywords=["tools", "borrow", "drill", "saw", "gardening", "repair",
                  "fix", "build", "construction"],
    ),
    Resource(
        name="Mask Bloc RVA",
        category="mutual_aid",
        description="Free COVID masks distribution for individuals and community events.",
        contact="https://linktr.ee/maskblocrva",
        keywords=["masks", "covid", "ppe", "health", "protection", "free masks"],
    ),
    Resource(
        name="Breathe Easy RVA",
        category="mutual_aid",
        description="Free community air filtration program — CR boxes and clean air resources.",
        contact="https://lnk.bio/BreatheEasyRVA",
        keywords=["air", "filtration", "covid", "clean air", "purifier", "breathing"],
    ),
    # --- Food Access ---
    Resource(
        name="RVA Community Fridges",
        category="food",
        description="24/7 free food fridges located across Richmond. Take what you need, leave what you can.",
        contact="https://rvacommunityfridges.com",
        keywords=["food", "fridge", "free food", "groceries", "hungry", "eat",
                  "meals", "community fridge", "pantry"],
    ),
    Resource(
        name="Richmond Food Not Bombs",
        category="food",
        description="Free hot meals served to anyone, no questions asked.",
        contact="https://donatefoodnotbombs.wixsite.com/richmond",
        keywords=["food", "meals", "hot meals", "free food", "hungry", "eat",
                  "lunch", "dinner", "vegan"],
    ),
    Resource(
        name="Shalom Farms",
        category="food",
        description="Fresh produce and food justice programming for Richmond communities.",
        contact="https://shalomfarms.org",
        keywords=["food", "produce", "vegetables", "fruits", "farm", "fresh",
                  "healthy", "nutrition", "garden"],
    ),
    Resource(
        name="Peter Paul Food Pantry",
        category="food",
        description="Quality food items for households experiencing food insecurity. Open 1st and 3rd Wednesday of each month.",
        contact="804-780-1195",
        keywords=["food", "pantry", "groceries", "food bank", "hungry", "eat",
                  "canned food", "food insecurity"],
    ),
    Resource(
        name="Highland Park Food Pantry",
        category="food",
        description="Food distribution for low-income individuals/households. 1st and 3rd Saturday, 9:00-11:00 AM.",
        contact="804-321-3182",
        keywords=["food", "pantry", "groceries", "food bank", "hungry", "eat",
                  "low income"],
    ),
    Resource(
        name="Tabernacle Baptist Church Food Pantry",
        category="food",
        description="Emergency food assistance bags (2-3 days of food). Open 2nd Saturday of each month.",
        contact="https://linktr.ee/RVAorgs",
        keywords=["food", "emergency", "pantry", "groceries", "food bank",
                  "hungry", "eat", "emergency food"],
    ),
    Resource(
        name="CAPUP Food Pantry",
        category="food",
        description="Capital Area Partnership Uplifting People — food for households in need. 1021 Oliver Hill Way, Richmond VA 23219. Mon-Thu 9am-5pm.",
        contact="1021 Oliver Hill Way, Richmond, VA 23219",
        keywords=["food", "pantry", "groceries", "food bank", "hungry", "eat"],
    ),
    Resource(
        name="RVA Black Farmers Market",
        category="food",
        description="Local Black-owned farm vendors offering fresh produce and goods.",
        contact="https://rvablackfarmersmarket.com",
        keywords=["food", "farmers market", "produce", "vegetables", "fruits",
                  "local", "black owned", "farm"],
    ),
    Resource(
        name="We Are CHEW",
        category="food",
        description="Free cooking classes and food education for the community.",
        contact="https://wearechew.com",
        keywords=["cooking", "classes", "food", "education", "nutrition",
                  "meals", "recipes"],
    ),
    # --- Housing ---
    Resource(
        name="Housing Resource Line (HRL)",
        category="housing",
        description="Free housing resource line from Partnership for Housing Affordability. Serves Richmond, Henrico, Chesterfield, and surrounding counties.",
        contact="https://www.findhelp.org/partnership-for-housing-affordability--richmond-va--housing-resource-line-(hrl)/5875042954772480?postal=23063",
        keywords=["housing", "rent", "apartment", "shelter", "homeless",
                  "eviction", "landlord", "lease", "home", "house"],
    ),
    Resource(
        name="Commonwealth Catholic Charities",
        category="housing",
        description="Housing Resource Center providing one-on-one support, assessments, help finding housing, and shelter facilities.",
        contact="https://www.findhelp.org",
        keywords=["housing", "shelter", "homeless", "assessment", "support",
                  "emergency housing", "restroom", "facilities"],
    ),
    # --- Healthcare & Mental Health ---
    Resource(
        name="Daily Planet Health Services",
        category="healthcare",
        description="Outpatient medical, dental, mental health, and substance use disorder services.",
        contact="804-783-2505",
        keywords=["health", "doctor", "medical", "dental", "mental health",
                  "therapy", "substance use", "clinic", "healthcare"],
    ),
    Resource(
        name="PTSD Hotline",
        category="healthcare",
        description="Free 24/7 crisis support line for PTSD and trauma.",
        contact="866-210-1303",
        keywords=["ptsd", "trauma", "crisis", "hotline", "mental health",
                  "anxiety", "depression"],
    ),
    Resource(
        name="Crisis Text Line",
        category="healthcare",
        description="Free 24/7 crisis support via text message. Text HOME to 741741.",
        contact="Text HOME to 741741",
        keywords=["crisis", "text", "mental health", "suicide", "depression",
                  "anxiety", "emergency"],
    ),
    Resource(
        name="The Warm Line",
        category="healthcare",
        description="Peer-run mental health support line for non-crisis emotional support.",
        contact="866-400-6428",
        keywords=["mental health", "peer support", "emotional", "talk",
                  "lonely", "sad", "stressed", "anxiety", "warm line"],
    ),
    Resource(
        name="Nationz Foundation",
        category="healthcare",
        description="Free testing programs for the Richmond community.",
        contact="https://linktr.ee/RVAorgs",
        keywords=["testing", "health", "free", "screening", "std", "hiv",
                  "community health"],
    ),
    # --- Clothing ---
    Resource(
        name="Eastern Henrico FISH",
        category="clothing",
        description="Emergency clothing, food, rental, mortgage, and utility assistance.",
        contact="804-257-7730",
        keywords=["clothing", "clothes", "emergency", "rent", "utility",
                  "assistance", "bills", "shoes", "coat"],
    ),
    Resource(
        name="Bethel Boutique",
        category="clothing",
        description="Free clothing and toiletries for men, women, and children. Open Wednesdays.",
        contact="https://www.findhelp.org/goods/clothing--richmond-va",
        keywords=["clothing", "clothes", "toiletries", "free", "shoes",
                  "dress", "pants", "shirts"],
    ),
    # --- Legal Aid ---
    Resource(
        name="Central Virginia Legal Aid Society (CVLAS)",
        category="legal",
        description="Free civil legal assistance for low-income people in Richmond, Petersburg, Charlottesville and surrounding areas.",
        contact="804-648-1012",
        keywords=["legal", "lawyer", "attorney", "court", "civil", "law",
                  "custody", "eviction", "rights", "legal aid"],
    ),
    Resource(
        name="ACLU of Virginia",
        category="legal",
        description="Legal assistance for civil liberties and civil rights cases in Virginia.",
        contact="https://www.findhelp.org/american-civil-liberties-union-(aclu)-of-virginia--richmond-va--legal-assistance/4854459198603264?postal=23173",
        keywords=["legal", "rights", "civil rights", "civil liberties", "aclu",
                  "discrimination", "freedom", "justice"],
    ),
    Resource(
        name="Legal Aid Justice Center — Richmond",
        category="legal",
        description="Free legal services for low-income families throughout Central Virginia.",
        contact="https://www.valegalaid.org/organization/legal-aid-justice-center-richmond-office",
        keywords=["legal", "lawyer", "attorney", "family law", "immigration",
                  "low income", "free legal", "justice"],
    ),
    # --- Employment & Education ---
    Resource(
        name="Office of Community Wealth Building (OCWB)",
        category="employment",
        description="Free career services: career exploration, job readiness, counseling, vocational training, adult education.",
        contact="https://www.findhelp.org/city-of-richmond---office-of-community-wealth-building--richmond-va--employment-and-workforce-development-program/5707616880951296?postal=23173",
        keywords=["job", "employment", "career", "training", "work", "resume",
                  "education", "GED", "vocational", "hire"],
    ),
    Resource(
        name="Job Corps",
        category="employment",
        description="Hands-on career technical training in high-growth industries. GED/diploma, skill training, and job placement.",
        contact="https://www.findhelp.org/job-corps--washington-dc--job-skills-and-training/5928271591112704?postal=23173",
        keywords=["job", "training", "career", "GED", "diploma", "skills",
                  "placement", "trade", "technical"],
    ),
    Resource(
        name="Virginia Employment Commission (VEC)",
        category="employment",
        description="Unemployment benefits and job search assistance.",
        contact="https://www.findhelp.org/provider/virginia-employment-commission-(vec)--richmond-va/6483669915795456?postal=23173",
        keywords=["unemployment", "job search", "benefits", "employment",
                  "work", "job", "hire"],
    ),
    # --- Transportation ---
    Resource(
        name="Richmond Transportation Assistance",
        category="transportation",
        description="32 transportation assistance programs in the Richmond area including bus passes and ride-sharing.",
        contact="https://www.findhelp.org/transit/transportation--richmond-va",
        keywords=["ride", "transportation", "bus", "transit", "car", "drive",
                  "appointment", "travel", "commute"],
    ),
    # --- Reproductive Health ---
    Resource(
        name="Richmond Reproductive Freedom",
        category="healthcare",
        description="Reproductive justice resources and support services for the Richmond area.",
        contact="https://linktr.ee/RVAorgs",
        keywords=["reproductive", "abortion", "pregnancy", "birth control",
                  "contraception", "family planning", "prenatal"],
    ),
    # --- Community Spaces ---
    Resource(
        name="Rag & Bones Co-op Bike Shop",
        category="mutual_aid",
        description="Co-op bike shop offering free and low-cost bike repair and builds.",
        contact="https://ragandbonesrva.org",
        keywords=["bike", "bicycle", "repair", "transportation", "co-op",
                  "cycling", "fix"],
    ),
]


def match_resources(query: str, limit: int = 5) -> list[dict]:
    """
    Match a freeform query against the resource directory using keyword overlap.

    Returns a list of dicts sorted by relevance (keyword hit score),
    limited to `limit` results. Falls back to general mutual aid if no matches.
    """
    query_lower = query.lower()
    # Filter out short words that cause noisy substring matches
    query_words = {w for w in query_lower.split() if len(w) >= 3}

    scored: list[tuple[float, Resource]] = []
    for resource in RESOURCES:
        score = 0.0
        for keyword in resource.keywords:
            # Exact phrase match in the query string
            if keyword in query_lower:
                score += 2.0
            # Word-level partial match (only meaningful words)
            elif any(word in keyword or keyword in word for word in query_words):
                score += 1.0
        if score > 0:
            scored.append((score, resource))

    scored.sort(key=lambda x: x[0], reverse=True)

    results = [
        {
            "name": r.name,
            "category": r.category,
            "description": r.description,
            "contact": r.contact,
            "relevance_score": s,
        }
        for s, r in scored[:limit]
    ]

    if not results:
        fallback = next(r for r in RESOURCES if r.name == "MAD RVA")
        results = [{
            "name": fallback.name,
            "category": fallback.category,
            "description": fallback.description,
            "contact": fallback.contact,
            "relevance_score": 0,
        }]

    return results
