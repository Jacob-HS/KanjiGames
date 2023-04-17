(() => {
  let roomNum;
  let host;
  let intervalID;
var socket = io();
socket.on('connect', function() {
  socket.emit('my_event', {data: 'I\'m connected!'});
});
socket.on("message", function(message) {
  console.log(message);
});
function generateKey(){
  socket.emit("generateKey", (key) => {
    console.log("heres your key: "+key)
  })
}
const urlParams = new URLSearchParams(location.search);
let room = urlParams.get("room")
if (room === null){
  socket.emit('makeRoom', (roomNumba) => {
    roomNum=roomNumba;
    host=true;
  });
}else{
  socket.emit('join', room, (hostName) =>{
    document.getElementById("opponentName").innerHTML=hostName;
  });
  host=false;
}
nameAnswer.addEventListener("keydown", function(event){
  if(event.key=="Enter"){
    checkName();
  }
});
document.getElementById("nameAnswerButton").addEventListener("click", function(event){
  checkName();
});

document.getElementById("inviteLinkButton").addEventListener("click",function(event){
  copyInvite()
});


socket.on("pickedName", (namae)=>{
  document.getElementById("opponentName").innerHTML=namae;
});

socket.on("startGame", function(){
  clearField();
  startCountdown();
});

function checkName(){
  let potentialName=document.getElementById("nameAnswer").value;
  document.getElementById("nameAnswer").value="";
  if (potentialName){
    socket.emit("pickName", potentialName, host);
    document.getElementById("playerName").innerHTML=potentialName;
    hideNameCreation();
    if (host) displayInviteInfo();
  }else{
    alert("pick a valid name");
  }
}

function hideNameCreation(){
  nameCreationElements=document.getElementsByClassName("nameCreationElement");
  for (const element of nameCreationElements) {
    element.classList.remove("active");
    element.classList.add("hidden");
  }
}

function displayInviteInfo(){
  inviteInfoElements=document.getElementsByClassName("inviteInfoElement");
  for (const element of inviteInfoElements) {
    element.classList.remove("hidden");
    element.classList.add("active");
  }
  document.getElementById("roomNumber").innerHTML=roomNum;
}

function copyInvite(){
  navigator.clipboard.writeText("http://127.0.0.1:5000/drawn-out/duel?room="+roomNum).then(function() {
    document.getElementById("inviteLinkButton").innerHTML="Copied!"
}, function() {
    console.log('Copy error')
});
}

function clearField(){
  document.getElementById("roomCreationContainer").classList.add("hidden");
  
}

function startCountdown(){
  countdownTimer = document.getElementById("countdownTimer");
  countdownTimer.classList.remove("hidden");
  countdownTimer.classList.add("active");
  countdownTimer.innerHTML="3";
  intervalID=setInterval(tickDown, 1000);
}
function tickDown(){
  let countdownTimer = document.getElementById("countdownTimer");
  countdownTimer.innerHTML=parseInt(countdownTimer.innerHTML)-1;
  if (countdownTimer.innerHTML =="0"){
    clearInterval(intervalID);
    countdownTimer.classList.remove("active");
    countdownTimer.classList.add("hidden");
    toggleGameElements();
    pickQuestion();
  }
}

function pickQuestion(){
  svgContainer = document.getElementById("svg-container");
  svgContainer.innerHTML="";
  currentQuestion=keys[Math.floor(Math.random()*poolSize)];
  askedPool.push(currentQuestion);
  for (const kanji of currentQuestion){
    svgContainer.innerHTML=svgContainer.innerHTML+masterList[kanji];
  }
  smushSvgs();
  hidePaths();
  setPathAppearTime();
}

function smushSvgs(){
  svgs = document.getElementsByTagName("svg");
  wordLength=svgs.length;
  const viewBoxBoi=
  [["-5 0 109 109","5 0 109 109"],
  ["-5 0 109 109","0 0 109 109","5 0 109 109"],
  ["-15 0 109 109","-5 0 109 109","5 0 109 109","15 0 109 109"],
  ["-20 0 109 109","-10 0 109 109","0 0 109 109","10 0 109 109","20 0 109 109"]
  ];
  let i=0;
  for (const svg of svgs){
    svg.setAttribute("viewBox",viewBoxBoi[wordLength-2][i]);
    i++;
  }
}
function startPathAppearance(){
  paths = document.getElementsByTagName("path");
  for (const path of paths){
    path.classList.add("activePath");
  }
}

function setPathAppearTime(){
  console.log("start of set path");
  paths = document.getElementsByTagName("path");
  let i=0;
  let j=1;
  //request random array of paths.length size
  //arr=getRandomArray(paths.length);
  firstHalf=5/(parseFloat(paths.length)*.4);
  secondHalf=15/(parseFloat(paths.length)*.6);
  console.log(firstHalf);
  console.log(secondHalf);
  for (const num of arr){
    if (i<(paths.length)/2){
      paths[num].style.transitionDelay=+firstHalf*i+"s";
      i++;
    } else{
      paths[num].style.transitionDelay=firstHalf*(i-1)+(secondHalf*(j))+"s";
      j++;
    }
    
  }
  console.log("end of set path");
}
function toggleGameElements(){
  gameElements=document.getElementsByClassName("gameplayElement");
  for (const element of gameElements) {
    if(element.classList.contains("active")){
      element.classList.remove("active");
      element.classList.add("hidden");
    }else{
      element.classList.add("active");
      element.classList.remove("hidden");
    }
  }
}

})();