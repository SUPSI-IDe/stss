const fs = require("fs");
const path = require("path");
const express = require("express");
const chokidar = require("chokidar");
const ffmpeg = require("fluent-ffmpeg");
const cors = require("cors");

const EXPORT_DIR    = path.join(__dirname, "export");
const OPTIMIZED_DIR = path.join(__dirname, "optimized");
const PUBLIC_DIR    = path.join(__dirname, "public");
const PORT          = 5000;

// Parametri di encoding
const TARGET_HEIGHT = 720;
const CRF_VALUE     = 23;
const PRESET        = "fast";

// Creazione cartelle se mancanti
[EXPORT_DIR, OPTIMIZED_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ── Funzione per attendere che le dimensioni del file siano “stabili” ──
function waitForStableSize(filePath, checkIntervalMs = 5000, maxAttempts = 25) {
  return new Promise((resolve, reject) => {
    let lastSize = -1;
    let stableCount = 0;
    let attempts = 0;

    function check() {
      fs.stat(filePath, (err, stats) => {
        if (err) {
          return reject(new Error(`Impossibile leggere dimensione file: ${err.message}`));
        }
        const currentSize = stats.size;
        attempts++;

        if (currentSize === lastSize) {
          stableCount++;
        } else {
          stableCount = 0;
          lastSize = currentSize;
        }

        if (stableCount >= 2) {
          // La dimensione è rimasta costante per due controlli consecutivi: file stabile
          return resolve();
        }

        if (attempts < maxAttempts) {
          setTimeout(check, checkIntervalMs);
        } else {
          return reject(
            new Error(`Il file "${path.basename(filePath)}" non si è stabilizzato entro ${attempts} tentativi`)
          );
        }
      });
    }

    // Primo check dopo checkIntervalMs
    setTimeout(check, checkIntervalMs);
  });
}

// ── Funzione che chiama ffmpeg con rotazione e crop ──
function transcode(srcPath, destPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(srcPath)
      .outputOptions([
        "-c:v libx264",
        `-preset ${PRESET}`,
        `-crf ${CRF_VALUE}`,
        // Ruota 90° e ritaglia a quadrato centrato
        "-vf", "transpose=2,crop=min(iw\\,ih):min(iw\\,ih):(iw-min(iw\\,ih))/2:(ih-min(iw\\,ih))/2",
        "-c:a aac",
        "-b:a 128k",
        "-movflags +faststart"
      ])
      .on("start", cmd => {
        console.log(`[FFMPEG] Inizio transcodifica: ${path.basename(srcPath)}`);
      })
      .on("error", err => {
        console.error(`[FFMPEG] Errore ${path.basename(srcPath)}:`, err.message);
        reject(err);
      })
      .on("end", () => {
        console.log(`[FFMPEG] Transcodifica completata: ${path.basename(destPath)}`);
        resolve();
      })
      .save(destPath);
  });
}

// ── Express + watcher chokidar ──
const app = express();
app.use(cors());
app.use(express.static(PUBLIC_DIR));

const watcher = chokidar.watch(EXPORT_DIR, {
  persistent: true,
  ignoreInitial: false,
  depth: 0
});

watcher.on("add", filePath => {
  const ext = path.extname(filePath).toLowerCase();
  const validExts = [".mp4", ".mov", ".avi", ".mkv", ".flv", ".ts", ".ogg"];
  if (!validExts.includes(ext)) return;

  const baseName = path.basename(filePath, ext);
  const destName = baseName + ".mp4";
  const destPath = path.join(OPTIMIZED_DIR, destName);

  if (fs.existsSync(destPath)) {
    console.log(`[WATCHER] Già ottimizzato: ${destName}`);
    return;
  }

  console.log(`[WATCHER] Rilevato nuovo file: ${baseName}${ext}. Attendo la scrittura completa...`);

  waitForStableSize(filePath, 5000, 12)
    .then(() => {
      console.log(`[WATCHER] File stabile: ${path.basename(filePath)}. Avvio transcodifica...`);
      return transcode(filePath, destPath);
    })
    .then(() => {
      console.log(`[WATCHER] Completata transcodifica di: ${destName}`);
    })
    .catch(err => {
      console.error(`[WATCHER] Errore su "${path.basename(filePath)}": ${err.message}`);
    });
});

// API per la lista video
app.get("/api/videos", (req, res) => {
  fs.readdir(OPTIMIZED_DIR, (err, files) => {
    if (err) return res.status(500).json({ error: "Impossibile leggere optimized." });
    const mp4s = files.filter(f => path.extname(f).toLowerCase() === ".mp4").sort();
    res.json(mp4s);
  });
});

// Serve i file video
app.get("/videos/:filename", (req, res) => {
  const filename = req.params.filename;
  const fullPath = path.join(OPTIMIZED_DIR, filename);
  if (fs.existsSync(fullPath)) res.sendFile(fullPath);
  else res.status(404).send("Video non trovato");
});

app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});