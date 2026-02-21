// ===== SONG LIST =====
const songs = [
    {
        title: "Thalapathy Kacheri",
        artist: "Anirudh",
        src: "songs/song1.mp3",
        cover: "assets/cover1.jpeg"
    },
    {
        title: "Oru Pere Varalaaru",
        artist: "Anirudh",
        src: "songs/song2.mp3",
        cover: "assets/cover2.jpeg"
    }
];

// ===== ELEMENTS =====
let currentSongIndex = 0;

const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");
const playBtn = document.getElementById("playBtn");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const playlistDiv = document.getElementById("playlist");

// ===== LOAD SONG =====
function loadSong(index) {
    const song = songs[index];
    audio.src = song.src;
    title.textContent = song.title;
    artist.textContent = song.artist;
    cover.src = song.cover;
}

loadSong(currentSongIndex);

// ===== PLAY / PAUSE =====
function playPause() {

    if (audio.paused) {

        // Resume AudioContext if suspended
        if (audioContext && audioContext.state === "suspended") {
            audioContext.resume();
        }

        audio.play();
        playBtn.textContent = "⏸";

    } else {

        audio.pause();
        playBtn.textContent = "▶";
    }
}

// ===== NEXT =====
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    audio.play();
    playBtn.textContent = "⏸";
}

// ===== PREVIOUS =====
function prevSong() {
    currentSongIndex =
        (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    audio.play();
    playBtn.textContent = "⏸";
}

// ===== PROGRESS BAR =====
audio.addEventListener("timeupdate", () => {

    if (audio.duration) {
        progress.value = (audio.currentTime / audio.duration) * 100;
    }

    document.getElementById("currentTime").textContent =
        formatTime(audio.currentTime);

    document.getElementById("duration").textContent =
        formatTime(audio.duration);
});

progress.addEventListener("input", () => {
    if (audio.duration) {
        audio.currentTime =
            (progress.value / 100) * audio.duration;
    }
});

// ===== VOLUME =====
volume.addEventListener("input", () => {
    audio.volume = volume.value;
});

// Set default volume
audio.volume = 1;

// ===== FORMAT TIME =====
function formatTime(time) {
    if (isNaN(time)) return "0:00";
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    if (seconds < 10) seconds = "0" + seconds;
    return minutes + ":" + seconds;
}

// ===== AUTOPLAY NEXT =====
audio.addEventListener("ended", nextSong);

// ===== PLAYLIST =====
songs.forEach((song, index) => {
    const div = document.createElement("div");
    div.textContent = song.title + " - " + song.artist;

    div.onclick = () => {
        currentSongIndex = index;
        loadSong(index);
        audio.play();
        playBtn.textContent = "⏸";
    };

    playlistDiv.appendChild(div);
});

// ===== BASS VISUALIZER =====
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const source = audioContext.createMediaElementSource(audio);

source.connect(analyser);
analyser.connect(audioContext.destination);

analyser.fftSize = 256;

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function drawVisualizer() {

    requestAnimationFrame(drawVisualizer);

    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {

        let barHeight = dataArray[i];

        // Boost bass
        if (i < 20) {
            barHeight *= 1.8;
        }

        ctx.fillStyle = `rgb(${barHeight + 100}, 50, 255)`;
        ctx.fillRect(
            x,
            canvas.height - barHeight / 2,
            barWidth,
            barHeight / 2
        );

        x += barWidth + 1;
    }
}

// Start visualizer when play
audio.addEventListener("play", () => {
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }
    drawVisualizer();
});