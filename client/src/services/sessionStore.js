// ---------------------------------------------------------------------------
// Session persistence, so a refresh (or an accidental tab reload mid-judging)
// never costs the judge the 40 photos they already uploaded.
//
// IndexedDB rather than localStorage: the uploaded camel photos are File
// objects, and localStorage stores strings only — base64-encoding 40 photos
// would both inflate them by a third and blow far past its ~5MB ceiling.
// IndexedDB stores the File objects themselves, untouched.
//
// Everything here is best-effort: any failure resolves to "no session" and the
// app simply starts fresh, so storage problems can never block judging.
// ---------------------------------------------------------------------------

const DB_NAME = "camel-beauty-assessor";
const DB_VERSION = 1;
const STORE_NAME = "session";
const SESSION_KEY = "current";

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB unavailable"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function runTransaction(mode, run) {
  return openDatabase().then(
    (db) =>
      new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, mode);
        const store = transaction.objectStore(STORE_NAME);
        const request = run(store);

        transaction.oncomplete = () => {
          db.close();
          resolve(request?.result);
        };
        transaction.onerror = () => {
          db.close();
          reject(transaction.error);
        };
      }),
  );
}

/**
 * Saves the whole session in one record. `images` holds the raw File objects
 * only — object URLs are recreated on load, since a URL from a previous page
 * life is already revoked by the browser.
 */
export function saveSession({ step, teams, images, results }) {
  return runTransaction("readwrite", (store) =>
    store.put(
      {
        step,
        teams,
        images: {
          team1: images.team1.map((image) => image?.file ?? null),
          team2: images.team2.map((image) => image?.file ?? null),
        },
        results,
        savedAt: Date.now(),
      },
      SESSION_KEY,
    ),
  ).catch(() => undefined);
}

export function loadSession() {
  return runTransaction("readonly", (store) => store.get(SESSION_KEY))
    .then((saved) => {
      if (!saved || !saved.images) return null;

      const toImageState = (files = []) =>
        files.map((file) => (file ? { url: URL.createObjectURL(file), file } : null));

      return {
        step: saved.step ?? "setup",
        teams: saved.teams ?? { team1: null, team2: null },
        images: {
          team1: toImageState(saved.images.team1),
          team2: toImageState(saved.images.team2),
        },
        results: saved.results ?? null,
      };
    })
    .catch(() => null);
}

export function clearSession() {
  return runTransaction("readwrite", (store) => store.delete(SESSION_KEY)).catch(() => undefined);
}