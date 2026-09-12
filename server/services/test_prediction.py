from services.beauty_marks_prediction_service import read_camel

image_path = "test.png"

result = read_camel(image_path)

print(result)