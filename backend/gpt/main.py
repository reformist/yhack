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

def interpretJSON(j): # json string
   # insertResponse = client.table('DataTable').insert(json.loads(j)).execute()
    insertResponse = client.table('DataTable').insert(j).execute()

def fetch_last_row(table_name):
    result = client.table(table_name)\
        .select("*")\
        .order("id", desc=True)\
        .limit(1)\
        .execute()
     
    try:
        data = result.data
        return data[0] if data else None
    except:
        print(f"Error!!!!!!!")
        return None

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

    if True: # use GPT
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

        payload = {
        "model": "gpt-4-1106-vision-preview", # gpt-4-vision-preview
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
        "max_tokens": 4096 # 300
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

            json_content = json.loads(content)
            
        except Exception as e:
            print(e)

    ''' test string
    json_content = { # hardcode for now to test
        'Yogurt': 2,
        'Cheese': 1,
        'Mayo': 1,
        'Orange Juice': 1,
    }
    '''

    # get the last row from the table
    # should start as 0, 0, 0 for the user
    # only recommend the options for the shopping list as there are less

    shopping_recs = dict()

    table_name = "DataTable"
    last_row = fetch_last_row(table_name)
    if last_row: # last row exists
        for current_item, current_value in json_content.items():
            for past_item, past_value in last_row.items():
            
                if current_item == past_item: # same item
                    diff = current_value - past_value
                    print(f"{current_item}: {diff}")
                    if diff >= 0: # means we've gained more stayed same
                        pass
                    else: # lost so we should buy that difference
                        shopping_recs[current_item] = abs(diff)
                    
                    break
    else:
        print("No row found or an error occurred.")

    interpretJSON(json_content) # now add the row to the database

    # format for the frontend

    output = list()

    id = 1

    for item_name in shopping_recs:
        entry_data = {
            'id': id,
            'title': item_name,
            'count': shopping_recs[item_name]
        }

        id += 1

        # response = client.from_(table_name).select("*").eq("id", 1).execute()

        output.append(entry_data)

    return jsonify(output)

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