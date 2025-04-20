import React, { useState } from 'react';
import '../RewritePage.css';

const RewritePage = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [style, setStyle] = useState('formel');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const styleOptions = [
        { value: 'formel', label: 'Style Formel' },
        { value: 'informel', label: 'Style Informel' },
        { value: 'académique', label: 'Style Académique' },
        { value: 'clair', label: 'Version Simplifiée' },
        { value: 'fluent', label: 'Amélioration de Fluidité' },
        { value: 'traduction_en', label: 'Traduction Anglaise' },
        { value: 'traduction_es', label: 'Traduction Espagnole' },
        { value: 'traduction_ar', label: 'Traduction Arabe' }
    ];

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
                body: JSON.stringify({ 
                    text: input, 
                    style 
                }),
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
        <div className="rewrite-container">
            <h1>Reformulation de Texte</h1>
            
            <div className="controls">
                <div className="style-selection">
                    <label htmlFor="style-select">Style de reformulation :</label>
                    <select
                        id="style-select"
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
                        disabled={isLoading}
                    >
                        {styleOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="text-areas">
                    <div className="text-area">
                        <h2>Texte Original</h2>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Saisissez votre texte ici..."
                            disabled={isLoading}
                        />
                    </div>

                    <div className="text-area">
                        <h2>Résultat</h2>
                        <textarea
                            value={output}
                            readOnly
                            placeholder="Le texte reformulé apparaîtra ici..."
                            className={isLoading ? 'loading' : ''}
                        />
                    </div>
                </div>

                <button 
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading || !input.trim()}
                    className="submit-button"
                >
                    {isLoading ? (
                        <>
                            <span className="spinner"></span>
                            Traitement en cours...
                        </>
                    ) : (
                        'Reformuler le Texte'
                    )}
                </button>
            </div>
        </div>
    );
};

export default RewritePage;