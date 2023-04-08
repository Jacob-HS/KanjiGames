let currentHearts=3;
let intervalID;
let addedListener=false;
let keys;
let currentQuestion;
const correctTracker=[];
answer.addEventListener("keydown", function(event){
  if(event.key=="Enter"){
    checkAnswer();
  }
  //if(event.key=="Escape"){
  //  skip();
 // }
});
function makeGoAway(diff){
  let diffh = document.getElementById("diffh");
  let container= document.getElementById("myContainer");
  let homeButtons=document.getElementsByClassName("homeButton");
  homeButtons[0].classList.add("hidden");
  diffh.classList.add("goAway");
  container.classList.add("goAway");
  setDiff(diff)
  if (!addedListener){
    addedListener=true;
    diffh.addEventListener("transitionend", () =>
    {
      diffh.classList.add("hidden");
      container.classList.add("hidden");
      startGame();
    })
  }
}
function setDiff(diff){
  difficultyLevel=diff;

  if (difficultyLevel==1){
    maxTime="20";
    keys=Object.keys(masterList);
  }
}

function startGame(){
  let gameplayElements = document.getElementsByClassName("gameplayElement");
  for (let element of gameplayElements){
    element.classList.remove("hidden");
    element.classList.add("active");
  }
  //document.getElementById("maxScore").innerHTML=maxScore;
  document.getElementById("timer").innerHTML=maxTime;
  console.log("start");
  intervalID = setInterval(tickDown,1000);
  pickQuestion();
  document.getElementById("answer").focus();
}

function tickDown(){
  if (document.getElementById("timer").innerHTML=="20"){
    startPathAppearance();
    //document.getElementById("timerBar").style.width="100%";
  }
  document.getElementById("heartContainer").classList.remove("shake-horizontal");
  document.getElementById("timer").innerHTML=parseInt(document.getElementById("timer").innerHTML)-1;
  if (document.getElementById("timer").innerHTML =="0"){
    correctTracker.push("answeredIncorrectly");
    removeHeart();
  }
}

function removeHeart(){
  let heartContainer=document.getElementById("heartContainer");
  heartContainer.classList.add("shake-horizontal");
  thisHeart=document.getElementById("heart"+currentHearts);
  thisHeart.className="fa fa-heart-o";
  currentHearts--;
  if (currentHearts == 0){
    endGame(false);
  }else{
    pickQuestion();
    addTime();
  }
}

function addTime(){
  document.getElementById("timer").innerHTML=maxTime;
  clearInterval(intervalID);
  intervalID = setInterval(tickDown,1000);
}
function pickQuestion(){
  svgContainer = document.getElementById("svg-container");
  svgContainer.innerHTML="";
  currentQuestion=vnJukugo[Math.floor(Math.random()*vnJukugo.length)];
  console.log(currentQuestion);
  for (const kanji of currentQuestion){
    svgContainer.innerHTML=svgContainer.innerHTML+masterList[kanji];
  }
  smushSvgs();
  hidePaths();
  setPathAppearTime();

  document.getElementById("timerBar").style.transition="width 25s";
  document.getElementById("timerBar").classList.add("activeTimer");
}
function smushSvgs(){
  svgs = document.getElementsByTagName("svg");
  wordLength=svgs.length;
  const viewBoxBoi=[["-5 0 109 109","5 0 109 109"],["-5 0 109 109","0 0 109 109","5 0 109 109"],["-15 0 109 109","-5 0 109 109","5 0 109 109","15 0 109 109"],["-20 0 109 109","-10 0 109 109","0 0 109 109","10 0 109 109","20 0 109 109"]];
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
  let j=0;
  arr=getRandomArray(paths.length);
  firstHalf=5/(parseFloat(paths.length)/2);
  secondHalf=15/(parseFloat(paths.length)/2);
  console.log(firstHalf);
  console.log(secondHalf);
  for (const num of arr){
    if (i<(paths.length)/2){
      paths[num].style.transitionDelay=firstHalf*i+"s";
    } else{
      paths[num].style.transitionDelay=5.5+(secondHalf*(j))+"s";
      j++;
    }
    i++;
  }
  console.log("end of set path");
}
function getRandomArray(length){
  const arr =[];
  let idx=0;
  while (idx<length){
    arr[idx]=idx;
    idx++;
  }
  for (let i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    let tempyboi = arr[i];
    arr[i] = arr[j];
    arr[j] = tempyboi;
  }
  console.log("end of random array")
  return arr;
}
function hidePaths(){
  paths = document.getElementsByTagName("path");
  for (const path of paths){
    path.classList.add("hiddenPath");
  }
}
function endGame(win){
  clearInterval(intervalID);
  let gameplayElements = document.getElementsByClassName("gameplayElement");
  for (let element of gameplayElements){
    element.classList.remove("active");
    element.classList.add("hidden");
  }
  displaySummary(win);
}

function displaySummary(win){
  result=document.getElementById("result");
  if (win){
    if (currentHearts==3){
      result.innerHTML="Flawless";
    }
    else{
      result.innerHTML="Victory!";
    }
    
  }else {
    result.innerHTML="Defeat"
  }
  let summaryElements = document.getElementsByClassName("summaryElement");
  for (let element of summaryElements){
    element.classList.remove("hidden");
    element.classList.add("active");
  }
  //generateSummaryAnswers();
}


function checkAnswer(){
  let answerElement=document.getElementById("answer");
  let answer=answerElement.value;
  answerElement.value="";
  //if (answer == "s" || answer == "S" || answer == "ｓ" || answer == "Ｓ"){
  //  skip();
  //  return;
  //}
    if (currentQuestion==answer){
      correctTracker.push("answeredCorrectly");
      document.getElementById("score").innerHTML=1+parseInt(document.getElementById("score").innerHTML);
      //document.getElementById("timerBar").style.transition="none";
      //document.getElementById("timerBar").style.width="0%";
      pickQuestion();
      addTime();
    }
  }

  function resetGame(){
    let summaryElements = document.getElementsByClassName("summaryElement");
    for (let element of summaryElements){
      element.classList.remove("active");
      element.classList.add("hidden");
    }
    document.getElementById("score").innerHTML=0;
    document.getElementById("summaryAnswerContainer").innerHTML="";
    currentHearts=3;
  
    let heartElements = document.getElementById("heartContainer").children;
    for (let element of heartElements){
      element.classList.remove("fa-heart-o");
      element.classList.add("fa-heart");
    }
    document.getElementById("heartContainer").classList.remove("shake-horizontal");
    //document.getElementById("progressBar").style.width="0%";
    //correctTracker=[];
    document.getElementById("answer").value="";
  }
  function playAgain(){
    resetGame();
    startGame();
  }
  function changeDifficulty(){
    resetGame();
    let diffh = document.getElementById("diffh");
    let container= document.getElementById("myContainer");
    diffh.classList.remove("goAway","hidden");
    container.classList.remove("goAway","hidden");
    homeButtons[0].classList.remove("hidden");
  
  }