const display = document.getElementById("timeDisplay");
const start = document.getElementById("startBtn");
const pause = document.getElementById("pauseBtn");
const reset = document.getElementById("resetBtn");

let startTime = 0;
let elapsedTime = 0;
let currentTime = 0;
let pauseTime = true;
let intervalId;
let hrs = 0;
let mins = 0;
let secs = 0;

start.addEventListener("click", () => {
    if(pauseTime) {
        pauseTime = false;
        startTime = Date.now() - elapsedTime;
        intervalId = setInterval(updateTime, 1000);
    }
});

pause.addEventListener("click", () => {
    if(!pauseTime) {
        pauseTime = true;
        elapsedTime = Date.now() - startTime;
        clearInterval(intervalId);
    }
});

reset.addEventListener("click", () => {
    startTime = 0;
    elapsedTime = 0;
    currentTime = 0;
    pauseTime = true;
    hrs = 0;
    mins = 0;
    secs = 0;
    clearInterval(intervalId);
    display.textContent = "00:00:00";
});

function updateTime() {
    elapsedTime = Date.now() - startTime;

    secs = Math.floor((elapsedTime / 1000) % 60);
    mins = Math.floor((elapsedTime / (1000 * 60)) % 60);
    hrs =  Math.floor((elapsedTime / (1000 * 60 * 60)) % 60);

    secs = pad(secs);
    mins = pad(mins);
    hrs = pad(hrs);

    // console.log(typeof(secs));

    display.textContent = `${hrs}:${mins}:${secs}`;

    function pad(unit) {
        unit = unit.toString();

        // return (("0") + unit.length > 1 ? unit : "0" + unit);
        return (unit.length == 1) ? "0"+unit : unit;
    }
}