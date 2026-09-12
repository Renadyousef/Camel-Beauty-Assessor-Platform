from beauty_marks_prediction_service import read_camels

image_paths = [
    "test.png",
    "test2.png"
]

results = read_camels(image_paths)

for i, result in enumerate(results, start=1):
    print(f"\nCamel {i}:")
    print(result)