import os
import json
from datetime import timedelta

import azure.cognitiveservices.speech as speechsdk

from prompts import load_prompt
import utils as U

from flask import Flask, request, jsonify, Response, send_from_directory
from flask_socketio import SocketIO
from flask_cors import CORS

from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage

from twilio.rest import Client as TwilioClient

from prisma.models import User, Messages
from prisma import Client as PrismaClient, register

from chats import *

import bcrypt
import jwt

from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder=os.getenv('REACTJS_BUILD_FOLDER'))

# app.config['SECRET_KEY'] = 'secret!'

CORS(app)
sio = SocketIO(app, always_connect=True)

openai_api_key = os.getenv('OPENAI_API_KEY')

# Subscription settings from Azure
subscription_key = os.getenv('AZURE_SPEECH_API_KEY')
subscription_region = "japaneast"

chat_repository = ChatRepository()

# OTP
account_sid = os.getenv("TWILIO_ACCOUNT_SID")
verify_sid = os.getenv("TWILIO_VERIFY_SID")
twilio_auth_token = os.getenv("TWILIO_AUTH_TOKEN")

twilio_client = TwilioClient(account_sid, twilio_auth_token)

prisma_client = PrismaClient()
register(prisma_client)
prisma_client.connect()


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        input_message = request.json.get('inputMessage')
        print(input_message)

        llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0)

        system_message = SystemMessage(content=load_prompt('role'))
        human_message = HumanMessage(input_message)
        messages = [system_message, human_message]

        response = llm(messages).content
        return jsonify({'message': response}), 200
    except Exception as e:
        print(f"Error sending message: {e}")
        return Response(f"Error sending message: {e}", status=500)


@app.route('/api/azure/tts', methods=['POST'])
def azure_tts():
    text = request.json.get('text')
    language = 'zh-CN'
    voice = 'zh-CN-XiaoxiaoNeural'

    speech_config = speechsdk.SpeechConfig(subscription=subscription_key, region=subscription_region)
    speech_config.speech_synthesis_language = language
    speech_config.speech_synthesis_voice_name = voice

    synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=None)

    result = synthesizer.speak_text_async(text).get()

    if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
        audio_data = result.audio_data
        return Response(audio_data, mimetype='audio/wav'), 200
    else:
        return Response("Error synthesizing speech", status=500)


@app.route('/api/data', methods=['GET'])
def get_data():
    # Your API logic here
    return jsonify({'message': 'Hello from the server!'})


if __name__ == '__main__':
    sio.run(app, host='0.0.0.0', port=8080, debug=True)
