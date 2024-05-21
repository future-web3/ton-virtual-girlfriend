import json
import jwt
import tiktoken

from langchain.schema import HumanMessage, SystemMessage, AIMessage

from prisma.models import User, Messages, Order


def authenticate_with_jwt(jwt_token):
    try:
        decoded_token = jwt.decode(jwt_token, "secret", algorithms=["HS256"])
        user = User.prisma().find_first(where={"id": decoded_token['id']})
        if user is None:
            raise Exception("Error authenticating with JWT")
        else:
            return user
    except Exception as e:
        raise Exception("Error authenticating with JWT: ", e)


def authenticate_with_jwt_and_callback(jwt_token, callback, **callback_args):
    try:
        print("Authenticating with JWT", jwt_token)
        decoded_token = jwt.decode(jwt_token, "secret", algorithms=["HS256"])
        print(decoded_token)
        user = callback(decoded_token['id'], **callback_args)
        if user is None:
            raise Exception("Error authenticating with JWT")
        else:
            return user
    except Exception as e:
        raise Exception("Error authenticating with JWT: ", e)


def update_token_usage(user_id, current_token_count, token_length):
    try:
        total_tokens = current_token_count + token_length
        user = User.prisma().update(where={"id": user_id}, data={'currentTokenCount': total_tokens})
        return user
    except Exception as e:
        raise Exception("Error update token usage: ", e)


def update_valid_date_and_tier_status(user_id, valid_until, tier_status):
    try:
        user = User.prisma().update(where={"id": user_id},
                                    data={"validUntil": valid_until, "tierStatus": tier_status})
        return user
    except Exception as e:
        raise Exception("Error update validUntil: ", e)


def generate_tier_status(subscribe_type):
    print(subscribe_type)
    if subscribe_type == "Free":
        return json.dumps({"tier": "Free", "tokenLimit": 1000})
    if subscribe_type == "Basic":
        return json.dumps({"tier": "Basic", "tokenLimit": 400000})
    if subscribe_type == "Premium":
        return json.dumps({"tier": "Premium", "tokenLimit": 2000000})
    raise Exception("unknown subscribe type")


def generate_telegram_tier_status(ton,token_limit):
    try:
        return json.dumps({"tier": "telegram", "tokenLimit": f'{int(float(ton) * 1000000) + int(token_limit)}'})
    except Exception as e:
        print("Error generating telegram tier status: ", e)
        raise Exception("Error generating telegram tier status: ", e)


def count_gpt_tokens(text):
    try:
        encoding = tiktoken.encoding_for_model("gpt-3.5-turbo")
        encoded = encoding.encode(text)
        token_length = len(encoded)
        return token_length
    except Exception as e:
        print("error encoding text: ", e)


def insert_message(data):
    try:
        message = Messages.prisma().create_many(data=data)
        return message
    except Exception as e:
        print("error insert message: ", e)


def retrieve_human_messages(user_id, numbers):
    try:
        user_messages = Messages.prisma().find_many(where={"fromUserId": user_id}, take=numbers,
                                                    order={'createdAt': 'desc'})
        human_messages = [HumanMessage(msg.content) for msg in user_messages]
        # print(human_messages)
        return human_messages
    except Exception as e:
        print("error retrieve human message: ", e)
        return []


def retrieve_ai_messages(user_id, numbers):
    try:
        user_messages = Messages.prisma().find_many(where={"toUserId": user_id}, take=numbers,
                                                    order={'createdAt': 'desc'})
        ai_messages = [AIMessage(msg.content) for msg in user_messages]
        return ai_messages
    except Exception as e:
        print("error retrieve ai message: ", e)
        return []


def process_context_message(messages, human_message, system_message, human_message_records, ai_message_records):
    messages.append(system_message)
    human_message_idx = 0
    ai_message_idx = 0
    for i in range(len(human_message_records) + len(ai_message_records)):
        if i % 2 == 0:
            messages.append(human_message_records[human_message_idx])
            human_message_idx += 1
        else:
            messages.append(ai_message_records[ai_message_idx])
            ai_message_idx += 1
    messages.append(human_message)


def get_telegram_user(telegram_id):
    try:
        user = User.prisma().find_first(where={"username": telegram_id})
        return user
    except Exception as e:
        print("error find telegram user: ", e)
        return None


def update_telegram_order(boc, status):
    try:
        order = Order.prisma().update(where={"boc": str(boc)}, data={"status": status})
        print(order)
        return order
    except Exception as e:
        print("error find telegram user: ", e)
        return None
