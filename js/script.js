console.log("lets start JavaScript:");
let currentSong = new Audio();
let songs;
let currFolder;

//function to change time song duration format
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = Math.ceil(seconds % 60);

  // Formatting minutes and seconds to have leading zeros if necessary
  var formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  var formattedSeconds = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

  return formattedMinutes + ":" + formattedSeconds;
}

// Assuming you have a button with id="homeButton" in your HTML
const homeButton = document.getElementById('homeButton');

// Add a click event listener to the button
homeButton.addEventListener('click', function() {
    // Replace 'index.html' with the actual URL of your home screen
    window.location.href = 'index.html';
});


async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  //show all the songs in playlist
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
    songUL.innerHTML=""
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
            <img class="invert" src="img/music.svg" alt="">
      <div class="info">
      <div>${song.replaceAll("%20", " ")}</div>  
      <div>By Hitesh</div>
      </div>
      <div class="playnow">
        <span>Play now</span>
      <img class="invert" src="img/play.svg" alt="">
    </div> </li>`;
  }
  // attach a event listner to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  return songs
}

const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track);
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src= "img/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};




async function displayAlbums(){
  let a = await fetch(`/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a")
  let cardContainer=document.querySelector(".cardContainer")
let array= Array.from(anchors)
for (let index = 0; index < array.length; index++) {
  const e = array[index];

  if(e.href.includes("/songs")){
    let folder=e.href.split("/").slice(-2)[0]
  
    //get the meta data of the folder
    let a = await fetch(`/songs/${folder}/info.json  `);
  let response = await a.json();
  cardContainer.innerHTML=cardContainer.innerHTML+
  `<div data-folder="${folder}" class="card">
  <div class="img">
    <img
      src="/songs/${folder}/cover.jpg"
      alt="image"
    />
    <div class="play">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="22"
        height="22"
        color="#000000"
        fill="none"
      >
        <path
          d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
          stroke="currentColor"
          fill="#000"
          stroke-width="1.5"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </div>
  <h2>${response.title}</h2>
  <p>${response.description}</p>
</div>`
  }
}
  // load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach( e=> {
    e.addEventListener("click", async item => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
       playMusic(songs[0])
    });
  });
}
 

async function main() {
  //get list of all songs
  await getSongs("songs/bollywood");
  playMusic(songs[0], true);

  //display all the albums in the page
  await displayAlbums()

 



  //attach an event listner to play

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/play.svg";
    }
  });
  // //Add an eventlistner for previous
  previous.addEventListener("click", (e) => {
    currentSong.pause();
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });
  // //Add an eventlistner for next
  next.addEventListener("click", (e) => {
    currentSong.pause();
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  //listen for time update event
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //add a event listner to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  //Add an eventlistner for hamburger
  document.querySelector(".hamburger").addEventListener("click", (e) => {
    document.querySelector(".left").style.left = "0";
  });

  // //Add an eventlistner for hamburger closing
  document.querySelector(".close").addEventListener("click", (e) => {
    document.querySelector(".left").style.left = "-120%";
  });

  //add an event to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
    if(currentSong.volume >0){
      document.querySelector(".volume>img").src= document.querySelector(".volume>img").src.replace("mute.svg","volume.svg")
    }
    })
// add event listner ot mute the track
document.querySelector(".volume>img").addEventListener("click",e=>{
if(e.target.src.includes("volume.svg")){
  e.target.src= e.target.src.replace("volume.svg","mute.svg")
  currentSong.volume=0;
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0].value=0;
}
else{
  e.target.src= e.target.src.replace("mute.svg","volume.svg")
  currentSong.volume=.10;
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0].value=10;
}
})



  }

main()