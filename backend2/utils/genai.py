import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# System instruction for summarization
SUMMARIZE_PROMPT = (
    "I want you to act as a professional summarizer. "
    "Your goal is to read and understand the provided text, document, or notes, "
    "and then produce a concise summary that captures the main ideas, key points, "
    "and any relevant details. Avoid including unnecessary information or repetition, "
    "and ensure the summary is clear and easy to understand."
)

CHAT_PROMPT = (
    "You will be provided with a piece of text, which could be notes, a document, or any other written content. " 
    "Consider this text as your context for the following conversation. "
    "I will ask you questions about the context, and you should answer them accurately and comprehensively based on the provided information. " 
    "If there is any information missing or unclear, you can state that you cannot answer definitively based on the given context. "
    "Keep your responses clear, concise, and relevant to the context, with a maximum of 3 sentences. "
    "Let's begin."
)

def configure_model(gen_type=None, context=None):
    """
    Configures the Generative AI model with the required settings.

    Returns:
        GenerativeModel: The configured Generative AI model.
    """
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

    generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 40,
        "max_output_tokens": 8192,
        "response_mime_type": "text/plain",
    }

    system_instruction = (
        (CHAT_PROMPT + f"\nContext:\n{context}") if gen_type == "chat" else SUMMARIZE_PROMPT
    )
    
    return genai.GenerativeModel(
        model_name="gemini-2.0-flash-exp",
        generation_config=generation_config,
        system_instruction=system_instruction,
    )

def gen_chat(user_input, history=None, gen_type="chat", context=None):
    """
    Initiates a Generative AI chat session and retrieves a response.

    Parameters:
        user_input (str): The input message from the user.
        history (list): Optional conversation history.
        gen_type (str): Type of generation ('chat' or 'summarize').
        context (str): Optional context for the chat.

    Returns:
        str: The AI model's response.
    """
    history = history or []

    # Configure the model based on the generation type
    model = configure_model(gen_type=gen_type, context=context)

    if gen_type == "chat":
        chat_session = model.start_chat(history=history)
        response = chat_session.send_message(user_input)
    else:
        response = model.generate(user_input)

    return response.text
