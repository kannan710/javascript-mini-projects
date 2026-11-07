const play = document.querySelector(".play"),
previous = document.querySelector(".prev"),
next = document.querySelector(".next"),
//
title = document.querySelector(".title"),
artist = document.querySelector(".artist"),
// 
trackCurrentTime = document.querySelector(".current-time"),
trackDuration = document.querySelector(".duration-time"),
slider = document.querySelector(".duration-slider"),
//
showVolume = document.querySelector(".show-volume"),
volumeIcon = document.querySelector(".volume-icon"),
currentVolume = document.querySelector("#volume"),
// 
autoPlayBtn = document.querySelector(".play-all"),
// 
hamBurger = document.querySelector(".bur-icon"),
closeIcon = document.querySelector(".cross-icon"),
// 
musicPlayList = document.querySelector(".music-playlist"),
pDiv = document.querySelector(".playlist-div"),
playList = document.querySelector(".playlist");

//set the initial volume
currentVolume.value = showVolume.innerHTML;

let timer;
let autoplay = 0;
let indexTrack = 0;
let songIsPlaying = false;

const track = new Audio();
// All Event Listeners
play.addEventListener("click", justPlay);
previous.addEventListener("click", prevSong);
next.addEventListener("click", nextSong);
autoPlayBtn.addEventListener("click", autoPlayToggle);
volumeIcon.addEventListener("click", muteSound);
currentVolume.addEventListener("change", changeVolume);
slider.addEventListener("change", changeDuration);
track.addEventListener("timeupdate", songTimeUpdate);
hamBurger.addEventListener("click", showPlayList);
closeIcon.addEventListener("click", hidePlayList);

//Load Tracks
const loadTrack = (indexTrack) => {
    clearInterval(timer);
    resetSlider();

    track.src = trackList[indexTrack].path; 
    title.innerHTML = trackList[indexTrack].name; 
    artist.innerHTML = trackList[indexTrack].singer; 
    track.load();

    timer = setInterval(updateSlider, 1000);
}
loadTrack(indexTrack);

function justPlay() {
    if(songIsPlaying == false) {
        playSong();
    }
    else {
        pauseSong();
    }
}

function playSong() {
    track.play();
    songIsPlaying = true;
    play.innerHTML = "⏸️";
}

function pauseSong() {
    track.pause();
    songIsPlaying = false;
    play.innerHTML = "▶️";
}

function nextSong() {
    if(indexTrack < trackList.length - 1) {
        indexTrack++;
        loadTrack(indexTrack);
        playSong();
    }
    else {
        indexTrack = 0;
        loadTrack(indexTrack);
        playSong();
    }
}

function prevSong() {
    if(indexTrack > 0) {
        indexTrack--;
        loadTrack(indexTrack);
        playSong();
    }
    else {
        indexTrack = trackList.length - 1;
        loadTrack(indexTrack);
        playSong();
    }
}

// change duration
function changeDuration() {
    let sliderPositon = track.duration * (slider.value / 100);
    track.currentTime = sliderPositon;
}

function autoPlayToggle() {
    if(autoplay == 0) {
        autoplay = 1;
        autoPlayBtn.style.background = "#3d3d3e";
    }
    else {
        autoplay = 0;
        autoPlayBtn.style.background = "white";
    }
}

function muteSound() {
    track.volume = 0;
    showVolume.innerHTML = 0;
    currentVolume.value = 0;
}

function changeVolume() {
    showVolume.innerHTML = currentVolume.value;
    track.volume = currentVolume.value / 100;
}

function resetSlider() {
    slider.value = 0;
}

function updateSlider() {
    let position = 0;

    if(!isNaN(track.duration)) {
        position = track.currentTime * (100 / track.duration);
        slider.value = position;
    }

    if(track.ended) {
        play.innerHTML = "▶️";
        if(autoplay == 1 && indexTrack < trackList.length - 1) {
            indexTrack++;
            loadTrack(indexTrack);
            playSong();
        }
        else if(autoplay == 1 && indexTrack == trackList.length - 1) {
            indexTrack = 0;
            loadTrack(indexTrack);
            playSong();
        } 
    }
}

function songTimeUpdate() {
    if(track.duration){
        let curmins = Math.floor(track.currentTime / 60);
        let cursecs = Math.floor(track.currentTime - curmins * 60);
        let durmins = Math.floor(track.duration / 60);
        let dursecs = Math.floor(track.duration - durmins * 60);

        if(dursecs < 10) {
            dursecs = "0" + dursecs;
        }
        if(durmins < 10) {
            durmins = "0" + durmins;
        }
        if(curmins < 10) {
            curmins = "0" + curmins;
        }
        if(cursecs < 10) {
            cursecs = "0" + cursecs;
        }
        trackCurrentTime.innerHTML = curmins + ":" + cursecs;
        trackDuration.innerHTML = durmins + ":" + dursecs;
    }
    else {
        trackDuration.innerHTML = "00" + ":" + "00";
        trackCurrentTime.innerHTML = "00" + ":" + "00";
    }
}

function showPlayList() {
    musicPlayList.style.transform = "translateX(0)";
}
function hidePlayList() {
    musicPlayList.style.transform = "translateX(-100%)";
}

//Display Tracks in PlayList
let counter = 1;
function displayTracks() {
    for(let i = 0; i < trackList.length; i++) {
        // console.log(trackList[i].name);
        let div = document.createElement("div");
        div.classList.add("playlist");
        div.innerHTML = `
            <span class="song-index">${counter++}</span>
            <p class="single-song">${trackList[i].name}</p>
        `;
        pDiv.appendChild(div);
    }

    displayFromPlaylist();
}

displayTracks();
function displayFromPlaylist() {
    pDiv.addEventListener("click", (e) => {
        if(e.target.classList.contains("single-song")) {
            const indexNum = trackList.findIndex((item, index) => {
                return item.name === e.target.innerHTML;
            })
        loadTrack(indexNum);
        playSong();
        hidePlayList();
        }
    })
}