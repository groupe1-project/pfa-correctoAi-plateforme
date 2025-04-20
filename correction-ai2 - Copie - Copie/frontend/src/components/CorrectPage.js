import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FiUpload, FiFile, FiX } from 'react-icons/fi';
import '../CommonPage.css';

const CorrectPage = () => {
    const [text, setText] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                'http://localhost:8080/api/text/correct', 
                { text }, 
                { headers: { 'Content-Type': 'application/json' } }
            );
            setResult(response.data);
        } catch (error) {
            console.error('Erreur:', error);
            setResult("Erreur lors de la correction");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const removeFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) return;
        setLoading(true);
    
        const formData = new FormData();
        formData.append("file", file);
    
        try {
            const response = await axios.post(
                'http://localhost:8080/api/text/correct-docx',
                formData,
                { responseType: 'blob' }
            );
    
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'corrected_' + file.name);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Erreur:', error);
            alert("Erreur lors de la correction du document");
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="page-container">
            <h2>Correction de texte</h2>

            <div className="text-columns">
                <div className="text-column">
                    <div className="text-header">Texte à corriger</div>
                    <textarea
                        className="text-area"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Écrivez ou collez votre texte ici"
                    />
                    <div className="action-bar">
                        <button 
                            className="action-button" 
                            onClick={handleSubmit} 
                            disabled={loading || !text.trim()}
                        >
                            {loading ? 'Correction en cours...' : 'Corriger'}
                        </button>
                    </div>
                </div>

                <div className="text-column">
                    <div className="text-header">Texte corrigé</div>
                    <textarea
                        className="text-area"
                        value={result}
                        readOnly
                        placeholder="Correction apparaîtra ici"
                    />
                    {result && (
                        <div className="action-bar">
                            <button 
                                className="action-button"
                                onClick={() => navigator.clipboard.writeText(result)}
                            >
                                Copier le texte
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="file-upload-section">
                <h3>Corriger un document</h3>
                
                <div 
                    className={`file-upload-card ${dragActive ? 'active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                >
                    <FiUpload className="file-upload-icon" />
                    <div className="file-upload-text">
                        <h4>Glissez-déposez votre fichier ici</h4>
                        <p>ou cliquez pour sélectionner un fichier</p>
                    </div>
                    <button className="file-upload-button">
                        Sélectionner un fichier
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        className="file-input" 
                        accept=".docx,.pdf,.txt" 
                        onChange={handleFileChange}
                    />
                    <p className="supported-formats">
                        Formats supportés: DOCX, PDF, TXT
                    </p>
                </div>

                {file && (
                    <div className="file-info">
                        <div className="file-name">
                            <FiFile /> {file.name}
                        </div>
                        <FiX className="file-remove" onClick={removeFile} />
                    </div>
                )}

                <div className="action-bar" style={{ marginTop: '15px' }}>
                    <button 
                        className="action-button" 
                        onClick={handleFileUpload} 
                        disabled={loading || !file}
                    >
                        {loading ? 'Correction en cours...' : 'Corriger le document'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CorrectPage;
