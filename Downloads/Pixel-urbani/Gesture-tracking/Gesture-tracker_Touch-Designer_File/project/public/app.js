const API_VIDEOS_URL = "/api/videos";
const GRID_CONTAINER  = document.getElementById("grid-container");
const TEMPLATE        = document.getElementById("camera-template");

async function fetchVideoList() {
  try {
    const res = await fetch(API_VIDEOS_URL);
    if (!res.ok) throw new Error("Errore nel recupero lista video");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

function addVideoToGrid(filename) {
  const clone = TEMPLATE.content.cloneNode(true);
  const box = clone.querySelector(".camera-box");
  const videoTag = clone.querySelector(".camera-video");
  const overlay = clone.querySelector(".camera-overlay");

  videoTag.src = `/videos/${filename}`;
  videoTag.setAttribute("playsinline", "");
  videoTag.setAttribute("muted", "");
  videoTag.setAttribute("loop", "");

  overlay.textContent = filename;
  box.dataset.filename = filename;

  GRID_CONTAINER.appendChild(clone);
}

async function updateGrid() {
    // 1) prendo la lista attuale di file da /api/videos
    const videoList = await fetchVideoList(); // es. ["a.mp4", "b.mp4", ...]
  
    // 2) rimuovo tutti i box che NON sono più in videoList
    document.querySelectorAll(".camera-box").forEach(box => {
      const fname = box.dataset.filename;
      if (!videoList.includes(fname)) {
        box.remove();
      }
    });
  
    // 3) aggiungo eventuali nuovi file mancanti
    const existing = Array.from(document.querySelectorAll(".camera-box"))
      .map(box => box.dataset.filename);
  
    videoList.forEach(fname => {
      if (!existing.includes(fname)) {
        addVideoToGrid(fname);
      }
    });
  }

window.addEventListener("DOMContentLoaded", () => {
  updateGrid();
  setInterval(updateGrid, 10000);
});

// Alla fine di public/app.js

// Permette di entrare/uscire da fullscreen con la barra spaziatrice
window.addEventListener("keydown", e => {
  // Se stiamo editando un campo di testo (input, textarea), lo ignoriamo
  const tag = document.activeElement.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return;

  if (e.code === "Space") {
    e.preventDefault();

    // Se siamo già in fullscreen, usciamo
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      // Altrimenti entriamo in fullscreen sul container principale
      // Modo più “neutro”: full‐screen sull’intera pagina
      const root = document.documentElement; // <html>
      (root.requestFullscreen || root.webkitRequestFullscreen || root.msRequestFullscreen).call(root);
    }
  }
});