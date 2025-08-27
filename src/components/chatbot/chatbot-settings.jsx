import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import styles from './chatbot-settings.css';
import { geminiService } from './gemini-service.js';

const ChatbotSettings = ({ onClose }) => {
    const [apiKey, setApiKey] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [validationMessage, setValidationMessage] = useState('');

    useEffect(() => {
        // Load saved API key from localStorage
        const savedApiKey = localStorage.getItem('gemini_api_key');
        if (savedApiKey) {
            setApiKey(savedApiKey);
            geminiService.setApiKey(savedApiKey);
        }
    }, []);

    const handleSave = async () => {
        if (!apiKey.trim()) {
            setValidationMessage('Please enter a valid API key');
            return;
        }

        setIsValidating(true);
        setValidationMessage('');

        try {
            // Test the API key with a simple request
            geminiService.setApiKey(apiKey);
            const testResponse = await geminiService.generateResponse('Hello');
            
            if (testResponse) {
                // Save to localStorage
                localStorage.setItem('gemini_api_key', apiKey);
                setValidationMessage('API key saved successfully!');
                
                // Clear message after 3 seconds
                const timer = setTimeout(() => {
                    setValidationMessage('');
                    onClose();
                }, 3000);
                
                // Cleanup timer if component unmounts
                return () => clearTimeout(timer);
            } else {
                setValidationMessage('Invalid API key. Please check and try again.');
            }
        } catch (error) {
            console.error('API key validation error:', error);
            setValidationMessage('Failed to validate API key. Please check your key and try again.');
        } finally {
            setIsValidating(false);
        }
    };

    const handleClear = () => {
        setApiKey('');
        localStorage.removeItem('gemini_api_key');
        geminiService.setApiKey('');
        setValidationMessage('API key cleared');
        
        const timer = setTimeout(() => {
            setValidationMessage('');
        }, 3000);
        
        // Cleanup timer if component unmounts
        return () => clearTimeout(timer);
    };

    return (
        <div className={styles.settingsOverlay}>
            <div className={styles.settingsModal}>
                <div className={styles.settingsHeader}>
                    <h3>
                        <FormattedMessage
                            defaultMessage="Chatbot Settings"
                            description="Title for chatbot settings modal"
                            id="gui.chatbot.settings.title"
                        />
                    </h3>
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                        title="Close settings"
                    >
                        ✖
                    </button>
                </div>

                <div className={styles.settingsContent}>
                    <div className={styles.settingGroup}>
                        <label className={styles.settingLabel}>
                            <FormattedMessage
                                defaultMessage="Gemini API Key"
                                description="Label for Gemini API key input"
                                id="gui.chatbot.settings.apiKey"
                            />
                        </label>
                        <div className={styles.apiKeyContainer}>
                            <input
                                type="password"
                                className={styles.apiKeyInput}
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Enter your Gemini API key"
                                disabled={isValidating}
                            />
                            <button
                                className={styles.toggleVisibility}
                                onClick={() => {
                                    const input = document.querySelector(`.${styles.apiKeyInput}`);
                                    input.type = input.type === 'password' ? 'text' : 'password';
                                }}
                                type="button"
                            >
                                👁️
                            </button>
                        </div>
                        <p className={styles.settingDescription}>
                            <FormattedMessage
                                defaultMessage="Get your API key from Google AI Studio. The chatbot will use Gemini 2.0 Flash-Lite for intelligent responses."
                                description="Description for API key setting"
                                id="gui.chatbot.settings.apiKeyDescription"
                            />
                        </p>
                        <a
                            href="https://aistudio.google.com/app/apikey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.apiKeyLink}
                        >
                            <FormattedMessage
                                defaultMessage="Get API Key from Google AI Studio"
                                description="Link to get API key"
                                id="gui.chatbot.settings.getApiKey"
                            />
                        </a>
                    </div>

                    {validationMessage && (
                        <div className={`${styles.validationMessage} ${validationMessage.includes('success') ? styles.success : styles.error}`}>
                            {validationMessage}
                        </div>
                    )}

                    <div className={styles.settingsActions}>
                        <button
                            className={styles.saveButton}
                            onClick={handleSave}
                            disabled={isValidating || !apiKey.trim()}
                        >
                            {isValidating ? (
                                <FormattedMessage
                                    defaultMessage="Validating..."
                                    description="Button text while validating"
                                    id="gui.chatbot.settings.validating"
                                />
                            ) : (
                                <FormattedMessage
                                    defaultMessage="Save"
                                    description="Save button text"
                                    id="gui.chatbot.settings.save"
                                />
                            )}
                        </button>
                        <button
                            className={styles.clearButton}
                            onClick={handleClear}
                            disabled={isValidating}
                        >
                            <FormattedMessage
                                defaultMessage="Clear"
                                description="Clear button text"
                                id="gui.chatbot.settings.clear"
                            />
                        </button>
                        <button
                            className={styles.cancelButton}
                            onClick={onClose}
                            disabled={isValidating}
                        >
                            <FormattedMessage
                                defaultMessage="Cancel"
                                description="Cancel button text"
                                id="gui.chatbot.settings.cancel"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

ChatbotSettings.propTypes = {
    onClose: PropTypes.func.isRequired
};

export default ChatbotSettings;
