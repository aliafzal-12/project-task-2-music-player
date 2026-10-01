// Sample Playlist Data with Categories (Genres)
const songs = [
    {
        title: "Creative Minds",
        artist: "Common Sense",
        genre: "acoustic",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80"
    },
    {
        title: "Acoustic Breeze",
        artist: "Bensound",
        genre: "acoustic",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        cover: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&auto=format&fit=crop&q=80"
    },
    {
        title: "Electric Echo",
        artist: "Synthwave",
        genre: "electronic",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80"
    },
    {
        title: "Summer Pop Party",
        artist: "Melody Maker",
        genre: "pop",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&auto=format&fit=crop&q=80"
    }
];

// DOM Elements
const audioElement = document.getElementById('audioElement');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');
const songImage = document.getElementById('songImage');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volumeSlider');
const playlistEl = document.getElementById('playlist');
const searchInput = document.getElementById('searchInput');
const genreFilter = document.getElementById('genreFilter');

let currentSongIndex = 0;
let isPlaying = false;

// Initialize Player
function initPlayer() {
    loadSong(currentSongIndex);
    renderPlaylist(songs);
}

// Load Song Details into UI
function loadSong(index) {
    const song = songs[index];
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    songImage.src = song.cover;
    audioElement.src = song.src;
    highlightActivePlaylistElement(index);
}

// Play / Pause Functions
function togglePlay() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

function playSong() {
    isPlaying = true;
    playIcon.classList.remove('fa-play');
    playIcon.classList.add('fa-pause');
    audioElement.play().catch(error => {
        console.log("Playback blocked or failed:", error);
    });
}

function pauseSong() {
    isPlaying = false;
    playIcon.classList.remove('fa-pause');
    playIcon.classList.add('fa-play');
    audioElement.pause();
}

// Skip / Previous
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
}

// Update Progress Bar & Time
audioElement.addEventListener('timeupdate', (e) => {
    const { duration, currentTime } = e.srcElement;
    if (isNaN(duration)) return;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Format Times
    currentTimeEl.textContent = formatTime(currentTime);
    durationEl.textContent = formatTime(duration);
});

// Auto play next song when current track ends
audioElement.addEventListener('ended', () => {
    nextSong();
});

// Click on progress bar to seek
progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audioElement.duration;
    if (!isNaN(duration)) {
        audioElement.currentTime = (clickX / width) * duration;
    }
});

// Format seconds into MM:SS format
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Volume Control
volumeSlider.addEventListener('input', (e) => {
    audioElement.volume = e.target.value;
});

// Render Playlist in Sidebar
function renderPlaylist(songArray) {
    playlistEl.innerHTML = '';
    songArray.forEach((song, originalIndex) => {
        const li = document.createElement('li');
        li.classList.add('playlist-item');
        if (originalIndex === currentSongIndex) {
            li.classList.add('active');
        }

        li.innerHTML = `
            <img src="${song.cover}" alt="cover">
            <div class="playlist-item-details">
                <h4>${song.title}</h4>
                <p>${song.artist}</p>
            </div>
        `;

        li.addEventListener('click', () => {
            currentSongIndex = originalIndex;
            loadSong(currentSongIndex);
            playSong();
        });

        playlistEl.appendChild(li);
    });
}

// Highlight Active Song in Playlist
function highlightActivePlaylistElement(index) {
    const items = playlistEl.querySelectorAll('.playlist-item');
    items.forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Search and Categorization Logic
function filterAndSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedGenre = genreFilter.value;

    const filteredSongs = songs.filter(song => {
        const matchesSearch = song.title.toLowerCase().includes(searchTerm) || 
                              song.artist.toLowerCase().includes(searchTerm);
        const matchesGenre = selectedGenre === 'all' || song.genre === selectedGenre;

        return matchesSearch && matchesGenre;
    });

    renderPlaylist(filteredSongs);
}

searchInput.addEventListener('input', filterAndSearch);
genreFilter.addEventListener('change', filterAndSearch);

// Event Listeners for Controls
playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);

// Run initialization on load
initPlayer();