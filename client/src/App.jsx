import { useEffect, useState } from "react";
import AppHeader from "./components/AppHeader/AppHeader";
import DecorativeBackdrop from "./components/DecorativeBackdrop/DecorativeBackdrop";
import StepIndicator from "./components/StepIndicator/StepIndicator";
import CompetitionSetup from "./components/CompetitionSetup/CompetitionSetup";
import ImageUpload from "./components/ImageUpload/ImageUpload";
import Processing from "./components/Processing/Processing";
import Results from "./components/Results/Results";
import { adaptApiResponse } from "./services/adaptApiResponse";
import { clearSession, loadSession, saveSession } from "./services/sessionStore";
import { TEAM_SIZE } from "./config";
import "./App.css";

const emptyTeamImages = () => Array(TEAM_SIZE).fill(null);

const STEP_BY_NUMBER = { 1: "setup", 2: "upload", 3: "results" };

function revokeTeamImages(imageArray) {
  imageArray.forEach((img) => {
    if (img) URL.revokeObjectURL(img.url);
  });
}

export default function App() {
  // "setup" | "upload" | "processing" | "results"
  const [step, setStep] = useState("setup");
  const [teams, setTeams] = useState({ team1: null, team2: null });
  const [images, setImages] = useState({ team1: emptyTeamImages(), team2: emptyTeamImages() });
  const [uploadError, setUploadError] = useState(null);
  const [results, setResults] = useState(null);

  // Nothing is rendered until the saved session has been read, so the judge
  // never sees an empty Setup screen flash before their work reappears.
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    let cancelled = false;

    loadSession().then((saved) => {
      if (cancelled) {
        if (saved) {
          revokeTeamImages(saved.images.team1);
          revokeTeamImages(saved.images.team2);
        }
        return;
      }

      if (saved) {
        setStep(saved.step);
        setTeams(saved.teams);
        setImages(saved.images);
        setResults(saved.results);
      }

      setIsRestoring(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Processing is a transient state — it is stored as "upload" so a refresh
  // mid-analysis lands on the upload screen rather than waiting on a request
  // that is no longer running.
  useEffect(() => {
    if (isRestoring) return;
    saveSession({
      step: step === "processing" ? "upload" : step,
      teams,
      images,
      results,
    });
  }, [isRestoring, step, teams, images, results]);

  // Each screen should always open at its top, not wherever the previous
  // screen happened to be scrolled to.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  function handleSetupNext(team1, team2) {
    const changed = teams.team1?.name !== team1.name || teams.team2?.name !== team2.name;
    setTeams({ team1, team2 });
    // Team names are part of the analysed input, so renaming them invalidates
    // an existing result exactly like changing a photo does.
    if (changed) setResults(null);
    setStep("upload");
  }

  function handleImageSelect(teamKey, index, file) {
    setImages((prev) => {
      const nextTeamImages = [...prev[teamKey]];
      const existing = nextTeamImages[index];
      if (existing) URL.revokeObjectURL(existing.url);
      nextTeamImages[index] = { url: URL.createObjectURL(file), file };
      return { ...prev, [teamKey]: nextTeamImages };
    });

    // Replacing the flagged image clears the exception banner for it.
    setUploadError((prev) => (prev && prev.team === teamKey && prev.index === index ? null : prev));
    // A stored result no longer matches the photos it was computed from.
    setResults(null);
  }

  // Bulk selection: fills the empty slots in order, left to right, and never
  // touches a slot that already has an image. Extra files beyond the free
  // slots are dropped by TeamUploadPanel before this runs.
  function handleImagesSelect(teamKey, files) {
    setImages((prev) => {
      const nextTeamImages = [...prev[teamKey]];
      let fileIndex = 0;

      for (let i = 0; i < nextTeamImages.length && fileIndex < files.length; i += 1) {
        if (nextTeamImages[i]) continue;
        const file = files[fileIndex];
        nextTeamImages[i] = { url: URL.createObjectURL(file), file };
        fileIndex += 1;
      }

      return { ...prev, [teamKey]: nextTeamImages };
    });

    setResults(null);
  }

  function handleAnalyze() {
    setStep("processing");
  }

  function handleProcessingComplete(apiResult) {
    setResults(adaptApiResponse(apiResult, { team1Name: teams.team1.name, team2Name: teams.team2.name }));
    setStep("results");
  }

  function handleProcessingError(error) {
    setUploadError(error);
    setStep("upload");
  }

  function handleNewComparison() {
    revokeTeamImages(images.team1);
    revokeTeamImages(images.team2);
    setImages({ team1: emptyTeamImages(), team2: emptyTeamImages() });
    setTeams({ team1: null, team2: null });
    setUploadError(null);
    setResults(null);
    setStep("setup");
    clearSession();
  }

  // A step is reachable only once the work it depends on exists: the upload
  // screen needs team names, and the results screen needs a result that still
  // matches the current photos.
  function canNavigateTo(stepNumber) {
    if (step === "processing") return false;
    if (stepNumber === 1) return true;
    if (stepNumber === 2) return Boolean(teams.team1 && teams.team2);
    return Boolean(results);
  }

  function handleNavigate(stepNumber) {
    if (!canNavigateTo(stepNumber)) return;
    setStep(STEP_BY_NUMBER[stepNumber]);
  }

  const stepNumber = step === "setup" ? 1 : step === "upload" ? 2 : step === "processing" ? 2 : 3;

  if (isRestoring) return null;

  return (
    <div className="app">
      <DecorativeBackdrop />
      <AppHeader />
      <StepIndicator
        step={stepNumber}
        isProcessing={step === "processing"}
        canNavigateTo={canNavigateTo}
        onNavigate={handleNavigate}
      />

      <main className="main">
        {step === "setup" && <CompetitionSetup onNext={handleSetupNext} initialTeams={teams} />}

        {step === "upload" && (
          <ImageUpload
            teams={teams}
            images={images}
            onSelect={handleImageSelect}
            onSelectMany={handleImagesSelect}
            onAnalyze={handleAnalyze}
            uploadError={uploadError}
            onDismissError={() => setUploadError(null)}
          />
        )}

        {step === "processing" && (
          <Processing teams={teams} images={images} onComplete={handleProcessingComplete} onError={handleProcessingError} />
        )}

        {step === "results" && results && (
          <Results teams={teams} images={images} results={results} onNewComparison={handleNewComparison} />
        )}
      </main>
    </div>
  );
}