# import json
#
# import socketio
# import eventlet
#
# from chats import *
#
# # 创建一个 Socket.IO 服务器
# sio = socketio.Server(cors_allowed_origins='*')
#
# # 创建一个 WSGI 应用程序
# app = socketio.WSGIApp(sio)
#
# chat_repository = ChatRepository()
#
# @sio.event
# def connect(sid, environ):
#     print('Client connected', sid)
#
# @sio.event
# def disconnect(sid):
#     print('Client disconnected', sid)
#
# @sio.event
# def create_message(sid, data):
#     print('Received message:', data)
#     try:
#         data_json = json.loads(data)
#         event = data_json['event']
#         message_data = data_json['data']
#
#         if event == 'message.create':
#             chat_room_id = '1'
#             chat_repository.create_user_message(chat_room_id, message_data)
#
#             def emit_model_response(response_data, event_type):
#                 sio.emit(event_type, {'event': event_type, 'data': response_data}, room=sid)
#
#             chat_repository.create_model_message(chat_room_id, message_data, emit_model_response)
#     except Exception as e:
#         print('Error processing message:', e)
#         sio.emit('error', {'error': 'Invalid message format'}, room=sid)
#
# if __name__ == '__main__':
#     port = 8080
#     print(f'Starting server on port {port}')
#     eventlet.wsgi.server(eventlet.listen(('', port)), app)
