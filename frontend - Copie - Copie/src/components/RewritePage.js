import React, { useState } from 'react';
import { FiGlobe, FiEdit2, FiArrowRight, FiAlertCircle, FiCheck, FiLoader, FiChevronDown } from 'react-icons/fi';
import '../CommonPage.css';

const RewritePage = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [lang, setLang] = useState('fr');
    const [style, setStyle] = useState('formel');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const languageOptions = [
        { value: 'fr', label: 'Français', icon: '🇫🇷' },
        { value: 'en', label: 'English', icon: '🇬🇧' },
        { value: 'es', label: 'Español', icon: '🇪🇸' },
        { value: 'ar', label: 'العربية', icon: '🇸🇦' }
    ];

    const getStyleOptions = () => {
        switch (lang) {
            case 'fr':
                return [
                    { value: 'formel', label: 'Formel', icon: <FiCheck /> },
                    { value: 'informel', label: 'Informel', icon: <FiCheck /> },
                    { value: 'académique', label: 'Académique', icon: <FiCheck /> },
                    { value: 'clair', label: 'Simplifié', icon: <FiCheck /> },
                    { value: 'fluent', label: 'Fluide', icon: <FiCheck /> },
                    { value: 'translate_en', label: '→ Anglais', icon: <FiArrowRight /> },
                    { value: 'translate_es', label: '→ Espagnol', icon: <FiArrowRight /> },
                    { value: 'translate_ar', label: '→ Arabe', icon: <FiArrowRight /> }
                ];
            case 'en':
                return [
                    { value: 'formal', label: 'Formal', icon: <FiCheck /> },
                    { value: 'informal', label: 'Informal', icon: <FiCheck /> },
                    { value: 'academic', label: 'Academic', icon: <FiCheck /> },
                    { value: 'simple', label: 'Simplified', icon: <FiCheck /> },
                    { value: 'fluent', label: 'Fluent', icon: <FiCheck /> },
                    { value: 'translate_fr', label: '→ French', icon: <FiArrowRight /> },
                    { value: 'translate_es', label: '→ Spanish', icon: <FiArrowRight /> },
                    { value: 'translate_ar', label: '→ Arabic', icon: <FiArrowRight /> }
                ];
            case 'es':
                return [
                    { value: 'formal', label: 'Formal', icon: <FiCheck /> },
                    { value: 'informal', label: 'Informal', icon: <FiCheck /> },
                    { value: 'académico', label: 'Académico', icon: <FiCheck /> },
                    { value: 'simple', label: 'Simplificado', icon: <FiCheck /> },
                    { value: 'fluido', label: 'Fluido', icon: <FiCheck /> },
                    { value: 'translate_fr', label: '→ Francés', icon: <FiArrowRight /> },
                    { value: 'translate_en', label: '→ Inglés', icon: <FiArrowRight /> },
                    { value: 'translate_ar', label: '→ Árabe', icon: <FiArrowRight /> }
                ];
            case 'ar':
                return [
                    { value: 'formal', label: 'رسمي', icon: <FiCheck /> },
                    { value: 'informal', label: 'عامي', icon: <FiCheck /> },
                    { value: 'academic', label: 'أكاديمي', icon: <FiCheck /> },
                    { value: 'simple', label: 'مبسط', icon: <FiCheck /> },
                    { value: 'fluent', label: 'فصيح', icon: <FiCheck /> },
                    { value: 'translate_fr', label: '→ فرنسي', icon: <FiArrowRight /> },
                    { value: 'translate_en', label: '→ إنجليزي', icon: <FiArrowRight /> },
                    { value: 'translate_es', label: '→ إسباني', icon: <FiArrowRight /> }
                ];
            default:
                return [];
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) {
            setError('Veuillez entrer un texte à reformuler');
            return;
        }

        setIsLoading(true);
        setError('');
        setOutput('');

        try {
            const response = await fetch('http://localhost:8080/api/text/rewrite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: input, lang, style }),
            });

            if (!response.ok) {
                throw new Error('Erreur serveur');
            }

            const result = await response.text();
            setOutput(result);
        } catch (err) {
            setError('Une erreur est survenue lors de la reformulation');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="translation-header">
                <h1 className="page-title">Reformulation Intelligente de Texte</h1>
                <div className="selector-container">
                    <div className="custom-select-wrapper">
                        <FiGlobe className="selector-icon" />
                        <select 
                            className="custom-select"
                            value={lang} 
                            onChange={(e) => {
                                setLang(e.target.value);
                                const newStyles = getStyleOptions();
                                if (newStyles.length > 0) setStyle(newStyles[0].value);
                            }} 
                            disabled={isLoading}
                        >
                            {languageOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.icon} {option.label}
                                </option>
                            ))}
                        </select>
                        <FiChevronDown className="selector-arrow" />
                    </div>

                    <div className="custom-select-wrapper">
                        <FiEdit2 className="selector-icon" />
                        <select 
                            className="custom-select"
                            value={style} 
                            onChange={(e) => setStyle(e.target.value)} 
                            disabled={isLoading}
                        >
                            {getStyleOptions().map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.icon} {option.label}
                                </option>
                            ))}
                        </select>
                        <FiChevronDown className="selector-arrow" />
                    </div>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    <FiAlertCircle /> {error}
                </div>
            )}

            <div className="text-columns">
                <div className="text-column">
                    <div className="text-header">Texte Original</div>
                    <textarea
                        className="text-area"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Entrez votre texte ici..."
                        disabled={isLoading}
                    />
                </div>

                <div className="text-column">
                    <div className="text-header">Résultat</div>
                    <textarea
                        className="text-area"
                        value={output}
                        readOnly
                        placeholder="Texte reformulé ici..."
                    />
                </div>
            </div>

            <button 
                className="submit-button"
                onClick={handleSubmit}
                disabled={isLoading || !input.trim()}
            >
                {isLoading ? (
                    <>
                        <FiLoader className="spinner" />
                        En cours...
                    </>
                ) : (
                    <>
                        <FiEdit2 /> Reformuler
                    </>
                )}
            </button>
        </div>
    );
};

export default RewritePage;