import { useEffect, useState } from "react";
import AppHeader from "./components/AppHeader/AppHeader";
import DecorativeBackdrop from "./components/DecorativeBackdrop/DecorativeBackdrop";
import StepIndicator from "./components/StepIndicator/StepIndicator";
import CompetitionSetup from "./components/CompetitionSetup/CompetitionSetup";
import ImageUpload from "./components/ImageUpload/ImageUpload";
import Processing from "./components/Processing/Processing";
import Results from "./components/Results/Results";
import { buildResults } from "./data/mockResults";
import { TEAM_SIZE } from "./config";
import "./App.css";

const emptyTeamImages = () => Array(TEAM_SIZE).fill(null);

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

  // Each screen should always open at its top, not wherever the previous
  // screen happened to be scrolled to.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  function handleSetupNext(team1, team2) {
    setTeams({ team1, team2 });
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
  }

  function handleAnalyze() {
    setStep("processing");
  }

  function handleProcessingComplete() {
    setResults(buildResults({ team1Name: teams.team1.name, team2Name: teams.team2.name }));
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
  }

  const stepNumber = step === "setup" ? 1 : step === "upload" ? 2 : step === "processing" ? 2 : 3;

  return (
    <div className="app">
      <DecorativeBackdrop />
      <AppHeader />
      <StepIndicator step={stepNumber} isProcessing={step === "processing"} />

      <main className="main">
        {step === "setup" && <CompetitionSetup onNext={handleSetupNext} />}

        {step === "upload" && (
          <ImageUpload
            teams={teams}
            images={images}
            onSelect={handleImageSelect}
            onAnalyze={handleAnalyze}
            uploadError={uploadError}
            onDismissError={() => setUploadError(null)}
          />
        )}

        {step === "processing" && <Processing onComplete={handleProcessingComplete} onError={handleProcessingError} />}

        {step === "results" && results && (
          <Results teams={teams} images={images} results={results} onNewComparison={handleNewComparison} />
        )}
      </main>
    </div>
  );
}
