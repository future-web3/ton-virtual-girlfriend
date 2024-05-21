import os
import json
from datetime import timedelta

import azure.cognitiveservices.speech as speechsdk

from prompts import load_prompt, load_role
import utils as U

from flask import Flask, request, jsonify, Response, send_from_directory
from flask_socketio import SocketIO
from flask_cors import CORS

from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage

from twilio.rest import Client as TwilioClient

from prisma.models import User, Messages, Order
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
        messages_to_insert = []

        input_message = request.json.get('inputMessage')
        role = request.json.get('role')
        parsed_role = load_role(role)
        print(input_message)
        auth_header = request.headers['Authorization']
        token = auth_header.split(' ')[1]
        user = U.authenticate_with_jwt(token)
        current_token_count = int(user.currentTokenCount)
        token_limit = int(user.tierStatus['tokenLimit'])

        if current_token_count > token_limit:
            print('Token limit exceeded')
            return Response(f"Error sending message: Token limit exceeded", status=500)

        llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0)

        system_message = SystemMessage(content=load_prompt(parsed_role))
        human_message = HumanMessage(input_message)
        # messages = [system_message, human_message]
        messages_token_count = U.count_gpt_tokens(text=load_prompt(parsed_role)) + U.count_gpt_tokens(input_message)

        context = 5
        human_messages = U.retrieve_human_messages(user.id, context)
        ai_messages = U.retrieve_ai_messages(user.id, context)

        messages = []
        if len(human_messages) > 0 and len(ai_messages) > 0:
            # messages.append(system_message)
            # human_message_idx = 0
            # ai_message_idx = 0
            # for i in range(len(human_messages) + len(ai_messages)):
            #     if i % 2 == 0:
            #         messages.append(human_messages[human_message_idx])
            #         human_message_idx += 1
            #     else:
            #         messages.append(ai_messages[ai_message_idx])
            #         ai_message_idx += 1
            # messages.append(human_message)
            U.process_context_message(messages, human_message, system_message, human_messages, ai_messages)
            print(messages)
        else:
            messages = [system_message, human_message]

        response = llm(messages).content

        messages_to_insert.append({"fromUserId": user.id, "isUser": True, "content": input_message})
        messages_to_insert.append({"toUserId": user.id, "isUser": False, "content": response})
        U.insert_message(messages_to_insert)

        response_token_count = U.count_gpt_tokens(response)
        total_token_count = messages_token_count + response_token_count
        token_remaining = int(token_limit) - int(total_token_count)
        U.update_token_usage(user.id, user.currentTokenCount, total_token_count)
        print(response)
        print("Total Token: ", total_token_count)
        return jsonify({'message': response, 'tokenRemaining': token_remaining}), 200
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


@app.route('/api/otp/send', methods=['POST'])
def send_otp():
    try:
        number = request.json.get('number')
        print('number', number)
        verification = twilio_client.verify.v2.services(verify_sid) \
            .verifications \
            .create(to=number, channel="sms")
        return jsonify({'verificationStatus': verification.status}), 200
    except:
        return jsonify({'verificationStatus': "failed"}), 500


@app.route('/api/otp/verify', methods=['POST'])
def verify_otp():
    try:
        number = request.json.get('number')
        otp_code = request.json.get('otpCode')
        verification_check = twilio_client.verify.v2.services(verify_sid) \
            .verification_checks \
            .create(to=number, code=otp_code)
        if verification_check.status == 'approved':
            user = User.prisma().create(data={'phoneNumber': number})
            return jsonify({'verificationStatus': 'approved', "user": user.json()}), 200
        else:
            return jsonify({'verificationStatus': verification_check.status}), 403
    except Exception as e:
        print(e)
        return jsonify({'verificationStatus': "failed"}), 500


@app.route('/api/register', methods=['POST'])
def register():
    try:
        number = request.json.get('number')
        username = request.json.get('username')
        password = request.json.get('password').encode('utf-8')
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password, salt)
        user = User.prisma().update(where={'phoneNumber': number},
                                    data={'username': username, 'password': hashed_password.decode('utf-8')})
        user_payload = {
            "id": user.id,
            "username": user.username,
            "number": user.phoneNumber,
            "tierStatus": user.tierStatus
        }
        encoded_jwt = jwt.encode(user_payload, "secret", algorithm="HS256")
        # print(jwt.decode(encoded_jwt, "secret", algorithms=["HS256"]))
        return jsonify({"user": user_payload, "token": encoded_jwt}), 200
    except Exception as e:
        print(e)
        return jsonify({'verificationStatus': "failed"}), 500


@app.route('/api/login', methods=['POST'])
def login():
    try:
        username = request.json.get('username')
        password = request.json.get('password').encode('utf-8')

        user = User.prisma().find_first(where={"username": username})
        hashed_password = user.password.encode('utf-8')
        if bcrypt.checkpw(password, hashed_password):
            user_payload = {
                "id": user.id,
                "username": user.username,
                "number": user.phoneNumber,
                "tierStatus": user.tierStatus
            }
            encoded_jwt = jwt.encode(user_payload, "secret", algorithm="HS256")
            # print(jwt.decode(encoded_jwt, "secret", algorithms=["HS256"]))
            return jsonify({"user": user_payload, "token": encoded_jwt}), 200
        else:
            return jsonify({'verificationStatus': "failed"}), 403
    except Exception as e:
        print(e)
        return jsonify({'verificationStatus': "failed"}), 500


@app.route('/api/telegram/login', methods=['POST'])
def telegram_login():
    try:
        telegram_id = request.json.get('telegramId')
        wallet_address = request.json.get('walletAddress')
        user = U.get_telegram_user(telegram_id)
        if user is not None:
            if user.walletAddress != wallet_address:
                user = User.prisma().update(where={"username": telegram_id}, data={"walletAddress": wallet_address})
        else:
            user = User.prisma().create(data={'username': telegram_id, "walletAddress": wallet_address})
        token_limit = int(user.tierStatus['tokenLimit'])
        current_token_usage = int(user.currentTokenCount)
        user_payload = {
            "id": user.id,
            "telegramId": user.username,
            "walletAddress": user.walletAddress,
            "tokenRemaining": token_limit - current_token_usage
        }
        encoded_jwt = jwt.encode(user_payload, "secret", algorithm="HS256")
        return jsonify({"user": user_payload, "token": encoded_jwt}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': e}), 500


@app.route('/api/telegram/get', methods=['GET'])
def get_user_by_telegram_id():
    try:
        telegram_id = request.args.get('telegramId')
        user = U.get_telegram_user(telegram_id=telegram_id)
        if user is not None:
            user_payload = {
                "id": user.id,
                "telegramId": user.username,
                "walletAddress": user.walletAddress,
                "currentTokenCount": user.currentTokenCount,
                'token_limit': user.tierStatus['tokenLimit']
            }
            return jsonify({"user": user_payload}), 200
        else:
            return jsonify({"message": "user not found"}), 404
    except Exception as e:
        print(e)
        return jsonify({'error': e}), 500


@app.route('/api/subscribe', methods=['POST'])
def subscribe():
    try:
        jwt_token = request.json.get('jwtToken')
        subscribe_type = request.json.get('subscribeType')
        valid_until = datetime.now() + timedelta(days=30)
        tier_status = U.generate_tier_status(subscribe_type)
        user = U.authenticate_with_jwt_and_callback(jwt_token,
                                                    U.update_valid_date_and_tier_status, valid_until=valid_until,
                                                    tier_status=tier_status)
        user_payload = {
            "id": user.id,
            "username": user.username,
            "number": user.phoneNumber,
            "tierStatus": user.tierStatus
        }
        return jsonify({"user": user_payload}), 200
    except Exception as e:
        print('Error processing message:', e)
        return Response("Error subscribe", status=500)


@app.route('/api/telegram/subscribe', methods=['POST'])
def telegram_subscribe():
    try:
        auth_header = request.headers['Authorization']
        token = auth_header.split(' ')[1]
        ton = request.json.get('ton')
        valid_until = datetime.now() + timedelta(days=99999)
        user = U.authenticate_with_jwt(token)
        token_limit = int(user.tierStatus['tokenLimit'])
        tier_status = U.generate_telegram_tier_status(ton, token_limit)
        U.update_valid_date_and_tier_status(user_id=user.id, valid_until=valid_until, tier_status=tier_status)
        user_payload = {
            "id": user.id,
            "telegramId": user.username,
            "tierStatus": user.tierStatus
        }
        return jsonify({"user": user_payload}), 200
    except Exception as e:
        print('Error processing message:', e)
        return Response("Error subscribe", status=500)


@app.route('/api/telegram/order/add', methods=['POST'])
def add_order():
    try:
        from_address = request.json.get('fromAddress')
        boc = request.json.get('boc')
        send_amount = request.json.get('sendAmount')

        auth_header = request.headers['Authorization']
        token = auth_header.split(' ')[1]
        user = U.authenticate_with_jwt(token)

        order_payload = {
            'userId': user.id,
            'fromAddress': from_address,
            "boc": boc,
            "sendAmount": send_amount,
        }
        order = Order.prisma().create(
            data=order_payload)

        order_payload['id'] = order.id

        return jsonify({"order": order_payload}), 200
    except Exception as e:
        print('Error add order:', e)
        return Response("Error add order", status=500)


@app.route('/api/telegram/order/update', methods=['POST'])
def update_order():
    try:
        boc = request.json.get('boc')
        status = request.json.get('status')

        print(boc)

        auth_header = request.headers['Authorization']
        token = auth_header.split(' ')[1]
        U.authenticate_with_jwt(token)

        order = U.update_telegram_order(boc, status)

        order_payload = {
            "id": order.id,
            'userId': order.userId,
            'fromAddress': order.fromAddress,
            "boc": order.boc,
            "sendAmount": order.sendAmount,
        }

        return jsonify({"order": order_payload}), 200
    except Exception as e:
        print('Error add order:', e)
        return Response("Error update order", status=500)


@app.route('/api/data', methods=['GET'])
def get_data():
    # Your API logic here
    return jsonify({'message': 'Hello from the server!'})


@sio.on('connect')
def connect():
    sid = request.sid
    print('Client connected', sid)


@sio.on('disconnect')
def disconnect():
    sid = request.sid
    print('Client disconnected', sid)


@sio.on('create_message')
def create_message(data):
    sid = request.sid
    # print('Received message:', data)
    try:
        data_json = json.loads(data)
        event = data_json['event']

        message_data = data_json['data']

        jwt_token = message_data['jwtToken']
        user = U.authenticate_with_jwt(jwt_token)

        current_token_count = user.currentTokenCount
        token_limit = user.tierStatus['tokenLimit']

        if current_token_count > token_limit:
            print('Token limit exceeded')
            sio.emit('error', {'error': 'Token limit exceeded'}, room=sid)
            return

        if event == 'message.create':
            chat_room_id = '1'
            chat_repository.create_user_message(chat_room_id, message_data)

            def emit_model_response(response_data, event_type):
                # print("Response data:", response_data['content'])
                sio.emit(event_type, {'event': event_type, 'data': response_data}, room=sid)

            token_length = chat_repository.create_model_message(chat_room_id, message_data, emit_model_response)
            print("Token length:", token_length)
            U.update_token_usage(user.id, current_token_count, token_length)

    except Exception as e:
        print('Error processing message:', e)
        sio.emit('error', {'error': 'Invalid message format'}, room=sid)


if __name__ == '__main__':
    sio.run(app, host='0.0.0.0', port=8080, debug=True)
