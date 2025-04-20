import React, { useState } from 'react';
import { FiRepeat } from 'react-icons/fi';
import '../CommonPage.css';

const TranslatePage = () => {
    const [inputText, setInputText] = useState('');
    const [sourceLang, setSourceLang] = useState('fr');
    const [targetLang, setTargetLang] = useState('en');
    const [translatedText, setTranslatedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSourceDropdown, setShowSourceDropdown] = useState(false);
    const [showTargetDropdown, setShowTargetDropdown] = useState(false);

    const languages = [
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'en', name: 'Anglais', flag: '🇬🇧' },
        { code: 'es', name: 'Espagnol', flag: '🇪🇸' },
        { code: 'de', name: 'Allemand', flag: '🇩🇪' },
        { code: 'it', name: 'Italien', flag: '🇮🇹' },
        { code: 'ar', name: 'Arabe', flag: '🇸🇦' }
    ];

    const handleTranslate = async () => {
        if (!inputText.trim()) return;
        
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/text/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: inputText,
                    sourceLang,
                    targetLang
                }),
            });

            if (!response.ok) throw new Error('Erreur réseau');
            const data = await response.text();
            setTranslatedText(data);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const switchLanguages = () => {
        setSourceLang(targetLang);
        setTargetLang(sourceLang);
        setInputText(translatedText);
        setTranslatedText(inputText);
    };

    const selectLanguage = (code, isSource) => {
        if (isSource) {
            setSourceLang(code);
            setShowSourceDropdown(false);
        } else {
            setTargetLang(code);
            setShowTargetDropdown(false);
        }
    };

    return (
        <div className="page-container">
            <h2>Traduction</h2>
            
            {/* Nouveau sélecteur de langues centré avec drapeaux */}
            <div className="language-selector-wrapper">
                <div className="language-selector-reverso">
                    <div 
                        className={`language-display ${showSourceDropdown ? 'active' : ''}`}
                        onClick={() => {
                            setShowSourceDropdown(!showSourceDropdown);
                            setShowTargetDropdown(false);
                        }}
                    >
                        <span className="language-flag">
                            {languages.find(l => l.code === sourceLang)?.flag}
                        </span>
                        <span className="language-name">
                            {languages.find(l => l.code === sourceLang)?.name}
                        </span>
                    </div>
                    
                    <button className="language-switch-btn" onClick={switchLanguages}>
                        <FiRepeat className="switch-icon" />
                    </button>
                    
                    <div 
                        className={`language-display ${showTargetDropdown ? 'active' : ''}`}
                        onClick={() => {
                            setShowTargetDropdown(!showTargetDropdown);
                            setShowSourceDropdown(false);
                        }}
                    >
                        <span className="language-flag">
                            {languages.find(l => l.code === targetLang)?.flag}
                        </span>
                        <span className="language-name">
                            {languages.find(l => l.code === targetLang)?.name}
                        </span>
                    </div>
                </div>
                
                {/* Dropdown pour la langue source */}
                {showSourceDropdown && (
                    <div className="language-dropdown">
                        {languages.map(lang => (
                            <div 
                                key={`src-${lang.code}`}
                                className="language-option"
                                onClick={() => selectLanguage(lang.code, true)}
                            >
                                <span className="language-flag">{lang.flag}</span>
                                <span className="language-name">{lang.name}</span>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Dropdown pour la langue cible */}
                {showTargetDropdown && (
                    <div className="language-dropdown right">
                        {languages.map(lang => (
                            <div 
                                key={`tgt-${lang.code}`}
                                className="language-option"
                                onClick={() => selectLanguage(lang.code, false)}
                            >
                                <span className="language-flag">{lang.flag}</span>
                                <span className="language-name">{lang.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="text-columns">
                <div className="text-column">
                    <div className="text-header">
                        {languages.find(l => l.code === sourceLang)?.name}
                    </div>
                    <div className="text-area-container">
                        <textarea
                            className="text-area"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Écrivez ou collez votre texte ici"
                        />
                    </div>
                    <div className="action-bar">
                        <p className="hint-text">Traduction automatique</p>
                        <button 
                            className="action-button" 
                            onClick={handleTranslate} 
                            disabled={loading || !inputText.trim()}
                        >
                            {loading ? 'Traduction en cours...' : 'Traduire'}
                        </button>
                    </div>
                </div>

                <div className="text-column">
                    <div className="text-header">
                        {languages.find(l => l.code === targetLang)?.name}
                    </div>
                    <div className="text-area-container">
                        <textarea
                            className="text-area"
                            value={translatedText}
                            readOnly
                            placeholder="Traduction apparaîtra ici"
                        />
                    </div>
                    <div className="action-bar">
                        <p className="hint-text">Traduction instantanée</p>
                        <div className="character-count">
                            {translatedText.length} caractères
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TranslatePage;