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

# Process two batches of 20 camels and determine the winning team
def winner_camels_batch(team1_images, team2_images):

    team1_predictions = read_camels(team1_images)
    team2_predictions = read_camels(team2_images)

    #Get each team total score

    team1 = score_team(team1_predictions)
    team2 = score_team(team2_predictions)

    if team1["total_score"] > team2["total_score"]:
        winner = "Team 1"
    elif team2["total_score"] > team1["total_score"]:
        winner = "Team 2"
    else:
        winner = "Tie"

    return {
        "winner": winner,
        "team1": team1,
        "team2": team2
    }