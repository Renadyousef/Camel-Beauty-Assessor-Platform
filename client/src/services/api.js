// ---------------------------------------------------------------------------
// Real backend client for POST /winner-camels. Builds the exact multipart
// contract the FastAPI route expects (server/routes/winner_camels_route.py):
// repeated "team1_images" / "team2_images" file fields plus team1_name /
// team2_name text fields. No "owner" field exists in that contract, and the
// Content-Type header is left for the browser to set (it must include the
// multipart boundary itself).
// ---------------------------------------------------------------------------

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function appendImages(formData, fieldName, teamImages) {
  teamImages.forEach((image) => {
    if (image?.file) formData.append(fieldName, image.file);
  });
}

export async function submitWinnerCamels({ teams, images }) {
  const formData = new FormData();

  appendImages(formData, "team1_images", images.team1);
  appendImages(formData, "team2_images", images.team2);
  formData.append("team1_name", teams.team1.name);
  formData.append("team2_name", teams.team2.name);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/winner-camels`, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new Error("تعذر الاتصال بالخادم. تحقق من اتصال الشبكة وحاول مرة أخرى.");
  }

  if (!response.ok) {
    let detail = "";
    try {
      const body = await response.json();
      if (body?.detail) {
        detail = ` — ${typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail)}`;
      }
    } catch {
      // Non-JSON error body; fall back to the status code alone.
    }
    throw new Error(`فشل تحليل الصور (رمز الحالة ${response.status})${detail}`);
  }

  return response.json();
}
