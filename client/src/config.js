// ---------------------------------------------------------------------------
// Frontend-only demo switches.
//
// DEMO_IMAGE_ERROR / DEMO_ERROR_SLOT let you exercise the "AI failed to
// analyze one image" exception state without a real backend. Flip
// DEMO_IMAGE_ERROR to true, run the app, upload 20 images per team and click
// "بدء التحليل" — Processing will stop partway through and hand control
// back to the Upload screen with that one slot flagged.
//
// This is NOT image validation. There is no pre-upload quality check
// anywhere in this app by design (see ImageUpload) — this only simulates a
// failure that the real Computer Vision pipeline could report mid-analysis.
// ---------------------------------------------------------------------------

export const DEMO_IMAGE_ERROR = false;

// Which team ("team1" | "team2") and which camel number (1-20) the demo
// error should point at.
export const DEMO_ERROR_TEAM = "team2";
export const DEMO_ERROR_CAMEL_NUMBER = 7;

export const TEAM_SIZE = 20;
export const TOTAL_IMAGES = TEAM_SIZE * 2;
