import React, { useState } from 'react';
import './scratchblocks-renderer.css';

const ScratchBlocksRenderer = ({ block, vm, onBlockAdded, isStack = false, stackBlocks = [] }) => {
    const [isDragging, setIsDragging] = useState(false);



    // Get the appropriate color for the block category
    const getBlockColor = (category) => {
        const colors = {
            'motion': '#4c97ff',
            'looks': '#9966ff',
            'sound': '#cf63cf',
            'control': '#ffab19',
            'events': '#ffbf00',
            'sensing': '#5cb1d6',
            'variables': '#ff8c1a',
            'operators': '#40bf4a'
        };
        return colors[category] || '#4c97ff';
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

    const handleStackClick = () => {
        if (isStack && stackBlocks.length > 0) {
            // Extract block codes from the stack
            const blockCodes = stackBlocks.map(b => b.code || b.name);
            if (onBlockAdded) {
                onBlockAdded(blockCodes, true); // true indicates it's a stack
            }
        }
    };

    return (
        <div 
            className="enhanced-scratch-block"
            style={{
                backgroundColor: getBlockColor(block.category),
                display: 'inline-block',
                padding: '12px 16px',
                borderRadius: '12px',
                color: 'white',
                cursor: 'grab',
                userSelect: 'none',
                transition: 'all 0.2s ease',
                boxShadow: '0 3px 6px rgba(0, 0, 0, 0.3)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                margin: '4px',
                fontSize: '14px',
                fontWeight: '500',
                minWidth: '140px',
                textAlign: 'center',
                position: 'relative',
                zIndex: 1000
            }}
            draggable={true}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={handleClick}
            title={`Click to add or drag to workspace: ${block.name || block.code}`}
        >
            <div className="block-content">
                <span className="block-text">
                    {block.name || block.code}
                </span>
            </div>
        </div>
    );
};

export default ScratchBlocksRenderer;
