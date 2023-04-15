from website import create_app
from flask import request
from flask_socketio import SocketIO, emit, join_room, leave_room, rooms, send
import random
app = create_app()
socketio = SocketIO(app)
hostNames = {}
roomDict = {}

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
    roomDict[str(roomNumber)]=[request.sid]
    return roomNumber

@socketio.event
def join(roomNumber):
    leave_room(rooms()[0])
    join_room(str(roomNumber))
    roomDict[str(roomNumber)].append(request.sid )
    return hostNames[rooms()[0]]


@socketio.event
def pickName(name, host):
    if host: 
        hostNames[rooms()[0]] = name
    else:
        emit("pickedName", name, to=rooms()[0],include_self=False)
        emit("startGame", to=rooms()[0])

if __name__ == '__main__':
    socketio.run(app, debug=True)
