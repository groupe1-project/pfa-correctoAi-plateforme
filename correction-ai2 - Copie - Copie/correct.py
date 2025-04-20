import sys
from google.generativeai import configure, GenerativeModel
from huggingface_hub import login
login(token="mon token") 


configure(api_key="mon api key")  

model = GenerativeModel('gemini-1.5-flash')

def correct_and_explain(text, lang):
    try:
        if not text.strip():
            return "Aucun texte à corriger."
        
        language_map = {
            'fr': 'français',
            'en': 'anglais',
            'es': 'espagnol',
            'ar': 'arabe'
        }
        
        prompt = f"""
        Corrigez cette phrase en {language_map.get(lang, 'français')} et listez les erreurs avec explications :
        "{text}"
        
        Format de réponse STRICTEMENT à respecter :
        [CORRIGÉ]: [phrase corrigée sans guillemets]
        [EXPLICATIONS]:
        1. [type d'erreur]: [explication]
        2. [type d'erreur]: [explication]
        """
        
        response = model.generate_content(prompt)
        return format_output(response.text)
        
    except Exception as e:
        return f"Erreur: {str(e)}"

def format_output(response_text):
    """Formate la sortie selon le style demandé"""
    lines = response_text.split('\n')
    corrected = ""
    explanations = []
    
    for line in lines:
        if line.startswith('[CORRIGÉ]:'):
            corrected = line.replace('[CORRIGÉ]:', '').strip()
        elif line.strip().startswith('1.') or line.strip().startswith('2.'):
            explanations.append(line.strip())
    
    # Construction de la sortie formatée
    output = f"{corrected}\n\nExplication :"
    for exp in explanations:
        output += f"\n{exp}"
    
    return output

if __name__ == "__main__":
    try:
        text = sys.argv[1]
        lang = sys.argv[2] if len(sys.argv) > 2 else 'fr'
        print(correct_and_explain(text, lang))
    except Exception as e:
        print(f"Erreur système: {str(e)}", file=sys.stderr)
        sys.exit(1)


        
