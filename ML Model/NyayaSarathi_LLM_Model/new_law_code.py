import openai
import os

import constants

# Load your API key from an environment variable or secret management service
openai.api_key = constants.APIKEY
#openai.api_key = os.getenv("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")

def chatbot():
  # Create a list to store all the messages for context
  messages = [
    {"role": "system", "content": "You are an indian lawyer that should analyze the input to give severity of the case description mentioned by the user from 1-10. The case severity that you're gonna output should depend on duration of punishment and level of danger of offence that has been committed. Carefully analyze the description before rating the severity on a scale from 1-10. Give the answer in one sentence and mention the sevrity of the case from 1-10 without fail."},
  ]

  # Keep repeating the following
  while True:
    # Prompt user for input
    message = input("User: ")

    # Exit program if user inputs "quit"
    if message.lower() == "quit":
      break

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

if __name__ == "__main__":
  print("Start chatting with the bot (type 'quit' to stop)!")
  chatbot()