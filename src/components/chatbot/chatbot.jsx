import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import styles from './chatbot.css';
import { addBlockToWorkspace, addStackToWorkspace } from './block-generator.js';
import ToastNotification from './toast-notification.jsx';
import { GeminiService } from './gemini-service.js';
import ChatbotSettings from './chatbot-settings.jsx';
import ScratchBlocksRenderer from './scratchblocks-renderer.jsx';
import RealScratchBlocksRenderer from './real-scratchblocks-renderer.jsx';
import TestRenderer from './test-renderer.jsx';

const Chatbot = ({ vm, onRequestClose }) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [currentConversationId, setCurrentConversationId] = useState(null);
    const [showConversationMenu, setShowConversationMenu] = useState(false);
    const [useRealBlocks, setUseRealBlocks] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const geminiService = useRef(new GeminiService());

    // Load conversations from localStorage on component mount
    useEffect(() => {
        const savedConversations = localStorage.getItem('scratch-chatbot-conversations');
        if (savedConversations) {
            const parsed = JSON.parse(savedConversations);
            setConversations(parsed);
            
            // Load the most recent conversation
            if (parsed.length > 0) {
                const mostRecent = parsed[parsed.length - 1];
                setCurrentConversationId(mostRecent.id);
                setMessages(mostRecent.messages);
            }
        } else {
            // Create initial conversation
            createNewConversation();
        }

        // Load API key if available
        const apiKey = localStorage.getItem('gemini-api-key');
        if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY') {
            geminiService.current.setApiKey(apiKey);
        }
    }, []);

    // Save conversations to localStorage whenever they change
    useEffect(() => {
        if (conversations.length > 0) {
            localStorage.setItem('scratch-chatbot-conversations', JSON.stringify(conversations));
        }
    }, [conversations]);

    // Save current conversation whenever messages change
    useEffect(() => {
        if (currentConversationId && messages.length > 0) {
            updateConversation(currentConversationId, messages);
        }
    }, [messages, currentConversationId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const createNewConversation = () => {
        const newId = Date.now().toString();
        const newConversation = {
            id: newId,
            title: `Conversation ${conversations.length + 1}`,
            messages: [],
            createdAt: new Date().toISOString()
        };
        
        setConversations(prev => [...prev, newConversation]);
        setCurrentConversationId(newId);
        setMessages([]);
        setShowConversationMenu(false);
    };

    const loadConversation = (conversationId) => {
        const conversation = conversations.find(c => c.id === conversationId);
        if (conversation) {
            setCurrentConversationId(conversationId);
            setMessages(conversation.messages);
            setShowConversationMenu(false);
        }
    };

    const deleteConversation = (conversationId) => {
        const updatedConversations = conversations.filter(c => c.id !== conversationId);
        setConversations(updatedConversations);
        
        // If we deleted the current conversation, load the most recent one
        if (conversationId === currentConversationId) {
            if (updatedConversations.length > 0) {
                const mostRecent = updatedConversations[updatedConversations.length - 1];
                setCurrentConversationId(mostRecent.id);
                setMessages(mostRecent.messages);
            } else {
                createNewConversation();
            }
        }
    };

    const updateConversation = (conversationId, newMessages) => {
        setConversations(prev => prev.map(conv => 
            conv.id === conversationId 
                ? { ...conv, messages: newMessages, updatedAt: new Date().toISOString() }
                : conv
        ));
    };

    const updateConversationTitle = (conversationId, title) => {
        setConversations(prev => prev.map(conv => 
            conv.id === conversationId 
                ? { ...conv, title }
                : conv
        ));
    };

    // Get bot response using Gemini AI or fallback
    const getBotResponse = async (userMessage) => {
        try {
            // Check if we have a valid API key
            const apiKey = localStorage.getItem('gemini-api-key');
            if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
                console.log('No valid API key found, using fallback responses');
                return getFallbackResponse(userMessage);
            }

            // Try to use Gemini AI first
            const response = await geminiService.current.generateResponse(userMessage);
            console.log('Gemini API response:', response);
            return response;
        } catch (error) {
            console.error('Error getting AI response:', error);
            // Fallback to local responses
            return getFallbackResponse(userMessage);
        }
    };

    // Fallback responses when AI is not available
    const getFallbackResponse = (userMessage) => {
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('move') || lowerMessage.includes('walk')) {
            return {
                type: 'bot',
                content: 'To make a sprite move, you can use these blocks:',
                codeBlocks: [
                    {
                        name: 'Move 10 steps',
                        code: 'move 10 steps',
                        category: 'motion',
                        opcode: 'motion_movesteps'
                    },
                    {
                        name: 'Go to x: 0 y: 0',
                        code: 'go to x: 0 y: 0',
                        category: 'motion',
                        opcode: 'motion_gotoxy'
                    },
                    {
                        name: 'Glide 1 secs to x: 0 y: 0',
                        code: 'glide 1 secs to x: 0 y: 0',
                        category: 'motion',
                        opcode: 'motion_glideto'
                    }
                ]
            };
        } else if (lowerMessage.includes('sound') || lowerMessage.includes('play')) {
            return {
                type: 'bot',
                content: 'To add sound to your project, use these blocks:',
                codeBlocks: [
                    {
                        name: 'Play sound until done',
                        code: 'play sound until done',
                        category: 'sound'
                    },
                    {
                        name: 'Start sound',
                        code: 'start sound',
                        category: 'sound'
                    },
                    {
                        name: 'Change pitch by 10',
                        code: 'change pitch by 10',
                        category: 'sound'
                    }
                ]
            };
        } else if (lowerMessage.includes('loop') || lowerMessage.includes('repeat')) {
            return {
                type: 'bot',
                content: 'To create loops in Scratch, use these control blocks:',
                codeBlocks: [
                    {
                        name: 'Repeat 10',
                        code: 'repeat 10\n  move 10 steps\nend',
                        category: 'control'
                    },
                    {
                        name: 'Forever',
                        code: 'forever\n  move 10 steps\nend',
                        category: 'control'
                    },
                    {
                        name: 'Repeat until',
                        code: 'repeat until <touching [edge v]?>\n  move 10 steps\nend',
                        category: 'control'
                    }
                ]
            };
        } else if (lowerMessage.includes('variable') || lowerMessage.includes('score')) {
            return {
                type: 'bot',
                content: 'To use variables in your project:',
                codeBlocks: [
                    {
                        name: 'Set score to 0',
                        code: 'set [score v] to [0]',
                        category: 'variables'
                    },
                    {
                        name: 'Change score by 1',
                        code: 'change [score v] by [1]',
                        category: 'variables'
                    },
                    {
                        name: 'Show variable',
                        code: 'show variable [score v]',
                        category: 'variables'
                    }
                ]
            };
        } else if (lowerMessage.includes('sprite') || lowerMessage.includes('character')) {
            return {
                type: 'bot',
                content: 'To work with sprites:',
                codeBlocks: [
                    {
                        name: 'Switch costume',
                        code: 'switch costume to [costume1 v]',
                        category: 'looks'
                    },
                    {
                        name: 'Next costume',
                        code: 'next costume',
                        category: 'looks'
                    },
                    {
                        name: 'Hide sprite',
                        code: 'hide',
                        category: 'looks'
                    },
                    {
                        name: 'Show sprite',
                        code: 'show',
                        category: 'looks'
                    }
                ]
            };
        } else if (lowerMessage.includes('script') || lowerMessage.includes('template')) {
            return {
                type: 'bot',
                content: 'Here are some useful script templates you can use:',
                codeBlocks: [
                    {
                        name: 'Simple Movement Script',
                        code: 'when green flag clicked\nforever\n  move 10 steps\n  if on edge, bounce\nend',
                        category: 'script',
                        isScript: true
                    },
                    {
                        name: 'Sprite Interaction Script',
                        code: 'when green flag clicked\nforever\n  if touching mouse pointer? then\n    say Hello for 2 secs\n  end\nend',
                        category: 'script',
                        isScript: true
                    },
                    {
                        name: 'Score Counter Script',
                        code: 'when green flag clicked\nset score to 0\nforever\n  if touching mouse pointer? then\n    change score by 1\n    wait 1 secs\n  end\nend',
                        category: 'script',
                        isScript: true
                    },
                    {
                        name: 'Costume Animation Script',
                        code: 'when green flag clicked\nforever\n  next costume\n  wait 0.5 secs\nend',
                        category: 'script',
                        isScript: true
                    }
                ]
            };
        } else if (lowerMessage.includes('balloon') || lowerMessage.includes('pop') || lowerMessage.includes('game')) {
            return {
                type: 'bot',
                content: 'Here\'s how to create a balloon pop game in Scratch! You\'ll need several sprites and scripts:',
                stacks: [
                    {
                        name: 'Main Game Loop',
                        blocks: [
                            {
                                name: 'When green flag clicked',
                                code: 'when green flag clicked',
                                category: 'events',
                                opcode: 'event_whenflagclicked'
                            },
                            {
                                name: 'Set score to 0',
                                code: 'set score to 0',
                                category: 'variables',
                                opcode: 'data_setvariableto'
                            },
                            {
                                name: 'Forever loop',
                                code: 'forever',
                                category: 'control',
                                opcode: 'control_forever'
                            },
                            {
                                name: 'Create clone of balloon',
                                code: 'create clone of [balloon v]',
                                category: 'control',
                                opcode: 'control_create_clone_of'
                            },
                            {
                                name: 'Wait 2 seconds',
                                code: 'wait 2 secs',
                                category: 'control',
                                opcode: 'control_wait'
                            }
                        ]
                    },
                    {
                        name: 'Clone Setup',
                        blocks: [
                            {
                                name: 'When this sprite starts as a clone',
                                code: 'when I start as a clone',
                                category: 'events',
                                opcode: 'control_start_as_clone'
                            },
                            {
                                name: 'Go to random position',
                                code: 'go to random position',
                                category: 'motion',
                                opcode: 'motion_goto'
                            },
                            {
                                name: 'Show',
                                code: 'show',
                                category: 'looks',
                                opcode: 'looks_show'
                            }
                        ]
                    },
                    {
                        name: 'Balloon Click Handler',
                        blocks: [
                            {
                                name: 'When this sprite clicked',
                                code: 'when this sprite clicked',
                                category: 'events',
                                opcode: 'event_whenthisspriteclicked'
                            },
                            {
                                name: 'Change score by 1',
                                code: 'change score by 1',
                                category: 'variables',
                                opcode: 'data_changevariableby'
                            },
                            {
                                name: 'Play pop sound',
                                code: 'play sound [pop v] until done',
                                category: 'sound',
                                opcode: 'sound_playuntildone'
                            },
                            {
                                name: 'Delete this clone',
                                code: 'delete this clone',
                                category: 'control',
                                opcode: 'control_delete_this_clone'
                            }
                        ]
                    }
                ]
            };
        } else {
            return {
                type: 'bot',
                content: 'I can help you with many Scratch programming concepts! Try asking about:\n• How to make sprites move\n• How to add sound\n• How to create loops\n• How to use variables\n• How to work with sprites\n• How to detect collisions\n• How to create games\n• Script templates\n\nWhat would you like to learn about?'
            };
        }
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: inputValue,
            timestamp: new Date().toLocaleTimeString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        // Get AI response
        try {
            const botResponse = await getBotResponse(inputValue);
            const botMessage = {
                id: Date.now() + 1,
                ...botResponse,
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error getting bot response:', error);
            const errorMessage = {
                id: Date.now() + 1,
                type: 'bot',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setToast({
                message: 'Code copied to clipboard!',
                type: 'success'
            });
        }).catch(() => {
            setToast({
                message: 'Failed to copy code',
                type: 'error'
            });
        });
    };

    const handleAddBlockToWorkspace = (blockDescription) => {
        if (!vm) {
            console.error('VM not available');
            return false;
        }

        try {
            const success = addBlockToWorkspace(blockDescription, vm);
            return success;
        } catch (error) {
            console.error('Error adding block to workspace:', error);
            return false;
        }
    };

    const handleAddStackToWorkspace = (blockCodes) => {
        if (!vm) {
            console.error('VM not available');
            return false;
        }
        
        try {
            const success = addStackToWorkspace(blockCodes, vm);
            return success;
        } catch (error) {
            console.error('Error adding stack to workspace:', error);
            return false;
        }
    };

    // Add global drop listener for workspace
    useEffect(() => {
        const handleGlobalDrop = (e) => {
            try {
                // Check if we have the right data type
                if (e.dataTransfer.types.includes('application/json')) {
                    const data = e.dataTransfer.getData('application/json');
                    if (data) {
                        const dragData = JSON.parse(data);
                        if (dragData.type === 'scratch-block') {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            const success = handleAddBlockToWorkspace(dragData.blockCode);
                            if (success) {
                                setToast({
                                    message: `Added block: ${dragData.blockCode}`,
                                    type: 'success'
                                });
                            } else {
                                setToast({
                                    message: 'Failed to add block to workspace',
                                    type: 'error'
                                });
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error handling global drop:', error);
            }
        };

        const handleGlobalDragOver = (e) => {
            try {
                // Check if we have the right data type
                if (e.dataTransfer.types.includes('application/json')) {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'copy';
                }
            } catch (error) {
                // Ignore errors when checking drag data
            }
        };

        // Add listeners to the document
        document.addEventListener('drop', handleGlobalDrop, true);
        document.addEventListener('dragover', handleGlobalDragOver, true);

        return () => {
            document.removeEventListener('drop', handleGlobalDrop, true);
            document.removeEventListener('dragover', handleGlobalDragOver, true);
        };
    }, [vm]);

    const currentConversation = conversations.find(c => c.id === currentConversationId);

    return (
        <div className={styles.chatbotContainer}>
            {/* Header */}
            <div className={styles.chatbotHeader}>
                <h3 className={styles.chatbotTitle}>
                    <FormattedMessage
                        defaultMessage="Scratch Programming Assistant"
                        description="Title for the integrated chatbot"
                        id="gui.chatbot.title"
                    />
                </h3>
                <div className={styles.headerActions}>
                    {/* Block Renderer Toggle */}
                    <button
                        className={styles.blockToggleButton}
                        onClick={() => setUseRealBlocks(!useRealBlocks)}
                        title={useRealBlocks ? "Use CSS Blocks" : "Use Real Scratch Blocks"}
                        style={{
                            backgroundColor: useRealBlocks ? '#4c97ff' : '#ccc',
                            color: useRealBlocks ? 'white' : '#666',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            marginRight: '8px'
                        }}
                    >
                        {useRealBlocks ? '🎯 Real Blocks' : '🎨 CSS Blocks'}
                    </button>
                    
                    {/* Conversation Management */}
                    <div className={styles.conversationMenu}>
                        <button
                            className={styles.conversationBtn}
                            onClick={() => setShowConversationMenu(!showConversationMenu)}
                            title="Conversations"
                        >
                            💬
                        </button>
                        {showConversationMenu && (
                            <div className={styles.conversationDropdown}>
                                <div className={styles.conversationActions}>
                                    <button onClick={createNewConversation}>
                                        ➕ New Conversation
                                    </button>
                                </div>
                                <div className={styles.conversationList}>
                                    {conversations.map(conv => (
                                        <div key={conv.id} className={styles.conversationItem}>
                                            <button 
                                                className={classNames(styles.conversationTitle, { [styles.active]: conv.id === currentConversationId })}
                                                onClick={() => loadConversation(conv.id)}
                                            >
                                                {conv.title}
                                            </button>
                                            <button 
                                                className={styles.deleteConversation}
                                                onClick={() => deleteConversation(conv.id)}
                                                title="Delete conversation"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <button
                        className={styles.settingsButton}
                        onClick={() => setShowSettings(true)}
                        title="Settings"
                    >
                        ⚙️
                    </button>
                    <button
                        className={styles.closeButton}
                        onClick={onRequestClose}
                        title="Close chatbot"
                    >
                        ✖
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className={styles.messagesContainer}>
                {messages.length === 0 ? (
                    <div className={styles.welcomeMessage}>
                        <p>What would you like to learn about?</p>
                    </div>
                ) : (
                    messages.map(message => (
                        <div
                            key={message.id}
                            className={classNames(
                                styles.message,
                                message.type === 'user' ? styles.userMessage : styles.botMessage
                            )}
                        >
                            <div className={styles.messageContent}>
                                {message.content}
                                
                                {/* Code blocks */}
                                                                {message.codeBlocks && (
                                    <div className={styles.codeBlocksContainer}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                                            {message.codeBlocks.map((block, index) => (
                                                <div key={index} style={{ display: 'inline-block' }}>
                                                    {useRealBlocks ? (
                                                        <RealScratchBlocksRenderer
                                                            block={block}
                                                            vm={vm}
                                                            onBlockAdded={(blockCode, isStack = false) => {
                                                                if (isStack && Array.isArray(blockCode)) {
                                                                    // Handle stack
                                                                    const success = handleAddStackToWorkspace(blockCode);
                                                                    if (success) {
                                                                        setToast({
                                                                            message: `Added stack with ${blockCode.length} blocks`,
                                                                            type: 'success'
                                                                        });
                                                                    } else {
                                                                        setToast({
                                                                            message: 'Failed to add stack to workspace',
                                                                            type: 'error'
                                                                        });
                                                                    }
                                                                } else {
                                                                    // Handle single block
                                                                    const success = handleAddBlockToWorkspace(blockCode);
                                                                    if (success) {
                                                                        setToast({
                                                                            message: `Added block: ${blockCode}`,
                                                                            type: 'success'
                                                                        });
                                                                    } else {
                                                                        setToast({
                                                                            message: 'Failed to add block to workspace',
                                                                            type: 'error'
                                                                        });
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                    ) : (
                                                        <ScratchBlocksRenderer
                                                            block={block}
                                                            vm={vm}
                                                            onBlockAdded={(blockCode, isStack = false) => {
                                                                if (isStack && Array.isArray(blockCode)) {
                                                                    // Handle stack
                                                                    const success = handleAddStackToWorkspace(blockCode);
                                                                    if (success) {
                                                                        setToast({
                                                                            message: `Added stack with ${blockCode.length} blocks`,
                                                                            type: 'success'
                                                                        });
                                                                    } else {
                                                                        setToast({
                                                                            message: 'Failed to add stack to workspace',
                                                                            type: 'error'
                                                                        });
                                                                    }
                                                                } else {
                                                                    // Handle single block
                                                                    const success = handleAddBlockToWorkspace(blockCode);
                                                                    if (success) {
                                                                        setToast({
                                                                            message: `Added block: ${blockCode}`,
                                                                            type: 'success'
                                                                        });
                                                                    } else {
                                                                        setToast({
                                                                            message: 'Failed to add block to workspace',
                                                                            type: 'error'
                                                                        });
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                            {message.codeBlocks.length > 1 && (
                                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                                                    <button
                                                        onClick={() => {
                                                            const blockCodes = message.codeBlocks.map(b => b.code || b.name);
                                                            console.log('Adding stack with codes:', blockCodes);
                                                            const success = handleAddStackToWorkspace(blockCodes);
                                                            console.log('Stack creation result:', success);
                                                            if (success) {
                                                                setToast({
                                                                    message: `Added stack with ${blockCodes.length} blocks`,
                                                                    type: 'success'
                                                                });
                                                            } else {
                                                                setToast({
                                                                    message: 'Failed to add stack to workspace',
                                                                    type: 'error'
                                                                });
                                                            }
                                                        }}
                                                        style={{
                                                            padding: '8px 12px',
                                                            backgroundColor: '#4c97ff',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            fontSize: '12px',
                                                            cursor: 'pointer',
                                                            fontWeight: '500',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                        title="Add all blocks as a stack"
                                                    >
                                                        📦 Add Stack
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {message.stacks && (
                                    <div className={styles.codeBlocksContainer}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
                                            {message.stacks.map((stack, stackIndex) => (
                                                <div key={stackIndex} style={{ 
                                                    border: '2px solid #4c97ff', 
                                                    borderRadius: '8px', 
                                                    padding: '8px',
                                                    backgroundColor: 'rgba(76, 151, 255, 0.1)'
                                                }}>
                                                    <div style={{ 
                                                        fontSize: '12px', 
                                                        fontWeight: 'bold', 
                                                        color: '#4c97ff', 
                                                        marginBottom: '8px',
                                                        textAlign: 'center'
                                                    }}>
                                                        {stack.name}
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-start' }}>
                                                        {stack.blocks.map((block, blockIndex) => (
                                                            <div key={blockIndex} style={{ display: 'inline-block' }}>
                                                                {useRealBlocks ? (
                                                                    <RealScratchBlocksRenderer
                                                                        block={block}
                                                                        vm={vm}
                                                                        onBlockAdded={(blockCode, isStack = false) => {
                                                                            if (isStack && Array.isArray(blockCode)) {
                                                                                // Handle stack
                                                                                const success = handleAddStackToWorkspace(blockCode);
                                                                                if (success) {
                                                                                    setToast({
                                                                                        message: `Added stack with ${blockCode.length} blocks`,
                                                                                        type: 'success'
                                                                                    });
                                                                                } else {
                                                                                    setToast({
                                                                                        message: 'Failed to add stack to workspace',
                                                                                        type: 'error'
                                                                                    });
                                                                                }
                                                                            } else {
                                                                                // Handle single block
                                                                                const success = handleAddBlockToWorkspace(blockCode);
                                                                                if (success) {
                                                                                    setToast({
                                                                                        message: `Added block: ${blockCode}`,
                                                                                        type: 'success'
                                                                                    });
                                                                                } else {
                                                                                    setToast({
                                                                                        message: 'Failed to add block to workspace',
                                                                                        type: 'error'
                                                                                    });
                                                                                }
                                                                            }
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <ScratchBlocksRenderer
                                                                        block={block}
                                                                        vm={vm}
                                                                        onBlockAdded={(blockCode, isStack = false) => {
                                                                            if (isStack && Array.isArray(blockCode)) {
                                                                                // Handle stack
                                                                                const success = handleAddStackToWorkspace(blockCode);
                                                                                if (success) {
                                                                                    setToast({
                                                                                        message: `Added stack with ${blockCode.length} blocks`,
                                                                                        type: 'success'
                                                                                    });
                                                                                } else {
                                                                                    setToast({
                                                                                        message: 'Failed to add stack to workspace',
                                                                                        type: 'error'
                                                                                    });
                                                                                }
                                                                            } else {
                                                                                // Handle single block
                                                                                const success = handleAddBlockToWorkspace(blockCode);
                                                                                if (success) {
                                                                                    setToast({
                                                                                        message: `Added block: ${blockCode}`,
                                                                                        type: 'success'
                                                                                    });
                                                                                } else {
                                                                                    setToast({
                                                                                        message: 'Failed to add block to workspace',
                                                                                        type: 'error'
                                                                                    });
                                                                                }
                                                                            }
                                                                        }}
                                                                    />
                                                                )}
                                                            </div>
                                                        ))}
                                                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                                                            <button
                                                                                                                        onClick={() => {
                                                            console.log(`Adding stack "${stack.name}" with blocks:`, stack.blocks);
                                                            
                                                            // Add a small delay between stack additions to prevent conflicts
                                                            setTimeout(() => {
                                                                const success = handleAddStackToWorkspace(stack.blocks);
                                                                console.log('Stack creation result:', success);
                                                                if (success) {
                                                                    setToast({
                                                                        message: `Added "${stack.name}" stack with ${stack.blocks.length} blocks`,
                                                                        type: 'success'
                                                                    });
                                                                } else {
                                                                    setToast({
                                                                        message: 'Failed to add stack to workspace',
                                                                        type: 'error'
                                                                    });
                                                                }
                                                            }, 100);
                                                        }}
                                                                style={{
                                                                    padding: '6px 10px',
                                                                    backgroundColor: '#4c97ff',
                                                                    color: 'white',
                                                                    border: 'none',
                                                                    borderRadius: '6px',
                                                                    fontSize: '11px',
                                                                    cursor: 'pointer',
                                                                    fontWeight: '500',
                                                                    whiteSpace: 'nowrap'
                                                                }}
                                                                title={`Add "${stack.name}" stack`}
                                                            >
                                                                📦 Add Stack
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className={styles.messageTimestamp}>{message.timestamp}</div>
                        </div>
                    ))
                )}
                
                {isLoading && (
                    <div className={classNames(styles.message, styles.botMessage)}>
                        <div className={styles.loadingIndicator}>
                            <div className={styles.typingDots}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Toast Notification */}
            {toast && (
                <ToastNotification
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Settings Modal */}
            {showSettings && (
                <ChatbotSettings
                    onClose={() => setShowSettings(false)}
                />
            )}

            {/* Input Area */}
            <div className={styles.inputContainer}>
                <textarea
                    ref={inputRef}
                    className={styles.messageInput}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me how to create anything in Scratch..."
                    rows={1}
                    disabled={isLoading}
                />
                <button
                    className={classNames(
                        styles.sendButton,
                        { [styles.sendButtonDisabled]: !inputValue.trim() || isLoading }
                    )}
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                >
                    <FormattedMessage
                        defaultMessage="Send"
                        description="Send button for chatbot"
                        id="gui.chatbot.send"
                    />
                </button>
            </div>
        </div>
    );
};

Chatbot.propTypes = {
    vm: PropTypes.object,
    onRequestClose: PropTypes.func.isRequired
};

export default Chatbot;
