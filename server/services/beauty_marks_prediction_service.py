from ultralytics import YOLO

model = YOLO("server/models/model.pt")


def read_camel(image):
    result = model.predict(
        image,
        conf=0.01,
        imgsz=640,
        verbose=False
    )[0]

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

    # Return every trait, even when not detected
    traits = {
        name: {
            "confidence": top.get(name, (0.0, None))[0],
            "box_xyxyn": top.get(name, (0.0, None))[1]
        }
        for name in model.names.values()
        if name != "Camel"
    }

    return {
        "model_file": "model.pt",
        "source_run": "b1-rgb",
        "dataset_version": "v2",
        "dataset": "plain",
        "imgsz": 640,
        "conf": 0.01,

        "camel": {
            "confidence": top.get("Camel", (0.0, None))[0],
            "box_xyxyn": top.get("Camel", (0.0, None))[1]
        },

        "traits": traits
    }