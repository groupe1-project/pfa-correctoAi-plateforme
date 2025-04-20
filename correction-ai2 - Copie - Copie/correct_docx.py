import sys
import os
import docx
import traceback
import google.generativeai as genai

def log_error(message):
    print(f"PYTHON ERROR: {message}", file=sys.stderr)
    sys.stderr.flush()

# Configurez Gemini une seule fois au début
genai.configure(api_key="mon api")  
model = genai.GenerativeModel('gemini-1.5-flash')

def correct_text(text, lang):
    """Utilise Gemini pour corriger le texte"""
    prompt = f"""Corrigez ce texte en {lang}. Retournez UNIQUEMENT le texte corrigé sans commentaires.
    Texte à corriger: {text}"""
    
    response = model.generate_content(prompt)
    return response.text

try:
    if len(sys.argv) < 2:
        log_error("Usage: python correct_docx.py <input_file> [lang]")
        sys.exit(1)

    input_path = sys.argv[1]
    lang = sys.argv[2] if len(sys.argv) > 2 else "fr"  # Français par défaut
    
    if not os.path.exists(input_path):
        log_error(f"Fichier introuvable: {input_path}")
        sys.exit(1)

    # Traitement selon l'extension
    if input_path.lower().endswith('.docx'):
        doc = docx.Document(input_path)
        for paragraph in doc.paragraphs:
            if paragraph.text.strip():
                try:
                    corrected = correct_text(paragraph.text, lang)
                    paragraph.text = corrected
                except Exception as e:
                    log_error(f"Erreur correction paragraphe: {str(e)}")
                    continue
        
        output_path = os.path.join(
            os.path.dirname(input_path),
            f"corrected_{os.path.basename(input_path)}"
        )
        doc.save(output_path)

    elif input_path.lower().endswith('.txt'):
        with open(input_path, 'r', encoding='utf-8') as f:
            text = f.read()
        
        corrected = correct_text(text, lang)
        
        output_path = os.path.join(
            os.path.dirname(input_path),
            f"corrected_{os.path.basename(input_path)}"
        )
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(corrected)

    else:
        log_error("Format non supporté. Seuls .docx et .txt sont acceptés")
        sys.exit(1)

    print(output_path)
    sys.exit(0)

except Exception as e:
    log_error(f"{str(e)}\n{traceback.format_exc()}")
    sys.exit(1)