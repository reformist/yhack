from __future__ import print_function

from dotenv import load_dotenv, find_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS

import os

from openai import OpenAI
import openai

import traceback
import re

import os.path
import sys

import base64

import requests
import json

load_dotenv(find_dotenv())
app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

'''
Return the grocery items for the user
'''
@app.route('/items', methods=["GET"])
def items():
    messages = [] # list of messages for gpt
    # in messages, we want the first item to be the system response

    # before adding any messages, set the instructions
    instructions = define_instructions()
    messages.append({'role': 'system', 'content': instructions})
    
    message = f''' replace later
    '''

    # need to figure out how to upload an image
    message = {'role': 'user', 'content': message} # roles - user, assistant
    messages.append(message)

    # generate new response from gpt
    new_messages = generate(messages)
    response = new_messages[-1]['content'].strip() # take the last (most recent) message

    try:
        return {
            'success': True,
            'response': response
        }
    except Exception as e:
        # printing stack trace of error
        traceback.print_exc()

        return {
            'success': False,
            'error': str(e)
        }, 500

'''
Initial instructions for GPT
'''
def define_instructions():

    categories = ['water bottle', 'laptop', 'sticker']
    categories = ', '.join(categories)

    example_response = {
	    'water-bottle': 1,
	    'sticker': 2
    }

    example_response = json.dumps(example_response)

    # user message
    instructions = f'''
    Here are instructions for each of my subsequent queries.

    For each image I upload, please analyze the image and indicate if there are any objects pertaining to these categories: {categories}

    Additionally, indicate the number of objects present. For instance, if you see 1 water bottle and 2 stickers, your JSON response should be this:

    {example_response}
    '''

    return instructions

'''
Generate a new response using GPT
New method using gpt-4 turbo and JSON mode
'''
def generate(MESSAGES):

    # OPEN AI SETUP - NEW
    api_key = os.getenv('OPENAI_API_KEY')
    # openai.api_key = api_key

    client = OpenAI(
        api_key=api_key
    )

    MODEL = 'gpt-3.5-turbo-1106'
    # MODEL = 'gpt-4-turbo-preview' # UPGRADING TO GPT 4, can use the turbo version later on
    # model = 'gpt-3.5-turbo' # can try with gpt 4 later

    try:
        response = client.chat.completions.create(
        model=MODEL,
        response_format={ "type": "json_object" },
        messages=MESSAGES
        )

        MESSAGES.append({'role': response.choices[0].message.role, 'content': response.choices[0].message.content})
    except openai.APIError as e:
        #Handle API error here, e.g. retry or log
        print(f"OpenAI API returned an API Error: {e}")

    return MESSAGES

if __name__ == '__main__':
   app.run(debug = True)