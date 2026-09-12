from controllers.winner_camels_controller import winner_camels_batch


team1_images = [
    "controllers/test.png",
    "controllers/test3.png"
]

team2_images = [
    "controllers/test2.png",
    "controllers/test4.png"
]


result = winner_camels_batch(
    team1_images,
    team2_images
)


print("\n========== RESULT ==========")

print(f"\nWinner: {result['winner']}")

print("\n--- Team 1 ---")
print(f"Total score: {result['team1']['total_score']}")

for camel in result["team1"]["camels"]:
    print(f"\nCamel {camel['camel_number']}")
    print(f"Camel confidence: {camel['camel_confidence']}%")
    print(f"Beauty score: {camel['beauty_score']}")

    print("Traits:")
    for trait, data in camel["traits"].items():
        print(f"  {trait}: {data['percentage']}%")


print("\n--- Team 2 ---")
print(f"Total score: {result['team2']['total_score']}")

for camel in result["team2"]["camels"]:
    print(f"\nCamel {camel['camel_number']}")
    print(f"Camel confidence: {camel['camel_confidence']}%")
    print(f"Beauty score: {camel['beauty_score']}")

    print("Traits:")
    for trait, data in camel["traits"].items():
        print(f"  {trait}: {data['percentage']}%")