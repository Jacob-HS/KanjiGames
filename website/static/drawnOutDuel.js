(() => {
  let roomNum;
  let host;
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

})();