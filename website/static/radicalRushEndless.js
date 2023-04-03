var currentQuestion="";
var difficultyLevel;
var activeList;
var poolSize;
var poolFloor;
var maxTime;
var addedListener =false;
var askedPool=[];
var correctTracker=[];
var bannedAnswerList=[];
var keys;
var intervalID;
var currentHearts=3;
var currentResponse=1;

answer.addEventListener("keypress", function(event){
  if(event.key=="Enter"){
    checkAnswer();
  }
})
function tickDown(){
  document.getElementById("heartContainer").classList.remove("shake-horizontal");
  document.getElementById("timer").innerHTML=parseInt(document.getElementById("timer").innerHTML)-1;
  if (document.getElementById("timer").innerHTML =="0"){
    correctTracker.push("answeredIncorrectly");
    removeHeart();
  }
}

function removeHeart(){
  var heartContainer=document.getElementById("heartContainer");
  heartContainer.classList.add("shake-horizontal");
  thisHeart=document.getElementById("heart"+currentHearts);
  thisHeart.className="fa fa-heart-o";
  currentHearts--;
  if (currentHearts == 0){
    endGame();
  }else{
    pickQuestion();
    addTime();
  }
  

}

function addTime(){
  document.getElementById("timer").innerHTML=maxTime;
}
function makeGoAway(diff){
  let diffh = document.getElementById("diffh");
  let container= document.getElementById("myContainer");
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
    maxTime="15";
    activeList=masterList;
    keys = Object.keys(masterList);

  }
  if (difficultyLevel==2){
    poolSize=150;
    poolFloor=20;
    maxScore="15";
    maxTime="10";
    activeList=masterList;
    keys = Object.keys(masterList);
  }
  if (difficultyLevel==3){
    poolSize=758;
    poolFloor=170;
    maxScore="15";
    maxTime="10";
    activeList=masterList;
    keys = Object.keys(masterList);
  }
  console.log(activeList)
}

function startGame(){
  let gameplayElements = document.getElementsByClassName("gameplayElement");
  for (let element of gameplayElements){
    element.classList.remove("hidden");
    element.classList.add("active");
  }
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
  resetSideResponses();
} 


function checkAnswer(){
  var answerElement=document.getElementById("answer");
  var answer=answerElement.value;
  answerElement.value="";
  document.getElementById("score").innerHTML;
  for(const kanji of answer){
    if (bannedAnswerList.includes(kanji)){
      continue;
    }
    
    if (activeList[currentQuestion].includes(kanji)){
      document.getElementById("score").innerHTML=1+parseInt(document.getElementById("score").innerHTML);
      temp = document.getElementById("response"+currentResponse);
      temp.classList.add("acceptedResponse");
      temp.innerHTML=kanji;
      currentResponse++;
      addBannedAnswer(kanji);
      addTime();
      if (currentResponse>3){
        correctTracker.push("answeredCorrectly");
        pickQuestion();
        break;
      }

    }
  }
}
function addBannedAnswer(kanji){
  bannedAnswerList.push(kanji);
  temp=document.createElement("p");
  text=document.createTextNode(kanji);
  temp.appendChild(text);
  temp.classList.add("bannedAnswer");
  document.getElementById("bannedContainer").appendChild(temp);

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
  var row;
  var temp;
  var kanji;
  let i=0;
  summaryAnswerContainer=document.getElementById("summaryAnswerContainer");
  for (let component of askedPool){
    console.log(correctTracker);
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
  correctTracker=[];
  document.getElementById("answer").value="";
  resetSideResponses();
  document.getElementById("bannedContainer").innerHTML="";
  bannedAnswerList=[];
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


}
function resetSideResponses(){
  sideResponses=document.getElementById("responseContainer").children;
  for (element of sideResponses){
    element.classList.remove("acceptedResponse");
    element.innerHTML="";
  }
  currentResponse=1;
}