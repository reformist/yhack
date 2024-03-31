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

import json

import base64
import requests

load_dotenv(find_dotenv())
app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

API_KEY = os.getenv('OPENAI_API_KEY')

'''
Return the items tied to the user
'''

# Function to encode the image
def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')

@app.route('/testUpload', methods=["GET", "POST"])
def testUpload():
    # Get the current script's directory
    '''
    current = __file__
    gpt_dir = os.path.dirname(current)
    backend_dir = os.path.dirname(gpt_dir)
    absolute_path = os.path.abspath(backend_dir) + '/assets/'

    # Path to your image
    image_name = absolute_path + 'test.png'

    # Getting the base64 string
    base64_image = encode_image(image_name)
    '''
    base64_encoded_image = None

    if 'image' not in request.files:
        return jsonify({'error': 'No image part'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        # Convert the image to base64
        base64_encoded_image = base64.b64encode(file.read()).decode('utf-8')
        # You can now store or use the base64_encoded_image as needed
        # For demonstration, we'll just return it (not recommended for large images due to response size)
        # return jsonify({'message': 'Image uploaded successfully', 'base64Image': base64_encoded_image})

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }

    # before adding any messages, set the instructions
    instructions = define_instructions()

    payload = {
    "model": "gpt-4-vision-preview",
    "messages": [
        {
        "role": "user",
        "content": [
            {
            "type": "text",
            "text": instructions
            },
            {
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{base64_encoded_image}"
            }
            }
        ]
        }
    ],
    "max_tokens": 300
    }

    try:
        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
        response = response.json()

        print("RESPONSE")
        print(response)

        choices = response['choices']
        choices_dict = choices[0]
        message = choices_dict['message']
        content = message['content']
        
        # print(type(response))
        # print(response.keys())
        # print(type(response['choices']))

        # response = json.loads(response) # json str to json / dict
        

        return json.loads(content)
    
    except Exception as e:
        print(e)

    '''
    objects = response.choices[0].message.content
    objects = json.loads(objects)

    return objects
    '''

'''
Return the items located in the image, once user uploads
'''
@app.route('/upload', methods=["GET"])
def upload():
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