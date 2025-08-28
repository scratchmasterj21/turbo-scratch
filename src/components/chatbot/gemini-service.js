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
        // Extract blocks from AI response
        const codeBlocks = this.extractBlocksFromResponse(response);
        
        // Determine if this should be a stack response or individual blocks
        const lowerResponse = response.toLowerCase();
        const isGameRequest = lowerResponse.includes('game') || lowerResponse.includes('shooter') || lowerResponse.includes('space');
        const isComplexRequest = lowerResponse.includes('multiple') || lowerResponse.includes('several') || lowerResponse.includes('different');
        
        // If it's a game or complex request and we have multiple blocks, structure as stacks
        if ((isGameRequest || isComplexRequest) && codeBlocks.length > 3) {
            // Group blocks into logical stacks
            const stacks = this.groupBlocksIntoStacks(codeBlocks, response);
            
            return {
                type: 'bot',
                content: response,
                stacks: stacks
            };
        }
        
        // Otherwise return as individual code blocks
        return {
            type: 'bot',
            content: response,
            codeBlocks: codeBlocks.length > 0 ? codeBlocks : undefined
        };
    }
    
    // Group blocks into logical stacks based on the AI response
    groupBlocksIntoStacks(codeBlocks, response) {
        const stacks = [];
        const lowerResponse = response.toLowerCase();
        
        // Determine game type from response
        let gameType = 'Game';
        if (lowerResponse.includes('space') && lowerResponse.includes('shooter')) {
            gameType = 'Space Shooter Game';
        } else if (lowerResponse.includes('balloon') && lowerResponse.includes('pop')) {
            gameType = 'Balloon Pop Game';
        } else if (lowerResponse.includes('platformer')) {
            gameType = 'Platformer Game';
        } else if (lowerResponse.includes('racing')) {
            gameType = 'Racing Game';
        }
        
        // Group blocks by category or create logical groups
        const eventBlocks = codeBlocks.filter(block => block.category === 'events' || block.code.includes('when'));
        const controlBlocks = codeBlocks.filter(block => block.category === 'control' || block.code.includes('repeat') || block.code.includes('forever') || block.code.includes('if'));
        const motionBlocks = codeBlocks.filter(block => block.category === 'motion' || block.code.includes('move') || block.code.includes('go to') || block.code.includes('turn'));
        const variableBlocks = codeBlocks.filter(block => block.category === 'variables' || block.code.includes('score') || block.code.includes('variable'));
        const soundBlocks = codeBlocks.filter(block => block.category === 'sound' || block.code.includes('play') || block.code.includes('sound'));
        const looksBlocks = codeBlocks.filter(block => block.category === 'looks' || block.code.includes('say') || block.code.includes('show') || block.code.includes('hide'));
        
        // Create stacks based on available blocks
        if (eventBlocks.length > 0) {
            stacks.push({
                name: 'Event Handlers',
                blocks: eventBlocks
            });
        }
        
        if (controlBlocks.length > 0) {
            stacks.push({
                name: 'Control Logic',
                blocks: controlBlocks
            });
        }
        
        if (motionBlocks.length > 0) {
            stacks.push({
                name: 'Movement',
                blocks: motionBlocks
            });
        }
        
        if (variableBlocks.length > 0) {
            stacks.push({
                name: 'Variables & Scoring',
                blocks: variableBlocks
            });
        }
        
        if (soundBlocks.length > 0) {
            stacks.push({
                name: 'Sound Effects',
                blocks: soundBlocks
            });
        }
        
        if (looksBlocks.length > 0) {
            stacks.push({
                name: 'Visual Effects',
                blocks: looksBlocks
            });
        }
        
        // If no specific groups, create a general stack
        if (stacks.length === 0 && codeBlocks.length > 0) {
            stacks.push({
                name: `${gameType} Scripts`,
                blocks: codeBlocks
            });
        }
        
        return stacks;
    }
    
    // Extract blocks from AI response
    extractBlocksFromResponse(response) {
        const blocks = [];
        
        // Look for code blocks in the response
        const codeBlockRegex = /```(?:scratch|blocks)?\s*\n([\s\S]*?)\n```/g;
        let match;

        while ((match = codeBlockRegex.exec(response)) !== null) {
            const code = match[1].trim();
            const lines = code.split('\n');
            
            // Extract block name from first line or generate one
            const blockName = lines[0] || 'Scratch Block';
            
            // Determine category and opcode from the code
            const category = this.determineBlockCategory(code);
            const opcode = this.determineBlockOpcode(code);
            
            blocks.push({
                name: blockName,
                code: code,
                category: category,
                opcode: opcode
            });
        }

        // If no code blocks found, try to extract individual block references
        if (blocks.length === 0) {
            const blockReferences = this.extractBlockReferences(response);
            if (blockReferences.length > 0) {
                blocks.push(...blockReferences);
            }
        }

        // Enhanced block extraction for complex requests
        const enhancedBlocks = this.extractEnhancedBlocks(response);
        if (enhancedBlocks.length > 0) {
            blocks.push(...enhancedBlocks);
        }

        return blocks;
    }
    
    // Determine block category from code
    determineBlockCategory(code) {
        const lowerCode = code.toLowerCase();
        
        if (lowerCode.includes('when') || lowerCode.includes('event')) {
            return 'events';
        } else if (lowerCode.includes('move') || lowerCode.includes('go to') || lowerCode.includes('turn') || lowerCode.includes('glide')) {
            return 'motion';
        } else if (lowerCode.includes('say') || lowerCode.includes('think') || lowerCode.includes('show') || lowerCode.includes('hide') || lowerCode.includes('costume')) {
            return 'looks';
        } else if (lowerCode.includes('play') || lowerCode.includes('sound') || lowerCode.includes('pitch') || lowerCode.includes('volume')) {
            return 'sound';
        } else if (lowerCode.includes('repeat') || lowerCode.includes('forever') || lowerCode.includes('if') || lowerCode.includes('wait') || lowerCode.includes('clone')) {
            return 'control';
        } else if (lowerCode.includes('score') || lowerCode.includes('variable') || lowerCode.includes('set') || lowerCode.includes('change')) {
            return 'variables';
        } else if (lowerCode.includes('touching') || lowerCode.includes('distance') || lowerCode.includes('key') || lowerCode.includes('mouse')) {
            return 'sensing';
        }
        
        return 'ai-generated';
    }
    
    // Determine block opcode from code
    determineBlockOpcode(code) {
        const lowerCode = code.toLowerCase();
        
        // Event blocks
        if (lowerCode.includes('when green flag clicked')) {
            return 'event_whenflagclicked';
        } else if (lowerCode.includes('when this sprite clicked')) {
            return 'event_whenthisspriteclicked';
        } else if (lowerCode.includes('when i start as a clone')) {
            return 'control_start_as_clone';
        }
        
        // Motion blocks
        else if (lowerCode.includes('move') && lowerCode.includes('steps')) {
            return 'motion_movesteps';
        } else if (lowerCode.includes('turn right')) {
            return 'motion_turnright';
        } else if (lowerCode.includes('turn left')) {
            return 'motion_turnleft';
        } else if (lowerCode.includes('go to random position')) {
            return 'motion_goto';
        } else if (lowerCode.includes('go to x:') && lowerCode.includes('y:')) {
            return 'motion_gotoxy';
        } else if (lowerCode.includes('glide')) {
            return 'motion_glideto';
        }
        
        // Looks blocks
        else if (lowerCode.includes('say') && lowerCode.includes('for')) {
            return 'looks_sayforsecs';
        } else if (lowerCode.includes('say')) {
            return 'looks_say';
        } else if (lowerCode.includes('think') && lowerCode.includes('for')) {
            return 'looks_thinkforsecs';
        } else if (lowerCode.includes('think')) {
            return 'looks_think';
        } else if (lowerCode.includes('show')) {
            return 'looks_show';
        } else if (lowerCode.includes('hide')) {
            return 'looks_hide';
        }
        
        // Sound blocks
        else if (lowerCode.includes('play sound') && lowerCode.includes('until done')) {
            return 'sound_playuntildone';
        } else if (lowerCode.includes('play sound')) {
            return 'sound_play';
        } else if (lowerCode.includes('change pitch')) {
            return 'sound_changeeffectby';
        }
        
        // Control blocks
        else if (lowerCode.includes('wait') && lowerCode.includes('secs')) {
            return 'control_wait';
        } else if (lowerCode.includes('repeat') && lowerCode.includes('times')) {
            return 'control_repeat';
        } else if (lowerCode.includes('repeat')) {
            return 'control_repeat';
        } else if (lowerCode.includes('forever')) {
            return 'control_forever';
        } else if (lowerCode.includes('if') && lowerCode.includes('then')) {
            return 'control_if';
        } else if (lowerCode.includes('create clone')) {
            return 'control_create_clone_of';
        } else if (lowerCode.includes('delete this clone')) {
            return 'control_delete_this_clone';
        }
        
        // Variable blocks
        else if (lowerCode.includes('set') && lowerCode.includes('score')) {
            return 'data_setvariableto';
        } else if (lowerCode.includes('change') && lowerCode.includes('score')) {
            return 'data_changevariableby';
        } else if (lowerCode.includes('show variable')) {
            return 'data_showvariable';
        } else if (lowerCode.includes('hide variable')) {
            return 'data_hidevariable';
        }
        
        // Sensing blocks
        else if (lowerCode.includes('touching')) {
            return 'sensing_touchingobject';
        } else if (lowerCode.includes('distance')) {
            return 'sensing_distanceto';
        } else if (lowerCode.includes('key') && lowerCode.includes('pressed')) {
            return 'sensing_keypressed';
        } else if (lowerCode.includes('mouse down')) {
            return 'sensing_mousedown';
        }
        
        return null;
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
