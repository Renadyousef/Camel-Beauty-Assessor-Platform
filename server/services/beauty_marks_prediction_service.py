from pathlib import Path

from PIL import Image, ImageOps
from ultralytics import YOLO


MODEL_PATH = (
    Path(__file__).resolve().parent.parent
    / "models"
    / "model_gray_chosen.pt"
)

model = YOLO(str(MODEL_PATH))


def preprocess_image(image):
    """
    Apply the preprocessing required by the grayscale model.

    Original image
        -> fix phone-photo rotation
        -> grayscale
        -> RGB format for YOLO
    """

    # If a file path was passed
    if isinstance(image, (str, Path)):
        img = Image.open(image)

    # If a file-like object was passed
    else:
        img = Image.open(image)

    img = ImageOps.exif_transpose(img)

    # Data scientist's preprocessing:
    # grayscale (L) -> RGB
    img = img.convert("L").convert("RGB")

    return img


def read_camels(images):
    # Process up to 20 images at once
    if len(images) > 20:
        raise ValueError("Maximum 20 images per batch.")

    # Preprocess every image before sending them to YOLO
    processed_images = [
        preprocess_image(image)
        for image in images
    ]

    results = model.predict(
        processed_images,
        conf=0.01,
        imgsz=640,
        verbose=False
    )

    predictions = []

    for result in results:

        # Store the best detection for each class
        top = {}

        for cls, conf, box in zip(
            result.boxes.cls.int().tolist(),
            result.boxes.conf.tolist(),
            result.boxes.xyxyn.tolist()
        ):
            name = model.names[cls]

            if conf > top.get(name, (0.0, None))[0]:
                top[name] = (
                    round(conf, 4),
                    [round(v, 4) for v in box]
                )

        # Return every beauty trait, even when not detected
        traits = {
            name: {
                "confidence": top.get(name, (0.0, None))[0],
                "box_xyxyn": top.get(name, (0.0, None))[1]
            }
            for name in model.names.values()
            if name != "Camel"
        }

        # Sort beauty traits from highest confidence to lowest
        traits = dict(
            sorted(
                traits.items(),
                key=lambda item: item[1]["confidence"],
                reverse=True
            )
        )

        prediction = {
            "model_file": "model_gray_chosen.pt",
            "source_run": "b1-gray",
            "dataset_version": "v2",
            "dataset": "plain",
            "imgsz": 640,
            "conf": 0.01,

            # Camel detection is kept separate
            "camel": {
                "confidence": top.get("Camel", (0.0, None))[0],
                "box_xyxyn": top.get("Camel", (0.0, None))[1]
            },

            # Only beauty traits are sorted here
            "traits": traits
        }

        predictions.append(prediction)

    return predictions