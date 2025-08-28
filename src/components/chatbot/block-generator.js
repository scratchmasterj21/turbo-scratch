// Block generator utility for converting text descriptions to Scratch blocks
// This maps common Scratch block descriptions to their actual block specifications

export const blockDefinitions = {
    // Motion blocks
    'move 10 steps': {
        opcode: 'motion_movesteps',
        inputs: {
            STEPS: {
                shadow: {
                    type: 'math_number',
                    fields: {
                        NUM: {
                            name: 'NUM',
                            value: 10
                        }
                    }
                }
            }
        }
    },
    'go to x: 0 y: 0': {
        opcode: 'motion_gotoxy',
        inputs: {
            X: {
                shadow: {
                    type: 'math_number',
                    fields: {
                        NUM: {
                            name: 'NUM',
                            value: 0
                        }
                    }
                }
            },
            Y: {
                shadow: {
                    type: 'math_number',
                    fields: {
                        NUM: {
                            name: 'NUM',
                            value: 0
                        }
                    }
                }
            }
        }
    },
    'glide 1 secs to x: 0 y: 0': {
        opcode: 'motion_glideto',
        inputs: {
            SECS: {
                shadow: {
                    type: 'math_number',
                    fields: {
                        NUM: {
                            name: 'NUM',
                            value: 1
                        }
                    }
                }
            },
            X: {
                shadow: {
                    type: 'math_number',
                    fields: {
                        NUM: {
                            name: 'NUM',
                            value: 0
                        }
                    }
                }
            },
            Y: {
                shadow: {
                    type: 'math_number',
                    fields: {
                        NUM: {
                            name: 'NUM',
                            value: 0
                        }
                    }
                }
            }
        }
    },
    'turn right 15 degrees': {
        opcode: 'motion_turnright',
        inputs: {
            DEGREES: {
                shadow: {
                    type: 'math_number',
                    fields: {
                        NUM: {
                            name: 'NUM',
                            value: 15
                        }
                    }
                }
            }
        }
    },
    'turn left 15 degrees': {
        opcode: 'motion_turnleft',
        inputs: {
            DEGREES: {
                shadow: {
                    type: 'math_number',
                    fields: {
                        NUM: {
                            name: 'NUM',
                            value: 15
                        }
                    }
                }
            }
        }
    },

    // Looks blocks
    'say Hello for 2 secs': {
        opcode: 'looks_sayforsecs',
        inputs: {
            MESSAGE: {
                shadow: {
                    type: 'text',
                    fields: {
                        TEXT: {
                            name: 'TEXT',
                            value: 'Hello'
                        }
                    }
                }
            },
            SECS: {
                shadow: {
                    type: 'math_number',
                    fields: {
                        NUM: {
                            name: 'NUM',
                            value: 2
                        }
                    }
                }
            }
        }
    },
    'say Hello': {
        opcode: 'looks_say',
        inputs: {
            MESSAGE: {
                shadow: {
                    type: 'text',
                    fields: {
                        TEXT: {
                            name: 'TEXT',
                            value: 'Hello'
                        }
                    }
                }
            }
        }
    },
    'think Hmm for 2 secs': {
        opcode: 'looks_thinkforsecs',
        inputs: {
            MESSAGE: {
                shadow: {
                    type: 'text',
                    fields: {
                        TEXT: {
                            name: 'TEXT',
                            value: 'Hmm'
                        }
                    }
                }
            },
            SECS: {
                shadow: {
                    type: 'math_number',
                    fields: {
                        NUM: {
                            name: 'NUM',
                            value: 2
                        }
                    }
                }
            }
        }
    },
    'switch costume to costume1': {
        opcode: 'looks_switchcostumeto',
        inputs: {
            COSTUME: {
                shadow: {
                    type: 'costume',
                    fields: {
                        COSTUME: {
                            name: 'COSTUME',
                            value: 'costume1'
                        }
                    }
                }
            }
        }
    },
    'next costume': {
        opcode: 'looks_nextcostume'
    },
    'hide': {
        opcode: 'looks_hide'
    },
    'show': {
        opcode: 'looks_show'
    },

    // Sound blocks
    'play sound until done': {
        opcode: 'sound_playuntildone',
        inputs: {
            SOUND_MENU: {
                shadow: {
                    type: 'sound_sounds_menu',
                    fields: {
                        SOUND_MENU: {
                            name: 'SOUND_MENU',
                            value: 'pop'
                        }
                    }
                }
            }
        }
    },
    'start sound': {
        opcode: 'sound_play',
        inputs: {
            SOUND_MENU: {
                shadow: {
                    type: 'sound_sounds_menu',
                    fields: {
                        SOUND_MENU: {
                            name: 'SOUND_MENU',
                            value: 'pop'
                        }
                    }
                }
            }
        }
    },
    'change pitch by 10': {
        opcode: 'sound_changeeffectby',
        inputs: {
            VALUE: {
                shadow: {
                    type: 'math_number',
                    fields: {
                        NUM: {
                            name: 'NUM',
                            value: 10
                        }
                    }
                }
            }
        },
        fields: {
            EFFECT: {
                name: 'EFFECT',
                value: 'PITCH'
            }
        }
    },

    // Control blocks
    'wait 1 secs': {
        opcode: 'control_wait',
        inputs: {
            DURATION: {
                shadow: {
                    type: 'math_number',
                    fields: {
                        NUM: {
                            name: 'NUM',
                            value: 1
                        }
                    }
                }
            }
        }
    },
    'repeat 10': {
        opcode: 'control_repeat',
        inputs: {
            TIMES: {
                shadow: {
                    type: 'math_number',
                    fields: {
                        NUM: {
                            name: 'NUM',
                            value: 10
                        }
                    }
                }
            }
        }
    },
    'forever': {
        opcode: 'control_forever'
    },
    'if <> then': {
        opcode: 'control_if',
        inputs: {
            CONDITION: {
                shadow: {
                    type: 'operator_equals',
                    inputs: {
                        OPERAND1: {
                            shadow: {
                                type: 'math_number',
                                fields: {
                                    NUM: {
                                        name: 'NUM',
                                        value: 1
                                    }
                                }
                            }
                        },
                        OPERAND2: {
                            shadow: {
                                type: 'math_number',
                                fields: {
                                    NUM: {
                                        name: 'NUM',
                                        value: 1
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    'wait until <>': {
        opcode: 'control_wait_until',
        inputs: {
            CONDITION: {
                shadow: {
                    type: 'operator_equals',
                    inputs: {
                        OPERAND1: {
                            shadow: {
                                type: 'math_number',
                                fields: {
                                    NUM: {
                                        name: 'NUM',
                                        value: 1
                                    }
                                }
                            }
                        },
                        OPERAND2: {
                            shadow: {
                                type: 'math_number',
                                fields: {
                                    NUM: {
                                        name: 'NUM',
                                        value: 1
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    // Event blocks
    'when green flag clicked': {
        opcode: 'event_whenflagclicked'
    },
    'when this sprite clicked': {
        opcode: 'event_whenthisspriteclicked'
    },
    'when key space pressed': {
        opcode: 'event_whenkeypressed',
        fields: {
            KEY_OPTION: {
                name: 'KEY_OPTION',
                value: 'space'
            }
        }
    },

    // Sensing blocks
    'touching mouse pointer?': {
        opcode: 'sensing_touchingobject',
        inputs: {
            TOUCHINGOBJECTMENU: {
                shadow: {
                    type: 'sensing_touchingobjectmenu',
                    fields: {
                        TOUCHINGOBJECTMENU: {
                            name: 'TOUCHINGOBJECTMENU',
                            value: '_mouse_'
                        }
                    }
                }
            }
        }
    },
    'touching edge?': {
        opcode: 'sensing_touchingobject',
        inputs: {
            TOUCHINGOBJECTMENU: {
                shadow: {
                    type: 'sensing_touchingobjectmenu',
                    fields: {
                        TOUCHINGOBJECTMENU: {
                            name: 'TOUCHINGOBJECTMENU',
                            value: '_edge_'
                        }
                    }
                }
            }
        }
    },

    // Variables blocks
    'set score to 0': {
        opcode: 'data_setvariableto',
        fields: {
            VARIABLE: {
                name: 'VARIABLE',
                value: 'score'
            }
        },
        inputs: {
            VALUE: {
                shadow: {
                    type: 'math_number',
                    fields: {
                        NUM: {
                            name: 'NUM',
                            value: 0
                        }
                    }
                }
            }
        }
    },
    'change score by 1': {
        opcode: 'data_changevariableby',
        fields: {
            VARIABLE: {
                name: 'VARIABLE',
                value: 'score'
            }
        },
        inputs: {
            VALUE: {
                shadow: {
                    type: 'math_number',
                    fields: {
                        NUM: {
                            name: 'NUM',
                            value: 1
                        }
                    }
                }
            }
        }
    }
};



// Function to add a block to the workspace
export const addBlockToWorkspace = (blockDescription, vm) => {
    if (!blockDescription || !vm) {
        console.error('Missing required parameters for adding block to workspace');
        return false;
    }

    try {
        // Get the current target (sprite)
        const target = vm.editingTarget;
        if (!target) {
            console.error('No editing target found');
            return false;
        }

        // Create block data in the format expected by the VM
        const blockData = {
            id: generateBlockId(),
            opcode: getOpcodeFromDescription(blockDescription),
            next: null,
            parent: null,
            inputs: getBlockInputs(blockDescription),
            fields: getBlockFields(blockDescription),
            shadow: false,
            topLevel: true,
            x: 100,
            y: 100
        };

        // Get existing blocks to determine stacking position
        const existingBlocks = Object.values(target.blocks._blocks).filter(block => block.topLevel);
        if (existingBlocks.length > 0) {
            // Find the last block in the workspace
            const lastBlock = existingBlocks[existingBlocks.length - 1];
            // Position new block below the last one
            blockData.x = lastBlock.x || 100;
            blockData.y = (lastBlock.y || 100) + 80; // 80 pixels below
        }

        // Create shadow blocks first
        if (window.shadowBlockCache) {
            Object.keys(window.shadowBlockCache).forEach(shadowId => {
                const shadowData = window.shadowBlockCache[shadowId];
                const shadowBlock = {
                    id: shadowId,
                    opcode: shadowData.opcode,
                    fields: {},
                    shadow: true,
                    topLevel: false,
                    x: 0,
                    y: 0
                };
                
                // Add fields
                if (shadowData.fields) {
                    Object.keys(shadowData.fields).forEach(fieldName => {
                        shadowBlock.fields[fieldName] = {
                            name: fieldName,
                            value: shadowData.fields[fieldName]
                        };
                    });
                }
                
                // Create the shadow block
                try {
                    if (target.blocks.createBlock) {
                        target.blocks.createBlock(shadowBlock);
                    } else {
                        target.blocks._blocks[shadowId] = shadowBlock;
                    }
                } catch (error) {
                    console.error('Error creating shadow block:', error);
                }
            });
            
            // Clear the cache
            window.shadowBlockCache = {};
        }

        // Add the main block to the target using the correct API
        try {
            // Create shadow blocks first if they exist
            if (blockData.inputs) {
                Object.keys(blockData.inputs).forEach(inputName => {
                    const input = blockData.inputs[inputName];
                    if (input.shadow && window.shadowBlockCache && window.shadowBlockCache[input.block]) {
                        const shadowData = window.shadowBlockCache[input.block];
                        const shadowBlockData = {
                            id: input.block,
                            opcode: shadowData.opcode,
                            fields: shadowData.fields,
                            shadow: true,
                            topLevel: false,
                            x: 0,
                            y: 0
                        };
                        
                        // Add shadow block to target
                        if (target.blocks.createBlock) {
                            target.blocks.createBlock(shadowBlockData);
                        } else {
                            target.blocks._blocks[input.block] = shadowBlockData;
                        }
                    }
                });
            }
            
            if (target.blocks.createBlock) {
                target.blocks.createBlock(blockData);
            } else {
                // Alternative method - directly add to blocks
                target.blocks._blocks[blockData.id] = blockData;
            }
            
            // Create variables if this is a variable block
            if (blockData.opcode === 'data_setvariableto' || blockData.opcode === 'data_changevariableby') {
                const variableName = extractVariableName(blockDescription);
                const variableId = createVariableIfNeeded(vm, variableName);
                
                // Update the block's VARIABLE field to use the correct variable name
                if (variableId && blockData.fields && blockData.fields.VARIABLE) {
                    blockData.fields.VARIABLE.value = variableName;
                }
                
                // Also ensure the field structure is correct
                if (blockData.fields && blockData.fields.VARIABLE) {
                    blockData.fields.VARIABLE = {
                        name: 'VARIABLE',
                        value: variableName
                    };
                }
            }
            
            // Emit workspace update to refresh the UI
            if (vm.emitWorkspaceUpdate) {
                vm.emitWorkspaceUpdate();
            }
        } catch (error) {
            console.error('Error creating block:', error);
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Error adding block to workspace:', error);
        return false;
    }
};

// Function to add a stack of blocks to the workspace
export const addStackToWorkspace = (blockDescriptions, vm) => {
    if (!blockDescriptions || !Array.isArray(blockDescriptions) || !vm) {
        console.error('Missing required parameters for adding stack to workspace');
        return false;
    }

    try {
        // Get the current target (sprite)
        const target = vm.editingTarget;
        if (!target) {
            console.error('No editing target found');
            return false;
        }

        // Get the Blockly workspace from the GUI
        const workspace = getBlocklyWorkspace();
        if (!workspace) {
            console.error('Could not find Blockly workspace');
            return false;
        }
        
        // Check if we need to create any variables first
        const neededVariables = [];
        for (const blockData of blockDescriptions) {
            const blockDescription = typeof blockData === 'string' ? blockData : blockData.code || blockData.name;
            const opcode = getOpcodeFromDescription(blockDescription);
            
            // Check for variable-related blocks
            if ((opcode === 'data_setvariableto' || opcode === 'data_changevariableby') && 
                blockDescription.includes('score')) {
                neededVariables.push('score');
            }
        }
        
        // If we need variables, show the modal first
        if (neededVariables.length > 0) {
            console.log(`🎯 Need to create variables: ${neededVariables.join(', ')}`);
            
            // Store the block descriptions to add after variable creation
            window.pendingBlockStack = blockDescriptions;
            
            // Trigger the variable creation modal for each needed variable
            for (const variableName of neededVariables) {
                console.log(`🎯 Triggering variable creation modal for: ${variableName}`);
                
                // SIMPLER APPROACH: Just create the variable directly and then add blocks
                try {
                    console.log(`🎯 Creating variable directly: ${variableName}`);
                    const newVariable = workspace.createVariable(variableName);
                    console.log(`✅ Variable created directly: ${variableName} with ID: ${newVariable.getId()}`);
                    
                    // Add blocks immediately after variable creation
                    setTimeout(() => {
                        if (window.pendingBlockStack) {
                            console.log(`🎯 Adding blocks after direct variable creation...`);
                            addBlocksToWorkspace(window.pendingBlockStack, vm);
                            window.pendingBlockStack = null;
                        }
                    }, 500);
                    
                } catch (error) {
                    console.error(`Error creating variable directly:`, error);
                    
                    // Fallback to modal approach
                    console.log(`🎯 Falling back to modal approach...`);
                    
                    // Use the exact same method that Scratch uses for "Make a Variable"
                    console.log(`🎯 About to call workspace.createVariable for: ${variableName}`);
                    
                    // Create a callback that will be called when the variable is created
                    const callback = (variableName, variableOptions) => {
                        console.log(`✅ Variable "${variableName}" created with options:`, variableOptions);
                        console.log(`🎯 Callback triggered! Adding blocks now...`);
                        
                        // After variable creation, add the blocks using our working implementation
                        setTimeout(() => {
                            if (window.pendingBlockStack) {
                                console.log(`🎯 Adding pending block stack after variable creation...`);
                                console.log(`🎯 Pending blocks:`, window.pendingBlockStack);
                                
                                // Use our previous working implementation to add blocks
                                const workspace = getBlocklyWorkspace();
                                if (!workspace) {
                                    console.error('Could not find Blockly workspace');
                                    return;
                                }
                                
                                const createdBlocks = [];
                                let previousBlock = null;

                                // Get existing blocks to determine positioning
                                const existingBlocks = workspace.getAllBlocks(false);
                                const topLevelBlocks = existingBlocks.filter(block => !block.getParent());
                                
                                // Calculate position based on existing blocks
                                let baseX = 100;
                                let baseY = 100;
                                
                                if (topLevelBlocks.length > 0) {
                                    // Find the rightmost position of existing blocks
                                    const maxX = Math.max(...topLevelBlocks.map(block => block.getRelativeToSurfaceXY().x));
                                    baseX = maxX + 250; // Position to the right
                                    baseY = 100;
                                }

                                // Create each block in the stack
                                for (let i = 0; i < window.pendingBlockStack.length; i++) {
                                    const blockData = window.pendingBlockStack[i];
                                    const blockDescription = typeof blockData === 'string' ? blockData : blockData.code || blockData.name;
                                    console.log(`Creating block ${i + 1}/${window.pendingBlockStack.length}:`, blockDescription);
                                    
                                    // Get the opcode
                                    const opcode = getOpcodeFromDescription(blockDescription);
                                    if (!opcode) {
                                        console.error(`No opcode found for block description: ${blockDescription}`);
                                        continue;
                                    }

                                    try {
                                        // Create block XML with proper values and shadow blocks for editable inputs
                                        let blockXml = `<block type="${opcode}" x="${baseX}" y="${baseY + (i * 80)}">`;
                                        
                                        // Add shadow blocks based on block type using Scratch's official XML structure
                                        if (opcode === 'data_setvariableto' && blockDescription.includes('score to 0')) {
                                            blockXml += `<field name="VARIABLE">score</field>`;
                                            blockXml += `<value name="VALUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value>`;
                                        }
                                        else if (opcode === 'control_wait' && blockDescription.includes('2 secs')) {
                                            blockXml += `<value name="DURATION"><shadow type="math_positive_number"><field name="NUM">2</field></shadow></value>`;
                                        }
                                        else if (opcode === 'data_changevariableby' && blockDescription.includes('score by 1')) {
                                            blockXml += `<field name="VARIABLE">score</field>`;
                                            blockXml += `<value name="VALUE"><shadow type="math_number"><field name="NUM">1</field></shadow></value>`;
                                        }
                                        else if (opcode === 'control_create_clone_of') {
                                            // Use shadow menu block exactly like Scratch's toolbox
                                            blockXml += `<value name="CLONE_OPTION"><shadow type="control_create_clone_of_menu"/></value>`;
                                        }
                                        else if (opcode === 'sound_playuntildone') {
                                            // Use shadow menu block exactly like Scratch's toolbox
                                            blockXml += `<value name="SOUND_MENU"><shadow type="sound_sounds_menu"/></value>`;
                                        }
                                        else if (opcode === 'motion_goto') {
                                            // Use shadow menu block exactly like Scratch's toolbox
                                            blockXml += `<value name="TO"><shadow type="motion_goto_menu"/></value>`;
                                        }
                                        
                                        blockXml += '</block>';
                                        
                                        console.log(`Creating block with XML: ${blockXml}`);
                                        
                                        // Parse XML and create block
                                        const xmlElement = new DOMParser().parseFromString(blockXml, 'text/xml').documentElement;
                                        const newBlock = ScratchBlocks.Xml.domToBlock(xmlElement, workspace);
                                        
                                        if (!newBlock) {
                                            console.error(`Failed to create block with opcode: ${opcode}`);
                                            continue;
                                        }
                                        
                                        console.log(`Created Blockly block: ${opcode} with ID: ${newBlock.id}`);
                                        createdBlocks.push(newBlock);
                                        
                                        // Connect to previous block if it exists
                                        if (previousBlock && previousBlock.nextConnection && newBlock.previousConnection) {
                                            try {
                                                previousBlock.nextConnection.connect(newBlock.previousConnection);
                                                console.log(`Connected block ${i} to block ${i + 1}`);
                                            } catch (error) {
                                                console.warn(`Could not connect blocks ${i} and ${i + 1}:`, error);
                                            }
                                        }
                                        
                                        previousBlock = newBlock;
                                        
                                    } catch (error) {
                                        console.error(`Error creating block ${i + 1}:`, error);
                                        continue;
                                    }
                                }

                                if (createdBlocks.length === 0) {
                                    console.error('No blocks were created successfully');
                                    return;
                                }

                                // Connect blocks AFTER all blocks are created and initialized
                                for (let i = 0; i < createdBlocks.length - 1; i++) {
                                    const currentBlock = createdBlocks[i];
                                    const nextBlock = createdBlocks[i + 1];
                                    
                                    try {
                                        if (currentBlock.nextConnection && nextBlock.previousConnection) {
                                            currentBlock.nextConnection.connect(nextBlock.previousConnection);
                                            console.log(`Connected block ${i + 1} to block ${i + 2}`);
                                        }
                                    } catch (error) {
                                        console.warn(`Could not connect blocks ${i + 1} and ${i + 2}:`, error);
                                    }
                                }

                                // Handle special cases like forever loop substack
                                for (let i = 0; i < createdBlocks.length; i++) {
                                    const block = createdBlocks[i];
                                    const blockData = window.pendingBlockStack[i];
                                    
                                    // If this is a forever loop and has blocks after it, try to connect them as substack
                                    if (block.type === 'control_forever' && i + 1 < createdBlocks.length) {
                                        const nextBlock = createdBlocks[i + 1];
                                        try {
                                            // Get the SUBSTACK input of the forever block
                                            const substackInput = block.getInput('SUBSTACK');
                                            if (substackInput && substackInput.connection && nextBlock.previousConnection) {
                                                nextBlock.previousConnection.connect(substackInput.connection);
                                                console.log('Connected block to forever loop substack');
                                            }
                                        } catch (error) {
                                            console.warn('Could not connect to forever loop substack:', error);
                                        }
                                    }
                                }

                                // Refresh the workspace
                                workspace.render();
                                
                                console.log(`✅ Successfully created stack with ${createdBlocks.length} blocks after variable creation`);
                                window.pendingBlockStack = null;
                                
                            }
                        }, 200); // Increased delay to ensure variable is fully created
                    };
                    
                    // This triggers the exact same modal as "Make a Variable"
                    console.log(`🎯 Calling workspace.createVariable...`);
                    workspace.createVariable(variableName, '', null, false, callback);
                    
                    // Add a fallback timer in case the callback doesn't work
                    setTimeout(() => {
                        if (window.pendingBlockStack) {
                            console.log(`⚠️ Callback may not have worked, trying fallback...`);
                            console.log(`🎯 Pending blocks still exist:`, window.pendingBlockStack);
                            
                            // Try to add blocks directly
                            const workspace = getBlocklyWorkspace();
                            if (workspace) {
                                console.log(`🎯 Using fallback to add blocks...`);
                                addBlocksToWorkspace(window.pendingBlockStack, vm);
                                window.pendingBlockStack = null;
                            }
                        }
                    }, 3000); // 3 second fallback
                }
                
                return true; // Return early, blocks will be added after modal
            }
        }
        
        // If no variables needed, add blocks directly
        return addBlocksToWorkspace(blockDescriptions, vm);
        
    } catch (error) {
        console.error('Error in addStackToWorkspace:', error);
        return false;
    }
};

// Helper function to actually add the blocks to workspace
const addBlocksToWorkspace = (blockDescriptions, vm) => {
    console.log(`🎯 addBlocksToWorkspace called with ${blockDescriptions.length} blocks`);
    console.log(`🎯 Block descriptions:`, blockDescriptions);
    
    try {
        // Get the current target (sprite)
        const target = vm.editingTarget;
        if (!target) {
            console.error('No editing target found');
            return false;
        }

        // Get the Blockly workspace from the GUI
        const workspace = getBlocklyWorkspace();
        if (!workspace) {
            console.error('Could not find Blockly workspace');
            return false;
        }
        
        console.log(`🎯 Found workspace and target, proceeding with block creation...`);

        const createdBlocks = [];
        let previousBlock = null;

        // Get existing blocks to determine positioning
        const existingBlocks = workspace.getAllBlocks(false);
        const topLevelBlocks = existingBlocks.filter(block => !block.getParent());
        
        // Calculate position based on existing blocks
        let baseX = 100;
        let baseY = 100;
        
        if (topLevelBlocks.length > 0) {
            // Find the rightmost position of existing blocks
            const maxX = Math.max(...topLevelBlocks.map(block => block.getRelativeToSurfaceXY().x));
            baseX = maxX + 250; // Position to the right
            baseY = 100;
        }

        // Create each block in the stack
        for (let i = 0; i < blockDescriptions.length; i++) {
            const blockData = blockDescriptions[i];
            const blockDescription = typeof blockData === 'string' ? blockData : blockData.code || blockData.name;
            console.log(`Creating block ${i + 1}/${blockDescriptions.length}:`, blockDescription);
            
            // Get the opcode
            const opcode = getOpcodeFromDescription(blockDescription);
            if (!opcode) {
                console.error(`No opcode found for block description: ${blockDescription}`);
                continue;
            }

            try {
                // Create block XML with proper values and shadow blocks for editable inputs
                let blockXml = `<block type="${opcode}" x="${baseX}" y="${baseY + (i * 80)}">`;
                
                // Add shadow blocks based on block type using Scratch's official XML structure
                if (opcode === 'data_setvariableto' && blockDescription.includes('score to 0')) {
                    blockXml += `<field name="VARIABLE">score</field>`;
                    blockXml += `<value name="VALUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value>`;
                }
                else if (opcode === 'control_wait' && blockDescription.includes('2 secs')) {
                    blockXml += `<value name="DURATION"><shadow type="math_positive_number"><field name="NUM">2</field></shadow></value>`;
                }
                else if (opcode === 'data_changevariableby' && blockDescription.includes('score by 1')) {
                    blockXml += `<field name="VARIABLE">score</field>`;
                    blockXml += `<value name="VALUE"><shadow type="math_number"><field name="NUM">1</field></shadow></value>`;
                }
                else if (opcode === 'control_create_clone_of') {
                    // Use shadow menu block exactly like Scratch's toolbox
                    blockXml += `<value name="CLONE_OPTION"><shadow type="control_create_clone_of_menu"/></value>`;
                }
                else if (opcode === 'sound_playuntildone') {
                    // Use shadow menu block exactly like Scratch's toolbox
                    blockXml += `<value name="SOUND_MENU"><shadow type="sound_sounds_menu"/></value>`;
                }
                else if (opcode === 'motion_goto') {
                    // Use shadow menu block exactly like Scratch's toolbox
                    blockXml += `<value name="TO"><shadow type="motion_goto_menu"/></value>`;
                }
                
                blockXml += '</block>';
                
                console.log(`Creating block with XML: ${blockXml}`);
                
                // Parse XML and create block
                const xmlElement = new DOMParser().parseFromString(blockXml, 'text/xml').documentElement;
                const newBlock = ScratchBlocks.Xml.domToBlock(xmlElement, workspace);
                
                if (!newBlock) {
                    console.error(`Failed to create block with opcode: ${opcode}`);
                    continue;
                }
                
                console.log(`Created Blockly block: ${opcode} with ID: ${newBlock.id}`);



                                            // Handle variable creation for score variable only
                            console.log(`🔍 Checking block: ${opcode} - "${blockDescription}"`);
                            if ((opcode === 'data_setvariableto' && blockDescription.includes('score to 0')) || 
                                (opcode === 'data_changevariableby' && blockDescription.includes('score by 1'))) {
                                
                                                                console.log(`🎯 VARIABLE CREATION TRIGGERED for opcode: ${opcode}`);
                                console.log(`📍 Starting variable creation process...`);
                                
                                try {
                        // Only create 'score' variable if it doesn't exist
                        let blocklyVariable = workspace.getVariable('score');
                        if (!blocklyVariable) {
                            try {
                                // First, create the variable in the VM (this is what's missing!)
                                const stage = vm.runtime.getTargetForStage();
                                const variableName = 'score';
                                
                                // Check if variable already exists in VM
                                const existingVariable = stage.lookupVariableByNameAndType(variableName, '', true);
                                let vmVariable;
                                
                                if (!existingVariable) {
                                    // Create variable in VM using the proper method
                                    vmVariable = vm.runtime.createNewGlobalVariable(variableName);
                                    console.log(`Created VM variable: ${variableName} with ID: ${vmVariable.id}`);
                                } else {
                                    vmVariable = existingVariable;
                                    console.log(`Using existing VM variable: ${variableName}`);
                                    console.log(`📍 Existing variable object:`, vmVariable);
                                    console.log(`📍 Variable ID:`, vmVariable.id);
                                    console.log(`📍 Variable properties:`, Object.keys(vmVariable));
                                }
                                
                                // Now create the Blockly variable with the same ID
                                blocklyVariable = workspace.createVariable(variableName, '', vmVariable.id, false);
                                console.log(`Created Blockly variable: ${variableName} with ID: ${blocklyVariable.getId()}`);
                                
                                // Automatically tick the checkbox for this variable to show it on stage
                                console.log(`📍 Getting variable ID...`);
                                
                                // Check if vmVariable exists and has an id
                                if (!vmVariable) {
                                    console.error(`❌ vmVariable is null or undefined`);
                                    return;
                                }
                                
                                if (!vmVariable.id) {
                                    console.error(`❌ vmVariable.id is null or undefined`);
                                    console.log(`❌ vmVariable:`, vmVariable);
                                    return;
                                }
                                
                                const variableId = vmVariable.id;
                                console.log(`📍 Variable ID: ${variableId}`);
                                
                                // Debug: Check existing monitors
                                console.log(`Existing monitors:`, vm.runtime._monitorState ? vm.runtime._monitorState.size : 'no state');
                                if (vm.runtime._monitorState && vm.runtime._monitorState.size > 0) {
                                    console.log(`First monitor:`, vm.runtime._monitorState.first().toJS ? vm.runtime._monitorState.first().toJS() : vm.runtime._monitorState.first());
                                }
                                
                                // Create a monitor block in VM's monitorBlocks system
                                console.log(`📍 Creating monitor block...`);
                                const monitorBlock = {
                                    id: variableId,
                                    opcode: 'data_variable',
                                    inputs: {},
                                    fields: {
                                        VARIABLE: {
                                            name: 'VARIABLE',
                                            id: variableId,
                                            variableType: ''
                                        }
                                    },
                                    topLevel: true,
                                    next: null,
                                    parent: null,
                                    shadow: false,
                                    x: 0,
                                    y: 0,
                                    isMonitored: true, // Set as true immediately
                                    targetId: null
                                };
                                
                                // Add monitor block to VM
                                console.log(`📍 Adding monitor block to VM...`);
                                vm.runtime.monitorBlocks.createBlock(monitorBlock);
                                console.log(`Created monitor block for variable: ${variableName}`);
                                
                                // Verify the block was created properly
                                const createdBlock = vm.runtime.monitorBlocks.getBlock(variableId);
                                if (!createdBlock) {
                                    console.error(`Monitor block was not created properly for variable: ${variableName}`);
                                    return;
                                }
                                console.log(`Verified monitor block exists:`, createdBlock);
                                
                                // Now trigger the monitor creation through the VM's changeBlock method
                                // This simulates exactly what happens when you click the checkbox
                                setTimeout(() => {
                                    try {
                                        // Double-check the block exists before calling changeBlock
                                        const blockToChange = vm.runtime.monitorBlocks.getBlock(variableId);
                                        if (!blockToChange) {
                                            console.error(`Block not found for changeBlock: ${variableId}`);
                                            return;
                                        }
                                        console.log(`Found block for changeBlock:`, blockToChange);
                                        
                                        vm.runtime.monitorBlocks.changeBlock({
                                            id: variableId,
                                            element: 'checkbox',
                                            value: true
                                        });
                                        console.log(`Triggered monitor creation for variable: ${variableName}`);
                                        
                                        // Check if monitor was actually created in VM state
                                        setTimeout(() => {
                                            const monitorInState = vm.runtime._monitorState && vm.runtime._monitorState.get(variableId);
                                            if (monitorInState) {
                                                console.log(`✅ Monitor successfully created in VM state:`, monitorInState.toJS ? monitorInState.toJS() : monitorInState);
                                            } else {
                                                console.log(`❌ Monitor NOT found in VM state for ID: ${variableId}`);
                                                console.log(`Current monitor state size:`, vm.runtime._monitorState ? vm.runtime._monitorState.size : 'no state');
                                            }
                                        }, 100);
                                    } catch (changeBlockError) {
                                        console.error('Error in changeBlock:', changeBlockError);
                                        
                                        // Fallback: Try to manually create a monitor using VM's internal methods
                                        try {
                                            // Get the MonitorRecord constructor from an existing monitor
                                            let MonitorRecord = null;
                                            if (vm.runtime._monitorState && vm.runtime._monitorState.size > 0) {
                                                MonitorRecord = vm.runtime._monitorState.first().constructor;
                                            }
                                            
                                            if (MonitorRecord) {
                                                const monitorData = {
                                                    id: variableId,
                                                    spriteName: null,
                                                    targetId: null,
                                                    opcode: 'data_variable',
                                                    value: '0',
                                                    params: { VARIABLE: variableName },
                                                    mode: 'default',
                                                    sliderMin: 0,
                                                    sliderMax: 100,
                                                    isDiscrete: true,
                                                    x: 20, // Set initial position
                                                    y: 20, // Set initial position
                                                    width: 100, // Set initial width
                                                    height: 30, // Set initial height
                                                    visible: true // Ensure it's visible
                                                };
                                                
                                                vm.runtime.requestAddMonitor(MonitorRecord(monitorData));
                                                console.log(`Created monitor using fallback method for variable: ${variableName}`);
                                            } else {
                                                console.error('Could not find MonitorRecord constructor for fallback');
                                            }
                                        } catch (fallbackError) {
                                            console.error('Fallback monitor creation failed:', fallbackError);
                                        }
                                    }
                                }, 50);
                                
                                // Automatically set the checkbox as checked in the flyout
                                const flyout = workspace.getFlyout();
                                if (flyout && flyout.setCheckboxState) {
                                    flyout.setCheckboxState(variableId, true);
                                    console.log(`Set checkbox state to true for variable: ${variableName}`);
                                }
                                
                                // Force GUI updates to refresh the monitor display
                                setTimeout(() => {
                                    // Trigger workspace update to refresh toolbox
                                    if (vm.emitWorkspaceUpdate) {
                                        vm.emitWorkspaceUpdate();
                                    }
                                    
                                    // Force monitor state update by clearing comparison
                                    vm.runtime._prevMonitorState = null;
                                    
                                    // Emit targets update to refresh variable palette
                                    vm.emitTargetsUpdate(false);
                                    
                                    // Debug: Check if monitor was created
                                    console.log(`Monitor state after creation:`, vm.runtime._monitorState ? vm.runtime._monitorState.size : 'no state');
                                    if (vm.runtime._monitorState && vm.runtime._monitorState.has(variableId)) {
                                        const monitor = vm.runtime._monitorState.get(variableId);
                                        console.log(`Monitor found:`, monitor.toJS ? monitor.toJS() : monitor);
                                    } else {
                                        console.log(`Monitor not found in state for ID: ${variableId}`);
                                    }
                                    
                                    console.log(`GUI updates triggered for variable: ${variableName}`);
                                    
                                    // SIMPLE APPROACH: Try to directly trigger the checkbox state
                                    try {
                                        // Get the flyout and force the checkbox state
                                        const flyout = workspace.getFlyout();
                                        if (flyout && flyout.setCheckboxState) {
                                            console.log(`🔧 Directly setting checkbox state for ${variableId}`);
                                            flyout.setCheckboxState(variableId, true);
                                            
                                            // Force a workspace update to refresh the flyout
                                            workspace.refreshToolboxSelection_();
                                            console.log(`✅ Direct checkbox setting completed`);
                                        }
                                        
                                        // CORRECT APPROACH: Trigger the proper monitor update flow
                                        console.log(`🎯 CORRECT APPROACH: Triggering proper monitor update flow...`);
                                        try {
                                            // Get the current monitor state from VM
                                            const currentMonitorState = vm.runtime._monitorState;
                                            console.log(`🎯 Current VM monitor state:`, currentMonitorState ? currentMonitorState.size : 'no state');
                                            
                                            // Trigger the MONITORS_UPDATE event - this is what handleMonitorsUpdate listens for
                                            if (vm.emit) {
                                                vm.emit('MONITORS_UPDATE', currentMonitorState);
                                                console.log(`✅ Emitted MONITORS_UPDATE event`);
                                            }
                                            
                                            // Force a complete toolbox refresh
                                            setTimeout(() => {
                                                console.log(`🎯 Forcing toolbox refresh...`);
                                                try {
                                                    // Get the main workspace
                                                    const mainWorkspace = workspace;
                                                    if (mainWorkspace && mainWorkspace.updateToolbox) {
                                                        // Force toolbox update
                                                        mainWorkspace.updateToolbox();
                                                        console.log(`✅ Toolbox update triggered`);
                                                    }
                                                    
                                                    // Also try to refresh the toolbox selection
                                                    if (mainWorkspace && mainWorkspace.refreshToolboxSelection_) {
                                                        mainWorkspace.refreshToolboxSelection_();
                                                        console.log(`✅ Toolbox selection refreshed`);
                                                    }
                                                    
                                                    // Force a complete workspace refresh
                                                    if (vm.refreshWorkspace) {
                                                        vm.refreshWorkspace();
                                                        console.log(`✅ Workspace refreshed`);
                                                    }
                                                    
                                                } catch (toolboxError) {
                                                    console.error('Toolbox refresh failed:', toolboxError);
                                                }
                                            }, 100);
                                            
                                            // Force a complete GUI refresh
                                            setTimeout(() => {
                                                console.log(`🔄 Forcing GUI refresh...`);
                                                // Try to trigger a complete Redux state refresh
                                                if (window.dispatchEvent) {
                                                    window.dispatchEvent(new Event('resize'));
                                                    console.log(`✅ Dispatched resize event`);
                                                }
                                                
                                                // Try to access Redux store directly
                                                try {
                                                    console.log(`🔄 Attempting direct Redux access...`);
                                                    // Look for Redux store in common locations
                                                    const possibleStores = [
                                                        window.store,
                                                        window.__REDUX_DEVTOOLS_EXTENSION__,
                                                        document.querySelector('[data-reactroot]')?.__reactInternalInstance
                                                    ];
                                                    
                                                    console.log(`🔄 Possible Redux stores:`, possibleStores.filter(Boolean).length);
                                                    
                                                    // Try to find the store in the React component tree
                                                    const reactRoot = document.querySelector('[data-reactroot]');
                                                    if (reactRoot) {
                                                        console.log(`🔄 Found React root, attempting to trigger update...`);
                                                        // Force a React re-render
                                                        reactRoot.style.display = 'none';
                                                        setTimeout(() => {
                                                            reactRoot.style.display = '';
                                                            console.log(`✅ Forced React re-render`);
                                                        }, 10);
                                                    }
                                                } catch (reduxAccessError) {
                                                    console.error('Direct Redux access failed:', reduxAccessError);
                                                }
                                            }, 100);
                                            
                                            // NUCLEAR APPROACH: Manually create monitor element on stage
                                            setTimeout(() => {
                                                console.log(`☢️ NUCLEAR APPROACH: Creating monitor manually on stage...`);
                                                try {
                                                    // Find the stage area
                                                    const stageArea = document.querySelector('.stage_stage-wrapper_2bejr') || 
                                                                     document.querySelector('[class*="stage"]') ||
                                                                     document.querySelector('.monitor-overlay');
                                                    
                                                    if (stageArea) {
                                                        console.log(`☢️ Found stage area, creating monitor element...`);
                                                        
                                                        // Create a monitor-like element
                                                        const monitorElement = document.createElement('div');
                                                        monitorElement.style.cssText = `
                                                            position: absolute;
                                                            top: 20px;
                                                            left: 20px;
                                                            background: #ff8c1a;
                                                            color: white;
                                                            padding: 8px 12px;
                                                            border-radius: 4px;
                                                            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                                                            font-size: 12px;
                                                            font-weight: bold;
                                                            z-index: 1000;
                                                            border: 1px solid #e67e00;
                                                            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                                                            pointer-events: all;
                                                            cursor: pointer;
                                                        `;
                                                        monitorElement.innerHTML = `<div>score: 0</div>`;
                                                        monitorElement.setAttribute('data-monitor-id', variableId);
                                                        monitorElement.setAttribute('data-variable-name', variableName);
                                                        
                                                        // Add to stage
                                                        stageArea.appendChild(monitorElement);
                                                        console.log(`☢️ ✅ MANUAL MONITOR CREATED ON STAGE!`);
                                                        
                                                        // Also try to find and check the actual checkbox
                                                        setTimeout(() => {
                                                            console.log(`☢️ Looking for actual checkbox in variables panel...`);
                                                            const variablePanel = document.querySelector('[class*="variables"]') || 
                                                                                  document.querySelector('[class*="variable"]');
                                                            if (variablePanel) {
                                                                const checkboxes = variablePanel.querySelectorAll('input[type="checkbox"]');
                                                                console.log(`☢️ Found ${checkboxes.length} checkboxes in variables panel`);
                                                                
                                                                for (const checkbox of checkboxes) {
                                                                    const label = checkbox.closest('label') || checkbox.parentElement;
                                                                    if (label && label.textContent && label.textContent.includes('score')) {
                                                                        console.log(`☢️ Found score checkbox, checking it...`);
                                                                        checkbox.checked = true;
                                                                        checkbox.click();
                                                                        console.log(`☢️ ✅ Score checkbox checked!`);
                                                                        break;
                                                                    }
                                                                }
                                                            }
                                                        }, 500);
                                                        
                                                    } else {
                                                        console.log(`☢️ Could not find stage area`);
                                                    }
                                                } catch (nuclearError) {
                                                    console.error('Nuclear approach failed:', nuclearError);
                                                }
                                            }, 200);
                                            
                                        } catch (reduxError) {
                                            console.error('Redux update failed:', reduxError);
                                        }
                                        
                                        // ALTERNATIVE: Try to find and click the actual checkbox element
                                        setTimeout(() => {
                                            try {
                                                console.log(`🔍 Looking for checkbox element for variable: ${variableName}`);
                                                // Look for checkbox elements in the variables category
                                                const checkboxes = document.querySelectorAll('input[type="checkbox"]');
                                                console.log(`Found ${checkboxes.length} checkboxes on page`);
                                                
                                                for (const checkbox of checkboxes) {
                                                    // Look for checkbox near variable name
                                                    const parentElement = checkbox.closest('[data-id]') || checkbox.parentElement;
                                                    if (parentElement && parentElement.textContent && parentElement.textContent.includes(variableName)) {
                                                        console.log(`🎯 Found checkbox for ${variableName}, clicking it`);
                                                        checkbox.checked = true;
                                                        checkbox.click();
                                                        console.log(`✅ Checkbox clicked for ${variableName}`);
                                                        break;
                                                    }
                                                }
                                            } catch (checkboxError) {
                                                console.error('Checkbox clicking failed:', checkboxError);
                                            }
                                        }, 500);
                                        
                                    } catch (directError) {
                                        console.error('Direct checkbox setting failed:', directError);
                                    }
                                }, 100);
                            } catch (error) {
                                console.error('Error creating variable in Blockly workspace:', error);
                            }
                                                        } else {
                                    console.log(`Using existing variable: score`);
                                    console.log(`📍 Variable exists, proceeding to monitor creation...`);
                                }
                                                    } catch (variableError) {
                                    console.error(`❌ ERROR in variable creation for block ${opcode}:`, variableError);
                                    console.error(`❌ Error stack:`, variableError.stack);
                                }
                }

                // Initialize and render the block FULLY before connecting
                try {
                    newBlock.initSvg();
                    newBlock.render();
                    
                    // Force field initialization for dropdown blocks
                    if (opcode === 'control_create_clone_of' || 
                        opcode === 'sound_playuntildone' || 
                        opcode === 'motion_goto') {
                        // Trigger field initialization by calling onchange
                        if (newBlock.onchange) {
                            newBlock.onchange();
                        }
                    }
                } catch (initError) {
                    console.warn(`Could not initialize block ${opcode}:`, initError);
                }

                createdBlocks.push(newBlock);
                
                console.log(`Block ${i + 1} created successfully, ID: ${newBlock.id}`);

            } catch (error) {
                console.error(`Error creating block ${i + 1}:`, error);
                continue;
            }
        }

        if (createdBlocks.length === 0) {
            console.error('No blocks were created successfully');
            return false;
        }

        // Connect blocks AFTER all blocks are created and initialized
        for (let i = 0; i < createdBlocks.length - 1; i++) {
            const currentBlock = createdBlocks[i];
            const nextBlock = createdBlocks[i + 1];
            
            try {
                if (currentBlock.nextConnection && nextBlock.previousConnection) {
                    currentBlock.nextConnection.connect(nextBlock.previousConnection);
                    console.log(`Connected block ${i + 1} to block ${i + 2}`);
                }
            } catch (error) {
                console.warn(`Could not connect blocks ${i + 1} and ${i + 2}:`, error);
            }
        }

        // Handle special cases like forever loop substack
        for (let i = 0; i < createdBlocks.length; i++) {
            const block = createdBlocks[i];
            const blockData = blockDescriptions[i];
            
            // If this is a forever loop and has blocks after it, try to connect them as substack
            if (block.type === 'control_forever' && i + 1 < createdBlocks.length) {
                const nextBlock = createdBlocks[i + 1];
                try {
                    // Get the SUBSTACK input of the forever block
                    const substackInput = block.getInput('SUBSTACK');
                    if (substackInput && substackInput.connection && nextBlock.previousConnection) {
                        nextBlock.previousConnection.connect(substackInput.connection);
                        console.log('Connected block to forever loop substack');
                    }
                } catch (error) {
                    console.warn('Could not connect to forever loop substack:', error);
                }
            }
        }

        // Refresh the workspace
        workspace.render();
        
        console.log(`Created stack with ${createdBlocks.length} blocks`);
        return true;
        
    } catch (error) {
        console.error('Error adding blocks to workspace:', error);
        return false;
    }
};

// Helper function to get block inputs based on description
const getBlockInputs = (description) => {
    const inputs = {};
    
    // Motion blocks with numeric inputs
    if (description.includes('move') && description.includes('steps')) {
        const steps = extractNumber(description) || 10;
        const shadowBlockId = generateBlockId();
        inputs.STEPS = {
            name: 'STEPS',
            block: shadowBlockId,
            shadow: shadowBlockId
        };
        // Create the shadow block
        createShadowBlock(shadowBlockId, 'math_number', { NUM: steps });
    }
    
    if (description.includes('turn') && (description.includes('right') || description.includes('left'))) {
        const degrees = extractNumber(description) || 15;
        const shadowBlockId = generateBlockId();
        inputs.DEGREES = {
            name: 'DEGREES',
            block: shadowBlockId,
            shadow: shadowBlockId
        };
        // Create the shadow block
        createShadowBlock(shadowBlockId, 'math_number', { NUM: degrees });
    }
    
    if (description.includes('go to x:') && description.includes('y:')) {
        const coords = extractCoordinates(description);
        const xShadowId = generateBlockId();
        const yShadowId = generateBlockId();
        
        inputs.X = {
            name: 'X',
            block: xShadowId,
            shadow: xShadowId
        };
        inputs.Y = {
            name: 'Y',
            block: yShadowId,
            shadow: yShadowId
        };
        
        // Create the shadow blocks
        createShadowBlock(xShadowId, 'math_number', { NUM: coords.x || 0 });
        createShadowBlock(yShadowId, 'math_number', { NUM: coords.y || 0 });
    }
    
    if (description.includes('glide') && description.includes('secs')) {
        const secs = extractNumber(description) || 1;
        const shadowBlockId = generateBlockId();
        inputs.SECS = {
            name: 'SECS',
            block: shadowBlockId,
            shadow: shadowBlockId
        };
        // Create the shadow block
        createShadowBlock(shadowBlockId, 'math_number', { NUM: secs });
    }
    
    // Goto blocks
    if (description.includes('go to random position')) {
        const shadowBlockId = generateBlockId();
        inputs.TO = {
            name: 'TO',
            block: shadowBlockId,
            shadow: shadowBlockId
        };
        // Create the shadow block for random position
        createShadowBlock(shadowBlockId, 'motion_goto_menu', { 
            TO: '_random_'
        });
    }
    
    // Control blocks with numeric inputs
    if (description.includes('wait') && (description.includes('seconds') || description.includes('secs'))) {
        const secs = extractNumber(description) || 1;
        const shadowBlockId = generateBlockId();
        inputs.DURATION = {
            name: 'DURATION',
            block: shadowBlockId,
            shadow: shadowBlockId
        };
        // Create the shadow block
        createShadowBlock(shadowBlockId, 'math_number', { NUM: secs });
    }
    
    // Variable blocks with numeric inputs
    if (description.includes('set') && description.includes('to')) {
        const value = extractNumber(description) || 0;
        const shadowBlockId = generateBlockId();
        inputs.VALUE = {
            name: 'VALUE',
            block: shadowBlockId,
            shadow: shadowBlockId
        };
        // Create the shadow block
        createShadowBlock(shadowBlockId, 'math_number', { NUM: value });
    }
    
    if (description.includes('change') && description.includes('by')) {
        const value = extractNumber(description) || 1;
        const shadowBlockId = generateBlockId();
        inputs.VALUE = {
            name: 'VALUE',
            block: shadowBlockId,
            shadow: shadowBlockId
        };
        // Create the shadow block
        createShadowBlock(shadowBlockId, 'math_number', { NUM: value });
    }
    
    // Clone blocks
    if (description.includes('create clone of')) {
        const target = extractCloneTarget(description);
        const shadowBlockId = generateBlockId();
        inputs.CLONE_OPTION = {
            name: 'CLONE_OPTION',
            block: shadowBlockId,
            shadow: shadowBlockId
        };
        // Create the shadow block with proper field structure
        createShadowBlock(shadowBlockId, 'control_create_clone_of_menu', { 
            CLONE_OPTION: target
        });
    }
    
    // Sound blocks
    if (description.includes('play sound') || description.includes('play pop sound')) {
        const soundName = extractSoundName(description);
        const shadowBlockId = generateBlockId();
        inputs.SOUND_MENU = {
            name: 'SOUND_MENU',
            block: shadowBlockId,
            shadow: shadowBlockId
        };
        // Create the shadow block for sound selection
        createShadowBlock(shadowBlockId, 'sound_sounds_menu', { 
            SOUND_MENU: soundName
        });
    }
    
    // Looks blocks with text inputs
    if (description.includes('say') && description.includes('for')) {
        const text = extractText(description) || 'Hello';
        const secs = extractNumber(description) || 2;
        
        const textShadowId = generateBlockId();
        const secsShadowId = generateBlockId();
        
        inputs.MESSAGE = {
            name: 'MESSAGE',
            block: textShadowId,
            shadow: textShadowId
        };
        inputs.SECS = {
            name: 'SECS',
            block: secsShadowId,
            shadow: secsShadowId
        };
        
        // Create the shadow blocks
        createShadowBlock(textShadowId, 'text', { TEXT: text });
        createShadowBlock(secsShadowId, 'math_number', { NUM: secs });
    }
    
    if (description.includes('wait') && description.includes('secs')) {
        const secs = extractNumber(description) || 1;
        const shadowBlockId = generateBlockId();
        inputs.DURATION = {
            name: 'DURATION',
            block: shadowBlockId,
            shadow: shadowBlockId
        };
        // Create the shadow block
        createShadowBlock(shadowBlockId, 'math_number', { NUM: secs });
    }
    
    // Control blocks (loops, conditionals)
    if (description.includes('repeat') && description.includes('times')) {
        const times = extractNumber(description) || 10;
        const shadowBlockId = generateBlockId();
        inputs.TIMES = {
            name: 'TIMES',
            block: shadowBlockId,
            shadow: shadowBlockId
        };
        // Create the shadow block
        createShadowBlock(shadowBlockId, 'math_number', { NUM: times });
    }
    
    if (description.includes('forever')) {
        // Forever blocks don't have inputs
    }
    
    if (description.includes('if') && description.includes('then')) {
        // If blocks need a condition input
        const conditionShadowId = generateBlockId();
        inputs.CONDITION = {
            name: 'CONDITION',
            block: conditionShadowId,
            shadow: conditionShadowId
        };
        // Create a default boolean condition
        createShadowBlock(conditionShadowId, 'sensing_touchingobject', { TOUCHINGOBJECT: '_mouse_' });
    }
    

    
    if (description.includes('go to random position')) {
        // Random position blocks don't need inputs
    }
    
    return inputs;
};

// Helper function to create shadow blocks
const createShadowBlock = (blockId, opcode, fields) => {
    // Store shadow block data for later creation
    if (!window.shadowBlockCache) {
        window.shadowBlockCache = {};
    }
    
    // Handle different field structures
    let processedFields = fields;
    if (typeof fields === 'object' && fields !== null) {
        // If fields is already in the correct format, use it as is
        if (Object.keys(fields).length > 0 && fields[Object.keys(fields)[0]].hasOwnProperty('name')) {
            processedFields = fields;
        } else {
            // Convert simple field format to proper format
            processedFields = {};
            Object.keys(fields).forEach(key => {
                processedFields[key] = {
                    name: key,
                    value: fields[key]
                };
            });
        }
    }
    
    window.shadowBlockCache[blockId] = {
        opcode: opcode,
        fields: processedFields
    };
};

// Helper function to get block fields based on description
const getBlockFields = (description) => {
    const fields = {};
    
    // Event blocks with dropdown fields
    if (description.includes('when key') && description.includes('pressed')) {
        const key = extractKey(description) || 'space';
        fields.KEY_OPTION = {
            name: 'KEY_OPTION',
            value: key
        };
    }
    
    // Variable blocks
    if (description.includes('set') && description.includes('to')) {
        const variableName = extractVariableName(description);
        fields.VARIABLE = {
            name: 'VARIABLE',
            value: variableName || 'score'
        };
    }
    
    if (description.includes('change') && description.includes('by')) {
        const variableName = extractVariableName(description);
        fields.VARIABLE = {
            name: 'VARIABLE',
            value: variableName || 'score'
        };
    }
    
    return fields;
};

// Helper functions to extract values from descriptions
const extractNumber = (text) => {
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1]) : null;
};

const extractText = (text) => {
    const match = text.match(/say\s+(.+?)\s+for/);
    return match ? match[1].trim() : null;
};

const extractCoordinates = (text) => {
    const xMatch = text.match(/x:\s*(\d+)/);
    const yMatch = text.match(/y:\s*(\d+)/);
    return {
        x: xMatch ? parseInt(xMatch[1]) : 0,
        y: yMatch ? parseInt(yMatch[1]) : 0
    };
};

const extractKey = (text) => {
    const match = text.match(/key\s+(.+?)\s+pressed/);
    return match ? match[1].trim() : 'space';
};

const extractVariableName = (text) => {
    // Extract variable name from "set score to 0" or "change score by 1"
    const setMatch = text.match(/set\s+(.+?)\s+to/);
    const changeMatch = text.match(/change\s+(.+?)\s+by/);
    const variableName = (setMatch ? setMatch[1] : changeMatch ? changeMatch[1] : null);
    return variableName ? variableName.trim() : null;
};

const extractCloneTarget = (text) => {
    // Extract clone target from "create clone of balloon" or similar
    const match = text.match(/create clone of\s+(.+)/);
    if (match) {
        const target = match[1].trim();
        // Map common targets to VM values
        if (target === 'balloon' || target === 'balloonballoon v') {
            return '_myself_'; // Clone the current sprite
        }
        return target;
    }
    return '_myself_'; // Default to current sprite
};

const extractSoundName = (text) => {
    // Extract sound name from "play pop sound" or similar
    const match = text.match(/play\s+(.+?)\s+sound/);
    if (match) {
        const soundName = match[1].trim();
        // Map common sound names to VM values
        if (soundName === 'pop') {
            return 'pop'; // This should match the actual sound name in the project
        }
        return soundName;
    }
    return 'pop'; // Default to pop sound
};

// Helper function to generate a unique block ID
const generateBlockId = () => {
    return 'block_' + Math.random().toString(36).substr(2, 9);
};

// Helper function to create variables if they don't exist
const createVariableIfNeeded = (vm, variableName) => {
    try {
        const target = vm.editingTarget;
        if (!target) return;

        // Check if variable already exists by name (check both local and global)
        let existingVariable = Object.values(target.variables).find(v => v.name === variableName);
        
        // Always check global variables on stage (since we're creating global variables)
        if (!existingVariable) {
            const stage = vm.runtime.getTargetForStage();
            existingVariable = Object.values(stage.variables).find(v => v.name === variableName);
        }
        
        if (existingVariable) {
            console.log(`Variable "${variableName}" already exists with ID: ${existingVariable.id}`);
            return existingVariable.id; // Return the existing variable ID
        }

        // Get the Blockly workspace from the GUI
        const workspace = getBlocklyWorkspace();
        if (!workspace) {
            console.error('Could not find Blockly workspace');
            return;
        }

        // Check if variable already exists in Blockly workspace
        const existingBlocklyVariable = workspace.getVariable(variableName);
        if (existingBlocklyVariable) {
            console.log(`Variable "${variableName}" already exists in Blockly workspace with ID: ${existingBlocklyVariable.getId()}`);
            return existingBlocklyVariable.getId();
        }

        // SIMULATE EXACT MANUAL VARIABLE CREATION FLOW
        console.log(`🎯 SIMULATING MANUAL VARIABLE CREATION...`);
        try {
            // This is exactly what happens when you click "Make a Variable"
            console.log(`Creating variable through Blockly workspace: ${variableName}`);
            const newVariable = workspace.createVariable(variableName);
            console.log(`✅ Created Blockly variable "${variableName}" with ID: ${newVariable.getId()}`);
            const variableId = newVariable.getId();
            
            // Now simulate the checkbox click to make it visible
            console.log(`🎯 Simulating checkbox click for variable...`);
            
            // Get the flyout and set the checkbox state
            const flyout = workspace.getFlyout();
            if (flyout && flyout.setCheckboxState) {
                console.log(`🔧 Setting checkbox state for ${variableId} to true`);
                flyout.setCheckboxState(variableId, true);
                
                // Force a workspace update to refresh the flyout
                workspace.refreshToolboxSelection_();
                console.log(`✅ Checkbox state set successfully`);
            }
            
            // Also trigger the VM's changeBlock method to create the monitor
            setTimeout(() => {
                console.log(`🎯 Triggering VM changeBlock for monitor creation...`);
                try {
                    vm.runtime.monitorBlocks.changeBlock({
                        id: variableId,
                        element: 'checkbox',
                        value: true
                    });
                    console.log(`✅ VM changeBlock completed`);
                    
                    // Force a complete refresh
                    if (vm.emitWorkspaceUpdate) {
                        vm.emitWorkspaceUpdate();
                    }
                    if (vm.refreshWorkspace) {
                        vm.refreshWorkspace();
                    }
                    
                } catch (changeBlockError) {
                    console.error('Error in changeBlock:', changeBlockError);
                }
            }, 100);
            
            return variableId;
        } catch (createError) {
            console.error('Error creating variable:', createError);
            return null;
        }
        
        // Notify the GUI about the new variable
        if (vm.emitWorkspaceUpdate) {
            vm.emitWorkspaceUpdate();
        }
        
        // Also try to trigger a variables update
        if (vm.runtime && vm.runtime.emitProjectChanged) {
            vm.runtime.emitProjectChanged();
        }
        
        // Trigger the proper variable creation event for global variables
        if (vm.runtime && vm.runtime.blocks) {
            // Get the actual variable ID from the created variable
            const actualVariableId = (() => {
                if (typeof variableId === 'string') return variableId;
                const stage = vm.runtime.getTargetForStage();
                const existingVar = Object.values(stage.variables).find(v => v.name === variableName);
                return existingVar ? existingVar.id : 'temp_id';
            })();
            
            vm.runtime.blocks.emit('var_create', {
                varId: actualVariableId,
                varName: variableName,
                varType: '',
                isLocal: false, // Global variable
                isCloud: false
            });
        }
        
        // Force a refresh of the variables panel
        setTimeout(() => {
            // Debug: Check if variable was actually created
            const stage = vm.runtime.getTargetForStage();
            const createdVar = Object.values(stage.variables).find(v => v.name === variableName);
            console.log(`After creation - Variable "${variableName}" exists:`, !!createdVar, createdVar ? createdVar.id : 'not found');
            
            if (vm.emitWorkspaceUpdate) {
                vm.emitWorkspaceUpdate();
            }
            if (vm.runtime && vm.runtime.emitProjectChanged) {
                vm.runtime.emitProjectChanged();
            }
            
            // Force a complete workspace refresh
            if (vm.refreshWorkspace) {
                vm.refreshWorkspace();
            }
            
            // Try to trigger the variable manager's fullReload function
            try {
                // Dispatch a Redux action to trigger variable manager update
                if (window.addon && window.addon.tab && window.addon.tab.redux) {
                    window.addon.tab.redux.dispatch({ 
                        type: "scratch-gui/navigation/ACTIVATE_TAB", 
                        activeTabIndex: 3 
                    });
                    setTimeout(() => {
                        // Switch back to scripts tab
                        window.addon.tab.redux.dispatch({ 
                            type: "scratch-gui/navigation/ACTIVATE_TAB", 
                            activeTabIndex: 0 
                        });
                    }, 100);
                }
            } catch (e) {
                console.log('Could not trigger variable manager reload:', e);
            }
        }, 100);
        
        return null; // Return null if no variable was created
        
    } catch (error) {
        console.error('Error creating variable:', error);
        return null;
    }
};

// Helper function to get the Blockly workspace
const getBlocklyWorkspace = () => {
    // Try to get workspace from global Blockly
    if (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace) {
        return Blockly.getMainWorkspace();
    }
    
    // Try to get workspace from window
    if (window.ScratchBlocks && window.ScratchBlocks.getMainWorkspace) {
        return window.ScratchBlocks.getMainWorkspace();
    }
    
    // Try to find workspace in the DOM
    const workspaceElement = document.querySelector('[data-id="workspace"]');
    if (workspaceElement && workspaceElement.workspace) {
        return workspaceElement.workspace;
    }
    
    return null;
};

// Helper function to get opcode from block description
const getOpcodeFromDescription = (description) => {
    const opcodeMap = {
        'when green flag clicked': 'event_whenflagclicked',
        'when this sprite clicked': 'event_whenthisspriteclicked',
        'when key space pressed': 'event_whenkeypressed',
        'when I start as a clone': 'control_start_as_clone',
        'move 10 steps': 'motion_movesteps',
        'turn right 15 degrees': 'motion_turnright',
        'turn left 15 degrees': 'motion_turnleft',
        'go to x: 0 y: 0': 'motion_gotoxy',
        'glide 1 secs to x: 0 y: 0': 'motion_glideto',
        'say Hello for 2 secs': 'looks_sayforsecs',
        'say Hello': 'looks_say',
        'think Hmm for 2 secs': 'looks_thinkforsecs',
        'switch costume to costume1': 'looks_switchcostumeto',
        'next costume': 'looks_nextcostume',
        'hide': 'looks_hide',
        'show': 'looks_show',
        'play sound until done': 'sound_playuntildone',
        'start sound': 'sound_play',
        'change pitch by 10': 'sound_changeeffectby',
        'wait 1 secs': 'control_wait',
        'repeat 10': 'control_repeat',
        'forever': 'control_forever',
        'if <> then': 'control_if',
        'wait until <>': 'control_wait_until',
        'touching mouse pointer?': 'sensing_touchingobject',
        'touching edge?': 'sensing_touchingobject',
        'set score to 0': 'data_setvariableto',
        'change score by 1': 'data_changevariableby'
    };

    // Try exact match first
    if (opcodeMap[description]) {
        return opcodeMap[description];
    }

    // Try partial matches for more flexible matching
    if (description.includes('move') && description.includes('steps')) {
        return 'motion_movesteps';
    }
    if (description.includes('turn right')) {
        return 'motion_turnright';
    }
    if (description.includes('turn left')) {
        return 'motion_turnleft';
    }
    if (description.includes('go to random position')) {
        return 'motion_goto';
    }
    if (description.includes('go to')) {
        return 'motion_goto';
    }
    if (description.includes('go to x:') && description.includes('y:')) {
        return 'motion_gotoxy';
    }
    if (description.includes('glide') && description.includes('secs')) {
        return 'motion_glideto';
    }
    if (description.includes('say') && description.includes('for')) {
        return 'looks_sayforsecs';
    }
    if (description.includes('say')) {
        return 'looks_say';
    }
    if (description.includes('think') && description.includes('for')) {
        return 'looks_thinkforsecs';
    }
    if (description.includes('think')) {
        return 'looks_think';
    }
    if (description.includes('wait') && description.includes('seconds')) {
        return 'control_wait';
    }
    if (description.includes('wait') && description.includes('secs')) {
        return 'control_wait';
    }
    if (description.includes('repeat') && description.includes('times')) {
        return 'control_repeat';
    }
    if (description.includes('repeat')) {
        return 'control_repeat';
    }
    if (description.includes('forever')) {
        return 'control_forever';
    }
    if (description.includes('if') && description.includes('then')) {
        return 'control_if';
    }
    if (description.includes('wait until')) {
        return 'control_wait_until';
    }
    if (description.includes('when I start as a clone')) {
        return 'control_start_as_clone';
    }
    if (description.includes('create clone of')) {
        return 'control_create_clone_of';
    }
    if (description.includes('create clone of balloon')) {
        return 'control_create_clone_of';
    }
    if (description.includes('delete this clone')) {
        return 'control_delete_this_clone';
    }
    if (description.includes('hide')) {
        return 'looks_hide';
    }
    if (description.includes('show')) {
        return 'looks_show';
    }
    if (description.includes('touching')) {
        return 'sensing_touchingobject';
    }
    if (description.includes('play sound') && description.includes('until done')) {
        return 'sound_playuntildone';
    }
    if (description.includes('play sound')) {
        return 'sound_play';
    }
    if (description.includes('play pop sound')) {
        return 'sound_playuntildone';
    }
    if (description.includes('set') && description.includes('to')) {
        return 'data_setvariableto';
    }
    if (description.includes('change') && description.includes('by')) {
        return 'data_changevariableby';
    }

    // Default fallback
    return 'motion_movesteps';
};

// Function to create a simple script (multiple blocks)
export const createScript = (blockDescriptions, vm, workspace) => {
    const blocks = [];
    
    for (const description of blockDescriptions) {
        const block = createBlockFromDescription(description, vm);
        if (block) {
            blocks.push(block);
        }
    }

    // Add all blocks to workspace
    let success = true;
    for (const block of blocks) {
        if (!addBlockToWorkspace(block, vm, workspace)) {
            success = false;
        }
    }

    return success;
};

// Common script templates
export const scriptTemplates = {
    'simple movement': [
        'when green flag clicked',
        'forever',
        'move 10 steps',
        'if on edge, bounce'
    ],
    'sprite interaction': [
        'when green flag clicked',
        'forever',
        'if touching mouse pointer? then',
        'say Hello for 2 secs'
    ],
    'score counter': [
        'when green flag clicked',
        'set score to 0',
        'forever',
        'if touching mouse pointer? then',
        'change score by 1',
        'wait 1 secs'
    ],
    'costume animation': [
        'when green flag clicked',
        'forever',
        'next costume',
        'wait 0.5 secs'
    ]
};
