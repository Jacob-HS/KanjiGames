from website import create_app
from flask_socketio import SocketIO, emit
import random
app = create_app()
socketio = SocketIO(app)

@socketio.on("my_event")
def my_event(message):
    print("im in bois")
    emit('my_response',
         {'data': "harro"})

@socketio.event
def generateKey():
    return random.randint(1,100000000)

if __name__ == '__main__':
    socketio.run(app, debug=True)
