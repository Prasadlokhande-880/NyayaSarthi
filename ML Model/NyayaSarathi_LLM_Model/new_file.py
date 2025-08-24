import streamlit as st
from langchain.document_loaders.csv_loader import CSVLoader
from langchain.vectorstores import FAISS
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.prompts import PromptTemplate
from langchain.chat_models import ChatOpenAI
from langchain.chains import LLMChain
from langchain.document_loaders import TextLoader
import os


os.environ["OPENAI_API_KEY"] = "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"


from dotenv import load_dotenv

load_dotenv()

# 1. Vectorise the sales response csv data
#loader = CSVLoader(file_path="sales_response.csv")
#documents = loader.load()

loader = TextLoader("data/IPC.txt")
documents = loader.load()

embeddings = OpenAIEmbeddings()
db = FAISS.from_documents(documents, embeddings)

# 2. Function for similarity search


def retrieve_info(query):
    similar_response = db.similarity_search(query, k=1)

    page_contents_array = [doc.page_content for doc in similar_response]

    # print(page_contents_array)

    return page_contents_array


# 3. Setup LLMChain & prompts
llm = ChatOpenAI(temperature=0, model="gpt-3.5-turbo-1106")

template = """
You are a law enforcing crime evaluater. Based on the data given to your about various punishments for various offences,
you have to take the user input which will be description of the crime, compare it with the corresponding charges mentioned in the data given and give me a severity level of the offence between 1-10. 
Where 1 being that the offence is not very serious and can be overlooked and 10 being that the charges are quite serious and the offense is quite severe and should be punished urgently.

All the information and description on each section is mentioned after section[]. Where the number in square brackets can be anything.

Give the response in a single sentence where you explain the severity of the crime and rate it from 1-10.

Below is a message I received from the prospect:
{message}

Here is a list of best practies of how we normally respond to prospect in similar scenarios:
{best_practice}
"""

prompt = PromptTemplate(
    input_variables=["message", "best_practice"],
    template=template
)

chain = LLMChain(llm=llm, prompt=prompt)


# 4. Retrieval augmented generation
def generate_response(message):
    best_practice = retrieve_info(message)
    response = chain.run(message=message, best_practice=best_practice)
    return response


# 5. Build an app with streamlit
def main():
    st.set_page_config(
        page_title="Customer response generator", page_icon=":bird:")

    st.header("Customer response generator :bird:")
    message = st.text_area("customer message")

    if message:
        st.write("Generating best practice message...")

        result = generate_response(message)

        st.info(result)


if __name__ == '__main__':
    main()