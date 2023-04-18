from website import create_app
from flask import request
import json
from flask_socketio import SocketIO, emit, join_room, leave_room, rooms, send
import random
app = create_app()
socketio = SocketIO(app)
hostNames = {}
roomDict = {}
askedQuestions={}

with open("svgjson.json","r",encoding="utf-8") as svgfile:
    svgs=json.load(svgfile)
with open("vnJukugo.json","r",encoding="utf-8") as svgfile:
    vnJukugo=json.load(svgfile)
@socketio.on("my_event")
def my_event(message):
    print("im in bois")
    emit('my_response',
         {'data': "harro"})

@socketio.event
def connect():
    print(request.sid, "connected")
    
@socketio.event
def makeRoom():
    leave_room(rooms()[0])
    roomNumber= str(random.randint(1,100))
    join_room(roomNumber)
    roomDict[str(roomNumber)]=[]
    askedQuestions[str(roomNumber)]=[]
    roomDict[str(roomNumber)].append([request.sid, False]) #sid and their Readyup state(for endgame replay options)
    return roomNumber

@socketio.event
def join(roomNumber):
    leave_room(rooms()[0])
    join_room(str(roomNumber))
    roomDict[str(roomNumber)].append([request.sid,False])
    return hostNames[rooms()[0]]


@socketio.event
def pickName(name, host):
    if host: 
        hostNames[rooms()[0]] = name
    else:
        emit("pickedName", name, to=rooms()[0],include_self=False)
        emit("startGame", to=rooms()[0])

@socketio.event
def requestQuestion():
    questionInfo=generateNewQuestion(rooms()[0])
    emit("newQuestion", questionInfo, to=rooms()[0])

def generateNewQuestion(room):
    questionInfo={}
    key, value = random.choice(list(vnJukugo.items()))
    while key in askedQuestions[room]:
        key, value = random.choice(list(vnJukugo.items()))
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
    if (question not in askedQuestions[rooms()[0]]):
        emit("awardPoint",host, to=rooms()[0])
        askedQuestions[rooms()[0]].append(question)

@socketio.event
def readyUp():
    #toggle ready state
    print(roomDict)
    for player in roomDict[rooms()[0]]:
        if player[0]==(request.sid):
            player[1]=not player[1]
    
    #if both players are readied up
    if (roomDict[rooms()[0]][0][1] and roomDict[rooms()[0]][1][1]):
        #unreadyUp
        roomDict[rooms()[0]][0][1]=False
        roomDict[rooms()[0]][1][1]=False
        askedQuestions[rooms()[0]]=[]
        emit("restartGame", to=rooms()[0])
    else:
        emit("opponentReady", to=rooms()[0], include_self=False)


if __name__ == '__main__':
    socketio.run(app, debug=True)
