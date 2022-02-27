const video = document.querySelector("video");
const playBtn = document.getElementById("play"); 
const muteBtn = document.getElementById("mute"); 
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline=document.getElementById("timeline");
const fullScreen=document.getElementById("fullScreen");
const videoContainer=document.getElementById("videoContainer");
const fullScreenBtn=document.getElementById("fullScreen");
const videoControls=document.getElementById("videoControls");

let controlsTimeout=null;
let controlsMovementTimeout=null;
let volumeValue=0.5;
video.volume=volumeValue;

const handlePlayClick=(e)=>{
    if(video.paused){
        video.play();
    }else{
        video.pause();
    }
    playBtn.innerText=video.paused ? "Play" : "Pause";
};

const handlePause=()=>playBtn.innerText="Play";
const handlePlay=()=>playBtn.innerText="Pause";

const handleMute=(e)=>{
    if(video.muted){
        video.muted=false;
    }else{
        video.muted=true;
    }
muteBtn.innerText=video.muted ? "Unmute" : "Mute";
volumeRange.value=video.muted ? 0 : volumeValue;
}

const formatTime=(time)=>
    new Date(time*1000).toISOString().substring(11,19);

const handleLoadedMetadata=()=>{
    totalTime.innerText=formatTime(Math.floor(video.duration));
    timeline.max=Math.floor(video.duration);
}

const handleTimeUpdate=()=>{
    currentTime.innerText=formatTime(Math.floor(video.currentTime));
    timeline.value=Math.floor(video.currentTime);
}

const handleTimelineChange=(event)=>{
    const {target:{value}}=event;
    video.currentTime=value;
}

const handleVolume=(event)=>{
    const{
        target:{value},
    }=event;
    if(video.muted){
        video.muted=false;
        muteBtn.innerText="Mute";

    }
    volumeValue=value;
    video.volume=value;
};

const handleFullscrenn=()=>{
    const fullscreen=document.fullscreenElement;
    if(fullscreen){
        document.exitFullscreen();
        fullScreenBtn.innerText="Enter Full Screen";
    }else{
        videoContainer.requestFullscreen();
        fullScreenBtn.innerText="Exit Full Screen";
    }
}

const hideControls=()=>videoControls.classList.remove("showing");

const handleMouseMove=()=>{
    if(controlsTimeout){
        clearTimeout(controlsTimeout);
        controlsTimeout=null;
    }
    if(controlsMovementTimeout){
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout=null;
    }
    videoControls.classList.add("showing");
    controlsMovementTimeout=setTimeout(hideControls,3000);
}

const handleMouseLeave=()=>{
    controlsTimeout=setTimeout(hideControls,2000);
}

const handleEnded=()=>{
    const {id}=videoContainer.dataset;
    fetch(`/api/videos/${id}/views`,{
        method:"POST",
    });
}

playBtn.addEventListener("click",handlePlayClick);
muteBtn.addEventListener("click",handleMute);
video.addEventListener("loadedmetadata",handleLoadedMetadata);
video.addEventListener("timeupdate",handleTimeUpdate);
video.addEventListener("ended",handleEnded);
timeline.addEventListener("input",handleTimelineChange);
volumeRange.addEventListener("input",handleVolume);
fullScreen.addEventListener("click",handleFullscrenn);
video.addEventListener("mousemove",handleMouseMove);
video.addEventListener("mouseleave",handleMouseLeave);

