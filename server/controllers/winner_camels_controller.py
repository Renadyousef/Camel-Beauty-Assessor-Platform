from services.beauty_marks_prediction_service import read_camels


# Takes the 20 camel predictions
# For each camel:
# 1. Convert each trait's confidence from 0–1 to a percentage X100
# 2. SUM all trait percentages to get the camel's beauty score
# 3. SUM the 20 camel scores to get the team's total score
# Algorithm Summary: trait confidence → trait % → sum traits → camel score → sum 20 camels → team score → compare teams.
def score_team(predictions):
    camels = []
    total_score = 0

    for index, prediction in enumerate(predictions, start=1):

        trait_report = {}
        beauty_score = 0

        for name, trait in prediction["traits"].items():

            confidence = trait["confidence"]
            # Convert the model confidence (0–1) to a percentage 
            percentage = round(confidence * 100, 2) 

            # Add the trait percentage to the camel's beauty score
            beauty_score += percentage

            trait_report[name] = {
                "percentage": percentage,
                "box_xyxyn": trait["box_xyxyn"]
            }

        # Total score for this camel it can be more than 100 as each trait can be 1-100%

        beauty_score = round(beauty_score, 2)
        # Add this camel's score to the team's total score 
        total_score += beauty_score

        camels.append({
            "camel_number": index,
            "camel_confidence": round(
                prediction["camel"]["confidence"] * 100, 2
            ),
            "beauty_score": beauty_score,
            "traits": trait_report
        })

    return {
        "total_score": round(total_score, 2),
        "camels": camels
    }

# --- Display-only normalization, added for frontend integration ---------
# None of this feeds back into the winner decision below — it only reshapes
# score_team()'s existing numbers (beauty_score / total_score, both sums of
# up to 8 trait percentages each) into a 0-100 range for the UI to show.

TRAIT_COUNT = 8

def normalize_camel_score(beauty_score):
    return round(beauty_score / TRAIT_COUNT, 2)

def compute_trait_averages(camels):
    if not camels:
        return {}

    trait_names = camels[0]["traits"].keys()

    return {
        name: round(
            sum(camel["traits"][name]["percentage"] for camel in camels) / len(camels),
            2
        )
        for name in trait_names
    }

# Adds team_name, overall_score, trait_averages, per-camel normalized_score
# and top_camels to score_team()'s output, for frontend display only.
def enrich_team(team_result, team_name):
    camels = team_result["camels"]

    enriched_camels = [
        {**camel, "normalized_score": normalize_camel_score(camel["beauty_score"])}
        for camel in camels
    ]

    top_camels = sorted(
        enriched_camels,
        key=lambda camel: camel["normalized_score"],
        reverse=True
    )[:3]

    overall_score = round(
        team_result["total_score"] / (len(camels) * TRAIT_COUNT),
        2
    ) if camels else 0

    return {
        "team_name": team_name,
        "total_score": team_result["total_score"],
        "overall_score": overall_score,
        "trait_averages": compute_trait_averages(camels),
        "camels": enriched_camels,
        "top_camels": top_camels,
    }

# Process two batches of 20 camels and determine the winning team
def winner_camels_batch(team1_images, team2_images, team1_name="Team 1", team2_name="Team 2"):

    team1_predictions = read_camels(team1_images)
    team2_predictions = read_camels(team2_images)

    #Get each team total score

    team1 = score_team(team1_predictions)
    team2 = score_team(team2_predictions)

    # Winner decision untouched: still Renad's raw total_score comparison —
    # only the label attached to the winning side now uses the real team
    # name instead of the literal "Team 1" / "Team 2".
    if team1["total_score"] > team2["total_score"]:
        winner = team1_name
    elif team2["total_score"] > team1["total_score"]:
        winner = team2_name
    else:
        winner = "Tie"

    return {
        "winner": winner,
        "team1": enrich_team(team1, team1_name),
        "team2": enrich_team(team2, team2_name)
    }