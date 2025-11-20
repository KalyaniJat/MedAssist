from fastapi import APIRouter, Query
# ✅ Corrected imports (relative)
# from ..core.utils import fetch_user_bundle, build_prompt_json, call_gemini, apply_allergy_filter
from ..core.utils import fetch_user_bundle, build_prompt_json, call_gemini_with_context as call_gemini, apply_allergy_filter
from ..models.schemas import RemedyPlan, Remedy


router = APIRouter()

@router.get("/suggest_remedies", response_model=RemedyPlan)
def suggest_remedies(user_id: int = Query(..., ge=1)):
    bundle = fetch_user_bundle(user_id)
    data = call_gemini(build_prompt_json(bundle, user_question=None))

    plan_items = [Remedy(**item) for item in data.get("plan", [])]
    plan_items = apply_allergy_filter(plan_items, bundle["allergies"])

    disclaimer = (
        "Educational use only; not medical advice. Outputs are intended for review by a licensed physician. "
        "Seek immediate care for alarming symptoms (severe pain, bleeding, breathing issues, fainting, chest pain, etc.)."
    )
    return RemedyPlan(user_id=user_id, disclaimer=disclaimer, plan=plan_items)
