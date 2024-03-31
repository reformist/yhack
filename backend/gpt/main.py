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

import os
import json
from supabase import create_client, Client

load_dotenv(find_dotenv())
app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

API_KEY = os.getenv('OPENAI_API_KEY')

URL = 'https://hxpwtuoiuaqflszxeqja.supabase.co'
KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4cHd0dW9pdWFxZmxzenhlcWphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE4Mjk4OTQsImV4cCI6MjAyNzQwNTg5NH0.6bnY8se-ydQ4kbuBWi6HER_FIMmb90qnn-fvTthFmBA'
client = create_client(URL, KEY)

def interpretJSON(j): # json
   insertResponse = client.table('MainTable').insert(json.loads(j)).execute()

'''
Return the items tied to the user
'''

# Function to encode the image
def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')

@app.route('/testUpload', methods=["GET", "POST"])
def testUpload():
    # test this tomorrow
    categories = ['Milk', 'Eggs', 'Yogurt', 'Chicken', 'Beef', 'Cheese', 'Butter', 'Pickles', 'Mushrooms', 'Kiwis', 'Lemons', 'Grapes', 'Apples', 'Orange Juice', 'Lettuce', 'Watermelons', 'Carrots', 'Onions', 'Broccoli', 'Soda', 'Mayo']
    categories = ', '.join(categories)

    # id pulled from database
    # title is the name of thing
    # count is the number

    objects = {
        'Milk': 2,
        'Eggs': 4,
        'Yogurt': 3,
    }

    output = list()

    id = 1

    for item_name in objects:
        entry_data = {
            'id': id,
            'title': item_name,
            'count': objects[item_name]
        }

        id += 1

        # response = client.from_(table_name).select("*").eq("id", 1).execute()

        output.append(entry_data)

    print(output)
    
    return jsonify(output)

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
    '''

    data = request.json  # Get JSON data from the request
    image_url = data.get('imageUrl')  # Extract the image URL from the JSON data

    if not image_url:
        return jsonify({'error': 'No image URL provided'}), 400
    
    print(f"Received image URL: {image_url}")

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }

    # before adding any messages, set the instructions
    instructions = define_instructions()

    '''
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
    '''

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
                "url": image_url,
            }
            }
        ]
        }
    ],
    "max_tokens": 4096
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

    objects = response.choices[0].message.content
    objects = json.loads(objects)

    return objects

    '''
    # OPEN AI SETUP - NEW
    api_key = os.getenv('OPENAI_API_KEY')
    # openai.api_key = api_key

    client = OpenAI(
        api_key=api_key
    )

    response = client.chat.completions.create(
        model="gpt-4-vision-preview",
        messages=[
            {
            "role": "user",
            "content": [
                {"type": "text", 
                 "text": instructions
                },
                {
                "type": "image_url",
                "image_url": {
                    "url": image_url,
                },
                },
            ],
            }
        ],
        max_tokens=4096,
    )

    print(type(response))

    # then add the entry
    # interpretJSON(json)

    return response
    '''

def add_entry():
    pass

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

    categories = ['Milk', 'Eggs', 'Yogurt', 'Chicken', 'Beef', 'Cheese', 'Butter', 'Pickles', 'Mushrooms', 'Kiwis', 'Lemons', 'Grapes', 'Apples', 'Orange Juice', 'Lettuce', 'Watermelons', 'Carrots', 'Onions', 'Broccoli', 'Soda', 'Mayo']
    categories = ', '.join(categories)

    example_response = {
	    'Milk': 1,
	    'Apples': 2
    }

    example_response = json.dumps(example_response)

    # user message
    instructions = f'''
    Here are instructions for each of my subsequent queries.

    For each image I upload, please analyze the image and indicate if there are any objects pertaining to these categories: {categories}

    Additionally, indicate the number of objects present. For instance, if you see 1 milk and 2 apples, your JSON response should be this:

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