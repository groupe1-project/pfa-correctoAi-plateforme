import google.generativeai as genai
import sys
from huggingface_hub import login
login(token="mon token") 

genai.configure(api_key="mon api")  
model = genai.GenerativeModel("gemini-1.5-flash")

# Instructions par langue et style
style_instructions = {
    "fr": {
        "formel": "Réécris ce texte en français formel :",
        "informel": "Réécris ce texte en français familier :",
        "académique": "Réécris ce texte en style académique français :",
        "clair": "Simplifie ce texte en français pour qu'il soit plus clair :",
        "fluent": "Améliore la fluidité de ce texte en français :"
    },
    "en": {
        "formal": "Rewrite this text in formal English:",
        "informal": "Rewrite this text in informal English:",
        "academic": "Rewrite this text in academic English style:",
        "simple": "Simplify this English text to make it clearer:",
        "fluent": "Improve the fluency of this English text:"
    },
    "es": {
        "formal": "Reescribe este texto en español formal:",
        "informal": "Reescribe este texto en español informal:",
        "académico": "Reescribe este texto en estilo académico español:",
        "simple": "Simplifica este texto en español para que sea más claro:",
        "fluido": "Mejora la fluidez de este texto en español:"
    },
    "ar": {
        "formal": "أعد كتابة هذا النص باللغة العربية الفصحى:",
        "informal": "أعد كتابة هذا النص باللغة العربية العامية:",
        "academic": "أعد كتابة هذا النص بأسلوب أكاديمي عربي:",
        "simple": "بسّط هذا النص العربي ليكون أكثر وضوحًا:",
        "fluent": "حسّن سلاسة هذا النص العربي:"
    },
    "traduction": {
        "en": "Traduis ce texte en anglais :",
        "es": "Traduis ce texte en espagnol :",
        "ar": "Traduis ce texte en arabe :",
        "fr": "Traduis ce texte en français :"
    }
}

def rewrite(text, lang, style):
    # Cas particulier pour la traduction
    if style.startswith("translate_"):
        target_lang = style.split("_")[1]
        if target_lang not in style_instructions["traduction"]:
            return f"Langue de traduction non supportée. Choisissez parmi : {', '.join(style_instructions['traduction'].keys())}"
        
        prompt = f"{style_instructions['traduction'][target_lang]} {text}"
    else:
        if lang not in style_instructions:
            return f"Langue non supportée. Choisissez parmi : {', '.join([k for k in style_instructions.keys() if k != 'traduction'])}"
        
        if style not in style_instructions[lang]:
            return f"Style inconnu pour cette langue. Choisissez parmi : {', '.join(style_instructions[lang].keys())}"
        
        prompt = f"{style_instructions[lang][style]} {text}"

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Erreur : {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage : python rewrite.py \"texte à traiter\" \"langue\" \"style\"")
        print("Langues disponibles : fr, en, es, ar")
        print("Styles disponibles par langue :")
        for lang, styles in style_instructions.items():
            if lang != "traduction":
                print(f"  - {lang}: {', '.join(styles.keys())}")
        print("Traductions disponibles : translate_en, translate_es, translate_ar, translate_fr")
        sys.exit(1)

    text = sys.argv[1]
    lang = sys.argv[2].lower()
    style = sys.argv[3].lower()

    result = rewrite(text, lang, style)
    print(result)