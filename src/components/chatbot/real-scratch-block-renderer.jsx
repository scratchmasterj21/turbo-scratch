import React, { useEffect, useRef, useState } from 'react';
import './real-scratch-block-renderer.css';

const RealScratchBlockRenderer = ({ block, vm, onBlockAdded }) => {
    const blockRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (blockRef.current && block) {
            createEnhancedBlock();
        }
    }, [block]);

    const createEnhancedBlock = () => {
        try {
            // Create an enhanced CSS-based block that looks more like real Scratch blocks
            const blockElement = document.createElement('div');
            blockElement.className = 'enhanced-scratch-block';
            blockElement.setAttribute('data-category', block.category || 'motion');
            blockElement.draggable = true;
            
            // Create the block content
            const blockContent = document.createElement('div');
            blockContent.className = 'block-content';
            
            // Add block text
            const blockText = document.createElement('span');
            blockText.className = 'block-text';
            blockText.textContent = block.name || block.code;
            blockContent.appendChild(blockText);
            
            // Add input fields if the block has them
            if (block.code.includes('[') && block.code.includes(']')) {
                const inputMatch = block.code.match(/\[([^\]]+)\]/g);
                if (inputMatch) {
                    inputMatch.forEach((input, index) => {
                        const inputField = document.createElement('span');
                        inputField.className = 'block-input';
                        inputField.textContent = input.replace(/[\[\]]/g, '');
                        blockContent.appendChild(inputField);
                    });
                }
            }
            
            blockElement.appendChild(blockContent);
            
            // Add event listeners
            blockElement.addEventListener('dragstart', handleDragStart);
            blockElement.addEventListener('dragend', handleDragEnd);
            blockElement.addEventListener('click', handleClick);
            
            // Clear container and add the block
            if (blockRef.current) {
                blockRef.current.innerHTML = '';
                blockRef.current.appendChild(blockElement);
            }
        } catch (error) {
            console.error('Error creating enhanced block:', error);
            // Fallback to simple text display
            if (blockRef.current) {
                blockRef.current.innerHTML = `<div class="fallback-block">${block.name || block.code}</div>`;
            }
        }
    };

    const handleDragStart = (e) => {
        setIsDragging(true);
        
        // Set drag data
        const dragData = {
            type: 'scratch-block',
            blockCode: block.code,
            blockName: block.name,
            category: block.category,
            opcode: block.opcode
        };
        e.dataTransfer.setData('application/json', JSON.stringify(dragData));
        e.dataTransfer.effectAllowed = 'copy';
        
        // Add visual feedback
        e.target.style.opacity = '0.7';
        e.target.style.transform = 'scale(0.95)';
    };

    const handleDragEnd = (e) => {
        setIsDragging(false);
        
        // Remove visual feedback
        e.target.style.opacity = '1';
        e.target.style.transform = 'scale(1)';
    };

    const handleClick = () => {
        if (onBlockAdded) {
            onBlockAdded(block.code);
        }
    };

    return (
        <div 
            ref={blockRef}
            className={`real-scratch-block ${isDragging ? 'dragging' : ''}`}
            data-category={block.category || 'motion'}
            title={`Click to add or drag to workspace: ${block.name || block.code}`}
        />
    );
};

export default RealScratchBlockRenderer;
