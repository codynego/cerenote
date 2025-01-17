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
    "keep your responses clear, concise, and relevant to the context. and maximum of 3 sentences"
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
    
    return genai.GenerativeModel(
        model_name="gemini-2.0-flash-exp",
        generation_config=generation_config,
        system_instruction=(CHAT_PROMPT + f"\n{context}") if gen_type == "chat" else SUMMARIZE_PROMPT
    )

def gen_chat(user_input, history=[], gen_type=None, context=None):
    """
    Initiates a Generative AI chat session and retrieves a response.

    Parameters:
        user_input (str): The input message from the user.
        history (list): Optional conversation history.

    Returns:
        str: The AI model's response.
    """
    if gen_type == "chat":
        model = configure_model(context, gen_type="chat")
    model = configure_model()
    chat_session = model.start_chat(history=history)
    response = chat_session.send_message(user_input)
    return response.text

if __name__ == "__main__":
    # Example user input
    user_input = (
        "If John sends M2 = hash(M1), Anthony could attempt to recover M1 by brute-forcing the hash function. "
        "This involves generating possible values of M1, hashing each of them, and comparing the resulting hash with M2. "
        "If Anthony’s hash matches M2, he has effectively recovered M1. This is feasible if the message M1 is relatively short "
        "or if the hash function is weak and lacks sufficient complexity to resist brute force attacks. "
        "For example, if M1 is a password or a small piece of text, Anthony can use rainbow tables or dictionary attacks to find "
        "the preimage of the hash. Hence, simply sending M2 = hash(M1) is not secure.\b. How can John construct M2 using a secure hash function to avoid these attacks?\n"
        "To avoid such vulnerabilities, John can use a secure cryptographic method to construct M2. One approach is to use a keyed-hash "
        "message authentication code (HMAC) or include a random salt to strengthen the security of the hash.\n"
        "For example:\n"
        "Construction of M2: John can generate a random value (salt) S and compute M2 = hash(S || M1). Here, “||” represents concatenation. "
        "The salt, S, is sent along with M2 to Anthony.\n"
        "Later Verification: During the later verification phase, John reveals M1. Anthony verifies the message by concatenating S with the revealed M1, "
        "hashing the result, and comparing it to the original M2.\n"
        "This approach ensures that even if M2 is intercepted, an attacker cannot derive M1 without the salt. Moreover, the use of a secure hash "
        "function like SHA-256 resists preimage attacks, collision attacks, and brute force due to its complexity."
    )

    # Generate and print the AI's response
    response_text = gen_chat(user_input)
    print(response_text)
