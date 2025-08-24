from flask import Flask, request, redirect, render_template, jsonify, flash, session

import requests
import numpy as np
from waitress import serve
from flask_cors import CORS, cross_origin
import openai

app = Flask(__name__)
cors = CORS(app)

@app.route('/law_pred', methods=['POST'])
@cross_origin()
def law_prediction():
    import constants

    # Load your API key from an environment variable or secret management service
    openai.api_key = constants.APIKEY
    messages = [
        {"role": "system",
         "content": "You are an indian lawyer that should analyze the input to give severity of the case description mentioned by the user from 1-10. The case severity that you're gonna output should depend on duration of punishment and level of danger of offence that has been committed. Carefully analyze the description before rating the severity on a scale from 1-10. Give the answer in one sentence and mention the sevrity of the case from 1-10 without fail."},
    ]

    message = request.json['desc']
    message = str(message)

        # Add each new message to the list
    messages.append({"role": "user", "content": message})

    # Request gpt-3.5-turbo for chat completion
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages
    )

    # Print the response and add it to the messages list
    chat_message = response['choices'][0]['message']['content']
    print(f"Bot: {chat_message}")
    messages.append({"role": "assistant", "content": chat_message})



    return jsonify({
        "severity": chat_message
    })


if __name__ == '__main__':
    app.run(debug=True, port=3000)
    #serve(app, host='localhost', port=5000)