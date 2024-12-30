const songs = JSON.parse(localStorage.getItem('songs')) || [
    {
        src: "COME THROUGH.mp3",
        title: "COME THROUGH",
        artist: "Talha Anjum (Prod. Umair)" 
    },
    { 
        src: "Departure Lane.mp3",
        title: "Departure Lane", 
        artist: "Talha Anjum (Prod. Umair)" 
    },
    { 
        src: "Heartbreak Kid.mp3",
        title: "Heartbreak Kid", 
        artist: "Talha Anjum, Umair" 
    },
    
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
const hamburgerIcon = document.querySelector('.hamburger-icon');
const songQueue = document.querySelector('.song-queue');
const songList = document.getElementById('song-list');
const statusIndicator = document.createElement('div');
statusIndicator.className = 'status-indicator';
songQueue.insertBefore(statusIndicator, songQueue.querySelector('ul'));

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
    updateStatusIndicator();
});

shuffleButton.addEventListener('click', () => {
    isShuffling = !isShuffling;
    shuffleButton.classList.toggle('active', isShuffling);
    if (isShuffling) {
        isLooping = false;
        loopButton.classList.remove('active');
    }
    updateStatusIndicator();
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
                renderSongList();
                currentSongIndex = songs.length - 1;
                playSong();
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
});

hamburgerIcon.addEventListener('click', () => {
    songQueue.classList.toggle('active');
    if (songQueue.classList.contains('active')) {
        hamburgerIcon.innerHTML = '<i class="fa fa-times"></i>';
    } else {
        hamburgerIcon.innerHTML = '<i class="fa fa-bars"></i>';
    }
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
    highlightCurrentSong();
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function renderSongList() {
    songList.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.draggable = true;
        li.dataset.index = index;
        li.addEventListener('dragstart', handleDragStart);
        li.addEventListener('dragover', handleDragOver);
        li.addEventListener('drop', handleDrop);
        li.addEventListener('click', () => {
            currentSongIndex = index;
            playSong();
        });

        const songTitle = document.createElement('div');
        songTitle.className = 'song-title';
        songTitle.textContent = song.title;

        const artistName = document.createElement('div');
        artistName.className = 'artist-name';
        artistName.textContent = song.artist;

        const removeIcon = document.createElement('i');
        removeIcon.className = 'fa fa-times remove-icon';
        removeIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            removeSong(index);
        });

        li.appendChild(songTitle);
        li.appendChild(artistName);
        li.appendChild(removeIcon);

        songList.appendChild(li);
    });
    highlightCurrentSong();
}

function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.index);
    event.target.classList.add('dragging');
}

function handleDragOver(event) {
    event.preventDefault();
    const dragging = document.querySelector('.dragging');
    const target = event.target;
    if (target && target !== dragging && target.nodeName === 'LI') {
        const bounding = target.getBoundingClientRect();
        const offset = bounding.y + bounding.height / 2;
        if (event.clientY - offset > 0) {
            target.style['border-bottom'] = 'solid 4px #2ECC71';
            target.style['border-top'] = '';
        } else {
            target.style['border-top'] = 'solid 4px #2ECC71';
            target.style['border-bottom'] = '';
        }
    }
}

function handleDrop(event) {
    event.preventDefault();
    const dragging = document.querySelector('.dragging');
    const target = event.target;
    if (target && target.nodeName === 'LI') {
        const fromIndex = dragging.dataset.index;
        const toIndex = target.dataset.index;
        songs.splice(toIndex, 0, songs.splice(fromIndex, 1)[0]);
        localStorage.setItem('songs', JSON.stringify(songs));
        renderSongList();
    }
    dragging.classList.remove('dragging');
    target.style['border-bottom'] = '';
    target.style['border-top'] = '';
}

function highlightCurrentSong() {
    const songItems = document.querySelectorAll('#song-list li');
    songItems.forEach((item, index) => {
        if (index == currentSongIndex) {
            item.classList.add('playing');
        } else {
            item.classList.remove('playing');
        }
    });
}

function removeSong(index) {
    songs.splice(index, 1);
    localStorage.setItem('songs', JSON.stringify(songs));
    renderSongList();
    if (currentSongIndex >= songs.length) {
        currentSongIndex = songs.length - 1;
    }
    playSong();
}

function updateStatusIndicator() {
    if (isLooping) {
        statusIndicator.textContent = 'Loop is enabled';
    } else if (isShuffling) {
        statusIndicator.textContent = 'Shuffle is enabled';
    } else {
        statusIndicator.textContent = '';
    }
}

playSong();
renderSongList();
updateStatusIndicator();
