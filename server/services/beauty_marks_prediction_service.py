from pathlib import Path

from ultralytics import YOLO

MODEL_PATH = Path(__file__).resolve().parent.parent / "models" / "model.pt"

model = YOLO(str(MODEL_PATH))


def read_camels(images):
    # Process up to 20 images at once
    if len(images) > 20:
        raise ValueError("Maximum 20 images per batch.")

    results = model.predict(
        images,
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

        # Sort beauty traits from highest confidence to lowest to see the highest prop to detec tthese features as beauty
        traits = dict(
            sorted(
                traits.items(),
                key=lambda item: item[1]["confidence"],
                reverse=True
            )
        )

        prediction = {
            "model_file": "model.pt",
            "source_run": "b1-rgb",
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