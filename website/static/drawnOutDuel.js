(() => {
const maxDiff=2;
let roomNum;
let host;
let difficulty = 1;
let scoreLimit = 10;
let intervalID;
let askedPool=[];
let currentQuestion;
let currentSvgs;
let acceptedHiraganaAnswers=[];
var socket = io();
socket.on('connect', function() {
  socket.emit('my_event', {data: 'I\'m connected!'});
});
socket.on("gameCanceled", function(){
  cancelGame();
});
socket.on("message", function(message) {
});
socket.on("newQuestion", function(questionInfo){
  pickQuestion(questionInfo);
});

socket.on("awardPoint", function(isHost){
  let myPoint = isHost===host;
  awardPoint(myPoint);
});

socket.on("opponentReady",function(){
  lightUpName(false);
});
const urlParams = new URLSearchParams(location.search);
let room = urlParams.get("room")
if (room === null){
  document.getElementById("settingsContainer").classList.remove("hidden");
  socket.emit('makeRoom', (roomNumba) => {
    roomNum=roomNumba;
    host=true;
  });
}else{
  socket.emit('join', room, (data) =>{
    if(!data[0]){
      blockJoin();
    }
    document.getElementById("opponentName").innerHTML=data[1];
    scoreLimit=data[2];
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

socket.on("restartGame", function(){
  restartGame();
})

answer.addEventListener("keydown", function(event){
  if(event.key=="Enter"){
    checkAnswer();
  }
  //if(event.key=="Escape"){
  //  skip();
 // }
});
answer.addEventListener("input", function(event){
  if (acceptedHiraganaAnswers.includes(answer.value)){
    answer.blur();
    checkAnswer();
  }
});
document.getElementById("duelAgain").addEventListener("click", function(event){
  readyUp();
  socket.emit("readyUp")
});
document.getElementById("leftSelector").addEventListener("click", function(){
  moveDifficultyLeft();
});
document.getElementById("rightSelector").addEventListener("click", function(){
  moveDifficultyRight();
});
document.getElementById("leftSelectorSL").addEventListener("click", function(){
  moveScoreLimitLeft();
});
document.getElementById("rightSelectorSL").addEventListener("click", function(){
  moveScoreLimitRight();
});
document.getElementById("duelExit").addEventListener("click",function(){
  document.location.href="https://kanjigames.herokuapp.com/drawn-out/duel-select";
});
function checkName(){
  let potentialName=document.getElementById("nameAnswer").value;
  document.getElementById("nameAnswer").value="";
  if (potentialName){
    socket.emit("pickName", potentialName, host, scoreLimit, difficulty);
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
  navigator.clipboard.writeText("https://kanjigames.herokuapp.com/drawn-out/duel?room="+roomNum).then(function() {
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
    playerScoreHeaders = document.getElementsByClassName("playerScoreHeader");
    for (const playerScoreHeader of playerScoreHeaders) {
      playerScoreHeader.classList.remove("hidden");
      playerScoreHeader.classList.add("active");
    }
    countdownTimer.classList.remove("active");
    countdownTimer.classList.add("hidden");
    toggleGameElements();
    if (host){
      socket.emit("requestQuestion", difficulty);
    }
  }
}

function pickQuestion(questionInfo){
  acceptedHiraganaAnswers=questionInfo["hiragana"];
  currentSvgs=questionInfo["svgs"];
  svgContainer = document.getElementById("svg-container");
  svgContainer.innerHTML="";
  currentQuestion=questionInfo["word"];
  askedPool.push(currentQuestion);
  for (const kanji in currentQuestion){
    svgContainer.innerHTML=svgContainer.innerHTML+questionInfo["svgs"][kanji];
  }
  smushSvgs();
  //hidePaths();
  setPathAppearTime(questionInfo);
  startPathAppearance();
  //setTimeout(startPathAppearance, 50);
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
    path.style.animationPlayState="running";
  }
}
function hidePaths(){
  paths = document.getElementsByTagName("path");
  for (const path of paths){
    //path.classList.add("hiddenPath");
  }
}
function setPathAppearTime(questionInfo){
  paths = document.getElementsByTagName("path");
  let i=0;
  let j=1;
  arr=questionInfo["appearOrder"];
  firstHalf=5/(parseFloat(paths.length)*.4);
  secondHalf=15/(parseFloat(paths.length)*.6);
  for (const num of arr){
    if (i<(paths.length)/2){
      paths[num].style.animationDelay=+firstHalf*i+"s";
      i++;
    } else{
      paths[num].style.animationDelay=firstHalf*(i-1)+(secondHalf*(j))+"s";
      j++;
    }
  }
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
function checkAnswer(){
  let answerElement=document.getElementById("answer");
  let answer=answerElement.value;
  answerElement.value="";
    if (currentQuestion==answer || acceptedHiraganaAnswers.includes(answer)){
      socket.emit("correctAnswer",host, currentQuestion)
      //addScore();
      //showAnswer();
      //setTimeout(() => {
      //  pickQuestion();
      //  addTime();
      //  answerElement.focus();
      //}, 1000);
    }
  }
function awardPoint(myPoint){
  showAnswer(myPoint);
  if (myPoint){
    document.getElementById("playerScoreHeader").innerHTML=parseInt(document.getElementById("playerScoreHeader").innerHTML)+1;
  }else{
    document.getElementById("opponentScoreHeader").innerHTML=parseInt(document.getElementById("opponentScoreHeader").innerHTML)+1;
  }

  if(document.getElementById("opponentScoreHeader").innerHTML== scoreLimit.toString() || document.getElementById("playerScoreHeader").innerHTML== scoreLimit.toString()){
    endRound(myPoint);
    return;
  }

  if(myPoint){
    document.getElementById("answeredCorrectlyName").innerHTML="You";
  }else{
    document.getElementById("answeredCorrectlyName").innerHTML=document.getElementById("opponentName").innerHTML;
  }
  document.getElementById("answeredCorrectlyBanner").style.opacity="1";
  setTimeout(() => {
    if (host){
      socket.emit("requestQuestion", difficulty);
    }
    document.getElementById("answer").focus();
    document.getElementById("answeredCorrectlyBanner").style.opacity="0";
  }, 2000);
}
function showAnswer(myPoint){
  svgContainer.innerHTML="";
  for (const i in currentQuestion){
    svgContainer.innerHTML=svgContainer.innerHTML+currentSvgs[i];
  }
  smushSvgs();
  paths=document.getElementsByTagName("path");
  for (const path of paths) {
    path.style.opacity="1";
    if(myPoint) path.style.stroke="green";
    if(!myPoint) path.style.stroke="red";

  }
}

function endRound(win){
  if(win){
    document.getElementById("endGameDisplayHeader").innerHTML="You win!";
  }else{
    document.getElementById("endGameDisplayHeader").innerHTML=document.getElementById("opponentName").innerHTML+" wins."
  }

  document.getElementById("endGameDisplayContainer").classList.remove("hidden");
  document.getElementById("endGameDisplayContainer").classList.add("active");
}

function restartGame(){
  document.getElementById("endGameDisplayContainer").classList.remove("active");
  document.getElementById("endGameDisplayContainer").classList.add("hidden");

  document.getElementById("playerScoreHeader").innerHTML="0";
  document.getElementById("opponentScoreHeader").innerHTML="0";
  document.getElementById("opponentName").style.color="white";
  document.getElementById("playerName").style.color="white";

  document.getElementById("duelAgain").style.pointerEvents="auto";
  document.getElementById("duelAgain").innerHTML="Ready up";
  document.getElementById("duelExit").classList.remove("hidden");

  document.getElementById("svg-container").innerHTML="";
  toggleGameElements();

  startCountdown();
}

function readyUp(){
  document.getElementById("duelAgain").innerHTML="Ready";
  document.getElementById("duelAgain").style.pointerEvents="none";
  document.getElementById("duelExit").classList.add("hidden");
  lightUpName(true);
}

function lightUpName(myself){
  let name;

  if(myself){
    name=document.getElementById("playerName");
  }else{
    name=document.getElementById("opponentName");
  }
  name.style.color="green";
}

function cancelGame(){
  let elements = document.body.getElementsByTagName("*");
  for (const element of elements) {
    element.classList.add("hidden");
  }
  disconnectElement=document.getElementsByClassName("disconnectElement");
  for (const element of disconnectElement) {
    element.classList.remove("hidden");
    element.classList.add("active");
  }
}

function blockJoin(){
  let elements = document.body.getElementsByTagName("*");
  for (const element of elements) {
    element.classList.add("hidden");
  }
  disconnectElement=document.getElementsByClassName("blockElement");
  for (const element of disconnectElement) {
    element.classList.remove("hidden");
    element.classList.add("active");
  }
}

function moveDifficultyLeft(){
  if (difficulty==1){
    return;
  }
  if (difficulty==maxDiff){
    document.getElementById("rightDifficultyArrow").classList.remove("hiddenArrow");
  }
  difficulty--;
  updateDifficultyName(difficulty);
  if(difficulty==1){
    document.getElementById("leftDifficultyArrow").classList.add("hiddenArrow");
  }
  console.log(difficulty);
}

function moveDifficultyRight(){
  if (difficulty==maxDiff){
    return;
  }
  if (difficulty==1){
    document.getElementById("leftDifficultyArrow").classList.remove("hiddenArrow");
  }
  difficulty++;
  updateDifficultyName(difficulty);
  if(difficulty==maxDiff){
    document.getElementById("rightDifficultyArrow").classList.add("hiddenArrow");
  }
  console.log(difficulty);
}

function updateDifficultyName(difficulty){
  difficultyName = document.getElementById("currentDifficulty");
  if(difficulty==1) difficultyName.innerHTML="Top 5k";
  if(difficulty==2) difficultyName.innerHTML="Top 10k";
}

function moveScoreLimitLeft(){
  if (scoreLimit==5){
    return;
  }

  if (scoreLimit==25){
    document.getElementById("rightScoreLimitArrow").classList.remove("hiddenArrow");
  }
  scoreLimit-=5;

  if (scoreLimit==5){
    document.getElementById("leftScoreLimitArrow").classList.add("hiddenArrow");
  }
  document.getElementById("currentScoreLimit").innerHTML=scoreLimit;
}

function moveScoreLimitRight(){
  if (scoreLimit == 25){
    return;
  }
  if (scoreLimit == 5){
    document.getElementById("leftScoreLimitArrow").classList.remove("hiddenArrow");
  }
  scoreLimit+=5;
  if (scoreLimit==25){
    document.getElementById("rightScoreLimitArrow").classList.add("hiddenArrow");
  }
  document.getElementById("currentScoreLimit").innerHTML=scoreLimit;
}
})();