// Gemini AI Service for Scratch Programming Assistant
// This service integrates with Google's Gemini 2.0 Flash-Lite API

const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY'; // Replace with your actual API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

// System prompt for Scratch programming assistance
const SYSTEM_PROMPT = `You are a helpful Scratch programming assistant. Your role is to:

1. Help students learn Scratch programming concepts
2. Provide clear, simple explanations
3. Show relevant Scratch blocks and code examples
4. Suggest appropriate block combinations for different tasks
5. Explain programming concepts in an educational way

When responding:
- Use simple, clear language suitable for students
- Focus on Scratch-specific concepts and blocks
- Provide practical examples
- Be encouraging and supportive
- If asked about code, show the actual Scratch block names and structure

Common Scratch block categories:
- Motion: move, turn, go to, glide, etc.
- Looks: say, think, switch costume, show/hide, etc.
- Sound: play sound, change pitch, etc.
- Control: repeat, forever, if/then, wait, etc.
- Events: when green flag clicked, when sprite clicked, etc.
- Sensing: touching, distance, etc.
- Variables: set, change, show/hide variables

Always respond in a helpful, educational manner.`;

export class GeminiService {
    constructor(apiKey = GEMINI_API_KEY) {
        this.apiKey = apiKey;
        this.conversationHistory = [];
    }

    // Set API key
    setApiKey(apiKey) {
        this.apiKey = apiKey;
    }

    // Add a message to conversation history
    addToHistory(role, content) {
        this.conversationHistory.push({
            role: role,
            parts: [{ text: content }]
        });
    }

    // Clear conversation history
    clearHistory() {
        this.conversationHistory = [];
    }

    // Generate response using Gemini API
    async generateResponse(userMessage) {
        if (!this.apiKey || this.apiKey === 'YOUR_GEMINI_API_KEY') {
            // Fallback to local responses if no API key
            return this.getFallbackResponse(userMessage);
        }

        try {
            // Add user message to history
            this.addToHistory('user', userMessage);

            // Prepare the request payload
            const requestBody = {
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: SYSTEM_PROMPT }]
                    },
                    ...this.conversationHistory
                ],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                },
                safetySettings: [
                    {
                        category: 'HARM_CATEGORY_HARASSMENT',
                        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                    },
                    {
                        category: 'HARM_CATEGORY_HATE_SPEECH',
                        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                    },
                    {
                        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                    },
                    {
                        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                    }
                ]
            };

            const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const aiResponse = data.candidates[0].content.parts[0].text;
                
                // Add AI response to history
                this.addToHistory('model', aiResponse);
                
                return this.parseAIResponse(aiResponse);
            } else {
                throw new Error('Invalid response format from Gemini API');
            }

        } catch (error) {
            console.error('Error calling Gemini API:', error);
            // Fallback to local responses
            return this.getFallbackResponse(userMessage);
        }
    }

    // Parse AI response to extract code blocks and structure
    parseAIResponse(response) {
        // Look for code blocks in the response
        const codeBlockRegex = /```(?:scratch|blocks)?\s*\n([\s\S]*?)\n```/g;
        const codeBlocks = [];
        let match;

        while ((match = codeBlockRegex.exec(response)) !== null) {
            const code = match[1].trim();
            const lines = code.split('\n');
            
            // Extract block name from first line or generate one
            const blockName = lines[0] || 'Scratch Block';
            
            codeBlocks.push({
                name: blockName,
                code: code,
                category: 'ai-generated'
            });
        }

        // If no code blocks found, try to extract individual block references
        if (codeBlocks.length === 0) {
            const blockReferences = this.extractBlockReferences(response);
            if (blockReferences.length > 0) {
                codeBlocks.push(...blockReferences);
            }
        }

        // Enhanced block extraction for complex requests
        const enhancedBlocks = this.extractEnhancedBlocks(response);
        if (enhancedBlocks.length > 0) {
            codeBlocks.push(...enhancedBlocks);
        }

        return {
            type: 'bot',
            content: response,
            codeBlocks: codeBlocks.length > 0 ? codeBlocks : undefined
        };
    }

    // Enhanced block extraction for complex requests
    extractEnhancedBlocks(text) {
        const blocks = [];
        
        // Split text into lines and look for block patterns
        const lines = text.split('\n');
        
        lines.forEach(line => {
            const trimmedLine = line.trim();
            
            // Skip empty lines and common prefixes
            if (!trimmedLine || trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
                return;
            }
            
            // Enhanced patterns for different block types
            const patterns = [
                // Motion blocks
                { pattern: /move (\d+) steps?/i, opcode: 'motion_movesteps' },
                { pattern: /turn (left|right) (\d+) degrees?/i, opcode: 'motion_turnright' },
                { pattern: /go to x: (\d+) y: (\d+)/i, opcode: 'motion_gotoxy' },
                { pattern: /glide (\d+) secs? to x: (\d+) y: (\d+)/i, opcode: 'motion_glideto' },
                
                // Looks blocks
                { pattern: /say "([^"]+)" for (\d+) secs?/i, opcode: 'looks_sayforsecs' },
                { pattern: /say "([^"]+)"/i, opcode: 'looks_say' },
                { pattern: /think "([^"]+)" for (\d+) secs?/i, opcode: 'looks_thinkforsecs' },
                { pattern: /think "([^"]+)"/i, opcode: 'looks_think' },
                { pattern: /hide/i, opcode: 'looks_hide' },
                { pattern: /show/i, opcode: 'looks_show' },
                
                // Control blocks
                { pattern: /repeat (\d+) times?/i, opcode: 'control_repeat' },
                { pattern: /repeat (\d+)/i, opcode: 'control_repeat' },
                { pattern: /forever/i, opcode: 'control_forever' },
                { pattern: /if (.+) then/i, opcode: 'control_if' },
                { pattern: /wait (\d+) secs?/i, opcode: 'control_wait' },
                { pattern: /wait until (.+)/i, opcode: 'control_wait_until' },
                
                // Events
                { pattern: /when green flag clicked/i, opcode: 'event_whenflagclicked' },
                { pattern: /when this sprite clicked/i, opcode: 'event_whenthisspriteclicked' },
                { pattern: /when key (.+) pressed/i, opcode: 'event_whenkeypressed' },
                
                // Sensing
                { pattern: /touching (.+)\?/i, opcode: 'sensing_touchingobject' },
                { pattern: /touching edge\?/i, opcode: 'sensing_touchingobject' },
                
                // Variables
                { pattern: /set (.+) to (\d+)/i, opcode: 'data_setvariableto' },
                { pattern: /change (.+) by (\d+)/i, opcode: 'data_changevariableby' }
            ];
            
            patterns.forEach(({ pattern, opcode }) => {
                const match = trimmedLine.match(pattern);
                if (match) {
                    blocks.push({
                        name: trimmedLine,
                        code: trimmedLine,
                        category: 'enhanced',
                        opcode: opcode
                    });
                }
            });
        });
        
        return blocks;
    }

    // Extract block references from text
    extractBlockReferences(text) {
        const blockPatterns = [
            /move (\d+) steps?/gi,
            /turn (left|right) (\d+) degrees?/gi,
            /say "([^"]+)"/gi,
            /think "([^"]+)"/gi,
            /wait (\d+) secs?/gi,
            /repeat (\d+)/gi,
            /forever/gi,
            /if (.+) then/gi,
            /when green flag clicked/gi,
            /when this sprite clicked/gi,
            /touching (.+)\?/gi
        ];

        const blocks = [];
        blockPatterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) {
                matches.forEach(match => {
                    blocks.push({
                        name: match,
                        code: match,
                        category: 'extracted'
                    });
                });
            }
        });

        return blocks;
    }

    // Fallback responses when API is not available
    getFallbackResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // Simple keyword-based responses
        if (lowerMessage.includes('move') || lowerMessage.includes('walk')) {
            return {
                type: 'bot',
                content: 'To make a sprite move in Scratch, you can use these motion blocks:',
                codeBlocks: [
                    {
                        name: 'Move 10 steps',
                        code: 'move 10 steps',
                        category: 'motion'
                    },
                    {
                        name: 'Go to x: 0 y: 0',
                        code: 'go to x: 0 y: 0',
                        category: 'motion'
                    },
                    {
                        name: 'Glide 1 secs to x: 0 y: 0',
                        code: 'glide 1 secs to x: 0 y: 0',
                        category: 'motion'
                    }
                ]
            };
        } else if (lowerMessage.includes('sound') || lowerMessage.includes('play')) {
            return {
                type: 'bot',
                content: 'To add sound to your project, use these sound blocks:',
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
                    }
                ]
            };
        } else {
            return {
                type: 'bot',
                content: 'I can help you with Scratch programming! Try asking about:\n• How to make sprites move\n• How to add sound\n• How to create loops\n• How to use variables\n• How to work with sprites\n\nWhat would you like to learn about?'
            };
        }
    }

    // Set API key
    setApiKey(apiKey) {
        this.apiKey = apiKey;
    }

    // Check if API key is configured
    isConfigured() {
        return this.apiKey && this.apiKey !== 'YOUR_GEMINI_API_KEY';
    }
}

// Create a singleton instance
export const geminiService = new GeminiService();
