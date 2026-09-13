from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
import tempfile
import os

from controllers.winner_camels_controller import winner_camels_batch
# here assuming we wont save images after prediction thats why save temp in a file

router = APIRouter()

@router.post("/winner-camels")
async def winner_camels(
    team1_images: list[UploadFile] = File(...),
    team2_images: list[UploadFile] = File(...),
    team1_name: Optional[str] = Form(None),
    team2_name: Optional[str] = Form(None),
):
    print("1. Request received")
    print("Team 1:", len(team1_images))
    print("Team 2:", len(team2_images))

    team1_paths = []
    team2_paths = []

    try:
        print("2. Starting Team 1 upload")

        for image in team1_images:
            print("Saving:", image.filename)

            temp = tempfile.NamedTemporaryFile(
                delete=False,
                suffix=os.path.splitext(image.filename)[1]
            )

            temp.write(await image.read())
            temp.close()

            team1_paths.append(temp.name)

        print("3. Team 1 saved")

        print("4. Starting Team 2 upload")

        for image in team2_images:
            print("Saving:", image.filename)

            temp = tempfile.NamedTemporaryFile(
                delete=False,
                suffix=os.path.splitext(image.filename)[1]
            )

            temp.write(await image.read())
            temp.close()

            team2_paths.append(temp.name)

        print("5. Team 2 saved")

        print("6. Starting YOLO/controller")

        result = winner_camels_batch(
            team1_paths,
            team2_paths,
            team1_name or "Team 1",
            team2_name or "Team 2",
        )

        print("7. Controller finished")

        return result

    finally:
        print("8. Cleaning temporary files")

        for path in team1_paths + team2_paths:
            if os.path.exists(path):
                os.remove(path)

        print("9. Done")