import json
import os

from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import BaseModel

load_dotenv()

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")


class ReportSchema(BaseModel):
    team1_report: str
    team2_report: str
    winner_reason: str


def _fallback_report(reason):
    return {
        "team1_report": None,
        "team2_report": None,
        "winner_reason": None,
        "llm_status": reason,
    }


def _build_summary(winner_result):
    # Compact, numbers-only summary — no images, no bounding boxes,
    # no camel_confidence, no raw model output.
    def team_summary(team):
        return {
            "team_name": team["team_name"],
            "total_score": team["total_score"],
            "overall_score": team["overall_score"],
            "trait_averages": team["trait_averages"],
            "top_camels": [
                {
                    "camel_number": camel["camel_number"],
                    "normalized_score": camel["normalized_score"],
                }
                for camel in team["top_camels"]
            ],
        }

    return {
        "winner": winner_result["winner"],
        "team1": team_summary(winner_result["team1"]),
        "team2": team_summary(winner_result["team2"]),
    }


def _build_prompt(summary):
    return (
        "You are writing a short result summary for a camel beauty contest, "
        "to be read aloud to non-technical camel judges. The winner has "
        "already been decided by a fixed scoring process and is final — you "
        "must not change it, question it, or recalculate it. Using only the "
        "structured data below, explain the result.\n\n"
        f"Data:\n{summary}\n\n"
        "Write your response in Modern Standard Arabic: clear, "
        "concise, and neutral in tone. Do not mention AI, YOLO, confidence "
        "scores, models, or any technical implementation details — the "
        "judges only care about the camels and the result.\n\n"
        "Respond as JSON with exactly these keys: "
        "\"team1_report\", \"team2_report\", \"winner_reason\". "
        "Each value must be a short Arabic string (2-4 sentences). "
        "Do not include any other keys, markdown, or commentary."
    )


def _validate_report(parsed):
    required_fields = ("team1_report", "team2_report", "winner_reason")

    for field in required_fields:
        value = parsed.get(field)
        if not isinstance(value, str) or not value.strip():
            return False

    return True


async def generate_report(winner_result):
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        return _fallback_report("unavailable")

    try:
        summary = _build_summary(winner_result)
        prompt = _build_prompt(summary)

        client = genai.Client(api_key=api_key)

        config = types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ReportSchema,
        )

        response = await client.aio.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config=config,
        )

        parsed = json.loads(response.text)

        if not _validate_report(parsed):
            return _fallback_report("error")

        return {
            "team1_report": parsed["team1_report"],
            "team2_report": parsed["team2_report"],
            "winner_reason": parsed["winner_reason"],
            "llm_status": "ok",
        }

    except Exception:
        return _fallback_report("error")
