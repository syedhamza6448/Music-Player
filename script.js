const songs = JSON.parse(localStorage.getItem('songs')) || [
    { src: "COME THROUGH.mp3", title: "COME THROUGH", artist: "Talha Anjum (Prod. Umair)" },
    { src: "Departure Lane.mp3", title: "Departure Lane", artist: "Talha Anjum (Prod. Umair)" },
    { src: "song3.mp3", title: "Song 3", artist: "Artist 3" }
];
let currentSongIndex = 0;
let isLooping = false;
let isShuffling = false;

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const loopButton = document.getElementById('loop');
const shuffleButton = document.getElementById('shuffle');
const nextButton = document.getElementById('next');
const prevButton = document.getElementById('prev');
const playPauseButton = document.getElementById('play-pause');
const songTitle = document.querySelector('.song-title');
const artistName = document.querySelector('.artist-name');
const currentTimeElement = document.getElementById('current-time');
const durationElement = document.getElementById('duration');
const uploadButton = document.querySelector('.upload-button');

playPauseButton.addEventListener('click', () => {
    togglePlayPause();
});

loopButton.addEventListener('click', () => {
    isLooping = !isLooping;
    audio.loop = isLooping;
    loopButton.classList.toggle('active', isLooping);
    if (isLooping) {
        isShuffling = false;
        shuffleButton.classList.remove('active');
    }
});

shuffleButton.addEventListener('click', () => {
    isShuffling = !isShuffling;
    shuffleButton.classList.toggle('active', isShuffling);
    if (isShuffling) {
        isLooping = false;
        loopButton.classList.remove('active');
    }
});

nextButton.addEventListener('click', () => {
    if (isShuffling) {
        currentSongIndex = Math.floor(Math.random() * songs.length);
    } else {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
    }
    playSong();
});

prevButton.addEventListener('click', () => {
    if (isShuffling) {
        currentSongIndex = Math.floor(Math.random() * songs.length);
    } else {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    }
    playSong();
});

audio.addEventListener('timeupdate', () => {
    progress.value = (audio.currentTime / audio.duration) * 100;
    currentTimeElement.textContent = formatTime(audio.currentTime);
});

progress.addEventListener('input', () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
});

audio.addEventListener('loadedmetadata', () => {
    durationElement.textContent = formatTime(audio.duration);
});

audio.addEventListener('ended', () => {
    if (!isLooping) {
        nextButton.click();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        togglePlayPause();
    }
});

uploadButton.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newSong = {
                    src: e.target.result,
                    title: file.name,
                    artist: 'Unknown'
                };
                songs.push(newSong);
                localStorage.setItem('songs', JSON.stringify(songs));
                alert('Song uploaded successfully!');
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
});

function togglePlayPause() {
    if (audio.paused) {
        audio.play();
        playPauseButton.innerHTML = '<i class="fa fa-pause fa-xl"></i>';
        document.querySelector('.cd').classList.remove('paused');
        document.querySelector('.c1').classList.remove('paused');
        document.querySelector('.c2').classList.remove('paused');
        document.querySelector('.c3').classList.remove('paused');
        document.querySelector('.music-icon').classList.remove('paused');
    } else {
        audio.pause();
        playPauseButton.innerHTML = '<i class="fa fa-play fa-xl"></i>';
        document.querySelector('.cd').classList.add('paused');
        document.querySelector('.c1').classList.add('paused');
        document.querySelector('.c2').classList.add('paused');
        document.querySelector('.c3').classList.add('paused');
        document.querySelector('.music-icon').classList.add('paused');
    }
}

function playSong() {
    audio.src = songs[currentSongIndex].src;
    console.log(`Playing: ${songs[currentSongIndex].src}`);
    songTitle.textContent = songs[currentSongIndex].title;
    artistName.textContent = songs[currentSongIndex].artist;
    audio.play().then(() => {
        console.log('Audio is playing');
    }).catch(error => {
        console.error('Error playing audio:', error);
    });
    playPauseButton.innerHTML = '<i class="fa fa-pause fa-xl"></i>';
    document.querySelector('.cd').classList.remove('paused');
    document.querySelector('.c1').classList.remove('paused');
    document.querySelector('.c2').classList.remove('paused');
    document.querySelector('.c3').classList.remove('paused');
    document.querySelector('.music-icon').classList.remove('paused');
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Initialize the first song
playSong();
