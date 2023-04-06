let currentQuestion="";
let difficultyLevel;
let activeList;
let maxScore;
let maxTime;
let poolSize;
let poolFloor;
let addedListener =false;
let askedPool =[];
let correctTracker=[];
let keys;
let intervalID;
let currentHearts=3;

answer.addEventListener("keydown", function(event){
  if(event.key=="Enter"){
    checkAnswer();
  }
  if(event.key=="Escape"){
    skip();
  }
});
function tickDown(){
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
    poolSize=50;
    poolFloor=0;
    maxScore="10";
    maxTime="20";
    activeList=masterList;
    keys = Object.keys(masterList);

  }
  if (difficultyLevel==2){
    poolSize=150;
    poolFloor=20;
    maxScore="15";
    maxTime="15";
    activeList=masterList;
    keys = Object.keys(masterList);
  }
  if (difficultyLevel==3){
    poolSize=758;
    poolFloor=170;
    maxScore="15";
    maxTime="15";
    activeList=masterList;
    keys = Object.keys(masterList);
  }
  if(difficultyLevel==4){
    poolSize=503;
    poolFloor=0;
    maxScore="20";
    maxTime="15";
    activeList=finalDifficulty;
    keys = Object.keys(activeList);
  }
}

function startGame(){
  let gameplayElements = document.getElementsByClassName("gameplayElement");
  for (let element of gameplayElements){
    element.classList.remove("hidden");
    element.classList.add("active");
  }
  document.getElementById("maxScore").innerHTML=maxScore;
  document.getElementById("timer").innerHTML=maxTime;
  console.log("start");
  intervalID = setInterval(tickDown,1000);
  pickQuestion();
  document.getElementById("answer").focus();
}
function pickQuestion(){
  do{
    candidate= keys[Math.floor((poolSize-poolFloor) * Math.random())+poolFloor ];
  } while (askedPool.includes(candidate));
  askedPool.push(candidate);
  document.getElementById("currRadical").innerHTML=candidate;
  currentQuestion=candidate;
} 

function skip(){
  correctTracker.push("answeredIncorrectly");
  removeHeart();
  
}

function checkAnswer(){
  let answerElement=document.getElementById("answer");
  let answer=answerElement.value;
  answerElement.value="";
  document.getElementById("score").innerHTML;
  if (answer == "s" || answer == "S" || answer == "ｓ" || answer == "Ｓ"){
    skip();
    return;
  }
  for(const kanji of answer){
    
    
    if (activeList[currentQuestion].includes(kanji)){
      correctTracker.push("answeredCorrectly");
      document.getElementById("score").innerHTML=1+parseInt(document.getElementById("score").innerHTML);
      if (document.getElementById("score").innerHTML==maxScore){
        endGame(true);
        return;
      }
      document.getElementById("progressBar").style.width=""+(parseInt(document.getElementById("score").innerHTML)/parseInt(maxScore))*100+"%";
      pickQuestion();
      addTime();
      break;
    }
  }
}
function endGame(win){
  console.log("stop");
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
    result.innerHTML="Victory!";
  }else {
    result.innerHTML="Defeat."
  }
  let summaryElements = document.getElementsByClassName("summaryElement");
  for (let element of summaryElements){
    element.classList.remove("hidden");
    element.classList.add("active");
  }
  generateSummaryAnswers();
}
function generateSummaryAnswers(){
  let row;
  let temp;
  let kanji;
  let i=0;
  summaryAnswerContainer=document.getElementById("summaryAnswerContainer");
  for (let component of askedPool){
    console.log(askedPool);
    row=document.createElement("div");
    temp=document.createElement("p");
    kanji=document.createTextNode(component);
    temp.appendChild(kanji);
    temp.classList.add("summaryElement","active","summaryComponent", correctTracker[i]);
    i++;
    row.appendChild(temp);
    summaryAnswerContainer.appendChild(row);
    row.classList.add("summaryElement","active", "summaryAnswerRow");

      for(let i=0;i<Math.min(activeList[component].length,10);i++){
        temp=document.createElement("p");
        kanji=document.createTextNode(activeList[component][i]);
        temp.appendChild(kanji);
        temp.classList.add("summaryElement","active","summaryAnswer");
        row.appendChild(temp);
      }
  }
}

function resetGame(){
  let summaryElements = document.getElementsByClassName("summaryElement");
  for (let element of summaryElements){
    element.classList.remove("active");
    element.classList.add("hidden");
  }
  askedPool=[];
  document.getElementById("score").innerHTML=0;
  document.getElementById("summaryAnswerContainer").innerHTML="";
  currentHearts=3;

  let heartElements = document.getElementById("heartContainer").children;
  for (let element of heartElements){
    element.classList.remove("fa-heart-o");
    element.classList.add("fa-heart");
    
  }
  document.getElementById("heartContainer").classList.remove("shake-horizontal");
  document.getElementById("progressBar").style.width="0%";
  correctTracker=[];
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