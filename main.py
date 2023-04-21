from website import create_app
from flask import request
import json
from flask_socketio import SocketIO, emit, join_room, leave_room, rooms, send
import random
app = create_app()
socketio = SocketIO(app)
roomInfo = {} #{"roomName": {"participants":[], "askedQuestions"=[], "hostName":"", "difficulty": int, "scoreLimit": int}} <- make this happen
roomDict = {}
askedQuestions={}

with open("svgjson.json","r",encoding="utf-8") as svgfile:
    svgs=json.load(svgfile)
with open("vnJukugo.json","r",encoding="utf-8") as svgfile:
    vnJukugo=json.load(svgfile)
@socketio.on("my_event")
def my_event(message):

    print("\n\n",roomInfo,"\n\n")
    emit('my_response',
         {'data': "harro"})
    
@socketio.on("disconnect")
def clientDisconnect():
    try:
        del roomInfo[rooms()[0]]
    except KeyError:
        pass
    emit("gameCanceled", to=rooms()[0])
@socketio.event
def connect():
    print(request.sid, "connected")
    
@socketio.event
def makeRoom():
    leave_room(rooms()[0])
    roomNumber = str(random.randint(1,100))
    while roomNumber in roomInfo.keys():
        roomNumber = str(random.randint(1,100))
    join_room(roomNumber)
    roomInfo[str(roomNumber)]={}
    roomInfo[str(roomNumber)]["participants"]=[]
    roomInfo[str(roomNumber)]["participants"].append([request.sid, False]) #sid and their Readyup state(for endgame replay options)
    roomInfo[str(roomNumber)]["askedQuestions"]=[]
    
    #askedQuestions[str(roomNumber)]=[]
    return roomNumber

@socketio.event
def join(roomNumber):
    if (str(roomNumber) not in roomInfo.keys() or (len(roomInfo[str(roomNumber)]["participants"])>1)):
        return [False, "Error"]
    leave_room(rooms()[0])
    join_room(str(roomNumber))
    roomInfo[str(roomNumber)]["participants"].append([request.sid,False])
    return [True,roomInfo[rooms()[0]]["hostName"], roomInfo[rooms()[0]]["scoreLimit"]]


@socketio.event
def pickName(name, host, scoreLimit, difficulty):
    if host: 
        roomInfo[rooms()[0]]["hostName"] = name
        roomInfo[rooms()[0]]["difficulty"] = difficulty
        roomInfo[rooms()[0]]["scoreLimit"] = scoreLimit
    else:
        emit("pickedName", name, to=rooms()[0],include_self=False)
        emit("startGame", to=rooms()[0])

@socketio.event
def requestQuestion(difficulty):
    questionInfo=generateNewQuestion(rooms()[0], roomInfo[rooms()[0]]["difficulty"])
    emit("newQuestion", questionInfo, to=rooms()[0])

def generateNewQuestion(room, difficulty):
    questionInfo={}
    if (difficulty==1):
        activePool=list(vnJukugo.items())[:1585]
    if (difficulty==2):
        activePool=list(vnJukugo.items())
    key, value = random.choice(activePool)
    while key in roomInfo[rooms()[0]]["askedQuestions"]:
        key, value = random.choice(activePool)
    questionInfo["word"]=key
    questionInfo["hiragana"]=value
    questionInfo["svgs"]=[]
    for kanji in questionInfo["word"]:
        questionInfo["svgs"].append(svgs[kanji])
    pathCount=0

    for svg in questionInfo["svgs"]:
        pathCount+=svg.count("<path")
    arr = [i for i in range(pathCount)]
    random.shuffle(arr)
    questionInfo["appearOrder"]=arr
    return questionInfo

@socketio.event
def correctAnswer(host, question):
    if (question not in roomInfo[rooms()[0]]["askedQuestions"]):
        emit("awardPoint",host, to=rooms()[0])
        roomInfo[rooms()[0]]["askedQuestions"].append(question)

@socketio.event
def readyUp():
    #toggle ready state
    for player in roomInfo[rooms()[0]]["participants"]:
        if player[0]==(request.sid):
            player[1]=not player[1]
    
    #if both players are readied up
    if (roomInfo[rooms()[0]]["participants"][0][1] and roomInfo[rooms()[0]]["participants"][1][1]):
        #unreadyUp
        roomInfo[rooms()[0]]["participants"][0][1]=False
        roomInfo[rooms()[0]]["participants"][1][1]=False
        roomInfo[rooms()[0]]["askedQuestions"]=[]
        emit("restartGame", to=rooms()[0])
    else:
        emit("opponentReady", to=rooms()[0], include_self=False)


if __name__ == '__main__':
    socketio.run(app, debug=True)
