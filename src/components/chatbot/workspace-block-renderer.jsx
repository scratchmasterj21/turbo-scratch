import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './workspace-block-renderer.css';

const WorkspaceBlockRenderer = ({ block, vm, onBlockAdded }) => {
    const blockRef = useRef(null);
    const [blockElement, setBlockElement] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (!blockRef.current || !vm) return;

        // Get ScratchBlocks from the VM
        const ScratchBlocks = window.ScratchBlocks;
        if (!ScratchBlocks) {
            console.warn('ScratchBlocks not available');
            return;
        }

        // Get the main workspace
        const workspace = ScratchBlocks.getMainWorkspace();
        if (!workspace) {
            console.warn('Workspace not available');
            return;
        }

        try {
            // Create a real Scratch block
            const opcode = getOpcodeFromBlock(block);
            if (!opcode) {
                console.warn(`No opcode found for block: ${block.code}`);
                return;
            }

            const newBlock = workspace.newBlock(opcode);
            
            // Set block inputs and fields if available
            setBlockInputsAndFields(newBlock, block);
            
            // Render the block in our container
            const blockSvg = newBlock.createSvg();
            blockRef.current.innerHTML = '';
            blockRef.current.appendChild(blockSvg);
            
            setBlockElement(newBlock);

            // Make the block draggable
            makeBlockDraggable(newBlock, blockRef.current, workspace, vm, onBlockAdded);

        } catch (error) {
            console.error('Error creating Scratch block:', error);
        }
    }, [block, vm, onBlockAdded]);

    const makeBlockDraggable = (block, container, workspace, vm, onBlockAdded) => {
        let isDragging = false;
        let startX, startY;

        const handleMouseDown = (e) => {
            if (e.button !== 0) return; // Only left mouse button
            
            isDragging = true;
            setIsDragging(true);
            startX = e.clientX;
            startY = e.clientY;
            
            e.preventDefault();
            e.stopPropagation();
        };

        const handleMouseMove = (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            // Only start drag if moved more than 5 pixels
            if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                startDrag(block, workspace, vm, onBlockAdded);
                isDragging = false;
                setIsDragging(false);
            }
        };

        const handleMouseUp = () => {
            if (isDragging) {
                // Click without drag - add block directly
                addBlockToWorkspace(block, workspace, vm, onBlockAdded);
            }
            isDragging = false;
            setIsDragging(false);
        };

        container.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        // Cleanup
        return () => {
            container.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    };

    const startDrag = (block, workspace, vm, onBlockAdded) => {
        try {
            // Create a new block for dragging
            const dragBlock = workspace.newBlock(block.type);
            setBlockInputsAndFields(dragBlock, block);
            
            // Position the block at mouse position
            const mousePos = workspace.getMousePosition();
            dragBlock.moveBy(mousePos.x, mousePos.y);
            
            // Start the drag
            workspace.startDragWithFakeEvent({
                clientX: mousePos.x,
                clientY: mousePos.y,
                type: 'mousedown',
                stopPropagation: () => {},
                preventDefault: () => {},
                target: dragBlock.getSvgRoot()
            }, dragBlock);
            
            if (onBlockAdded) {
                onBlockAdded(block.code);
            }
        } catch (error) {
            console.error('Error starting drag:', error);
        }
    };

    const addBlockToWorkspace = (block, workspace, vm, onBlockAdded) => {
        try {
            // Create a new block in the workspace
            const newBlock = workspace.newBlock(block.type);
            setBlockInputsAndFields(newBlock, block);
            
            // Position it at a reasonable location
            const centerX = workspace.getWidth() / 2;
            const centerY = workspace.getHeight() / 2;
            newBlock.moveBy(centerX, centerY);
            
            if (onBlockAdded) {
                onBlockAdded(block.code);
            }
        } catch (error) {
            console.error('Error adding block to workspace:', error);
        }
    };

    const setBlockInputsAndFields = (block, blockData) => {
        // Set fields based on block data
        if (blockData.fields) {
            Object.keys(blockData.fields).forEach(fieldName => {
                const field = block.getField(fieldName);
                if (field) {
                    field.setValue(blockData.fields[fieldName]);
                }
            });
        }
    };

    const getOpcodeFromBlock = (block) => {
        const blockText = block.code || block.name;
        
        // Map block text to opcodes
        const opcodeMap = {
            'when green flag clicked': 'event_whenflagclicked',
            'when this sprite clicked': 'event_whenthisspriteclicked',
            'when key space pressed': 'event_whenkeypressed',
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

        return opcodeMap[blockText] || null;
    };

    return (
        <div className={styles.blockContainer}>
            <div 
                ref={blockRef}
                className={classNames(
                    styles.scratchBlockContainer,
                    { [styles.dragging]: isDragging }
                )}
                title="Click to add or drag to workspace"
            />
            <div className={styles.blockInfo}>
                <div className={styles.blockName}>{block.name}</div>
                <div className={styles.blockCategory}>Category: {block.category}</div>
            </div>
        </div>
    );
};

WorkspaceBlockRenderer.propTypes = {
    block: PropTypes.shape({
        name: PropTypes.string,
        code: PropTypes.string,
        category: PropTypes.string,
        fields: PropTypes.object
    }).isRequired,
    vm: PropTypes.object,
    onBlockAdded: PropTypes.func
};

export default WorkspaceBlockRenderer;
