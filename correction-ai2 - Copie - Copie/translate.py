import sys
import google.generativeai as genai
from huggingface_hub import login
login(token="mon token") 

def translate(text, source_lang, target_lang):
    # Configurez votre clé API Gemini
    genai.configure(api_key="mon api")  
    
    # Initialisez le modèle Gemini
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    # Créez le prompt de traduction
    prompt = f"Traduisez ce texte du {source_lang} au {target_lang}: {text}"
    
    # Envoyez la requête
    response = model.generate_content(prompt)
    
    return response.text

if __name__ == "__main__":
    text = sys.argv[1]
    source_lang = sys.argv[2]
    target_lang = sys.argv[3]
    
    print(translate(text, source_lang, target_lang))