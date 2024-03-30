from flask import Flask, Response, request, jsonify
from io import BytesIO
import base64
from flask_cors import CORS, cross_origin
import os
import sys

app = Flask(__name__)
# cors = CORS(app)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/test", methods=['GET', 'POST'])
def test():
    print("TRIGGEREEDSOIHGDJF;ASUPODIFJASODIFJAS")

    return {
        "success": True
    }

if __name__ == '__main__':
    app.run(host='localhost', port=5002)