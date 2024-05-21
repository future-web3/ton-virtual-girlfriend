import os
import uuid
from datetime import datetime

import google.generativeai as genai


class Message:
    def __init__(self, content, source_type, chat_room_id, id=None, created_at=None):
        self.id = id if id else str(uuid.uuid4())
        self.content = content
        self.source_type = source_type
        self.chat_room_id = chat_room_id
        self.created_at = created_at if created_at else datetime.now()

    def to_dict(self):
        return {
            "id": self.id,
            "content": self.content,
            "sourceType": self.source_type,
            "chaRoomId": self.chat_room_id,
            "createdAt": self.created_at.isoformat()
        }


class ChatRepository:
    def __init__(self):
        # Key: chat room ID, Value: list of Message objects
        self.chat_rooms = {}
        genai.configure(api_key="AIzaSyBamTXks0zSy-hmWjcpRnSR_HapD6p3cSE")
        self.model = genai.GenerativeModel(model_name="gemini-pro")

    def create_user_message(self, chat_room_id, data):
        message = Message(content=data['content'], source_type='user', chat_room_id=chat_room_id)
        self.chat_rooms.setdefault(chat_room_id, []).append(message)
        return message

    def create_model_message(self, chat_room_id, data, emit_callback):
        # This function simulates interacting with an AI model to generate a response
        # model_response_content = "Simulated model response based on '{}'".format(data['content'])

        content = data['prompt'] + data['content']
        response = self.model.count_tokens(content)
        token_length = response.total_tokens

        response = self.model.generate_content(content)
        model_response_content = response.text

        response = self.model.count_tokens(model_response_content)
        token_length += response.total_tokens

        model_message = Message(content=model_response_content, source_type=1, chat_room_id=chat_room_id)
        self.chat_rooms[chat_room_id].append(model_message)

        # Emitting model response back to client
        # model_message.to_dict() => {'id': 'b371fcdf-1482-4002-9f20-e09308c3f04e', 'content': "Simulated model response based on 'hi'", 'sourceType': 1, 'chatRoomId': '1', 'createdAt': '2024-03-06T15:56:50.956122'}
        emit_callback(model_message.to_dict(), 'message.created')
        return token_length

    def fetch_messages(self, chat_room_id):
        return [message.to_dict() for message in self.chat_rooms.get(chat_room_id, [])]
