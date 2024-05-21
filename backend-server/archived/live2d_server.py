# import os
#
# from prompts import load_prompt
# import utils as U
#
# from flask import Flask, request, jsonify, Response
# from flask_cors import CORS
#
# from langchain.chat_models import ChatOpenAI
# from langchain.schema import HumanMessage, SystemMessage
#
# from dotenv import load_dotenv
#
# load_dotenv()
#
# app = Flask(__name__)
# CORS(app)
#
# openai_api_key = os.getenv('OPENAI_API_KEY')
#
# @app.route('/api/chat', methods=['POST'])
# def chat():
#     input_message = request.json.get('inputMessage')
#     llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0)
#     system_message = SystemMessage(content=load_prompt('role'))
#     human_message = HumanMessage(input_message)
#     messages = [system_message, human_message]
#     response = llm(messages).content
#
#     print(response)
#
#     return jsonify({'message': response}), 200
#
#
# @app.route('/api/elevenlabs/tts', methods=['POST'])
# def elevenlabs_tts():
#     text = request.json.get('text')
#     audio_data = U.generate_audio(text)
#     return Response(audio_data, mimetype='audio/wav'), 200
#
#
# if __name__ == '__main__':
#     app.run(port=8080, debug=True)
