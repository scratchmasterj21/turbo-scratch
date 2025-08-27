import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './simple-block-renderer.css';

const SimpleBlockRenderer = ({ block, vm, onBlockAdded }) => {
    const blockRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const getBlockColor = (category) => {
        const colors = {
            motion: '#4C97FF',
            looks: '#9966FF',
            sound: '#CF63CF',
            control: '#FFAB19',
            events: '#FFD500',
            sensing: '#4CBFE6',
            operators: '#40BF4A',
            variables: '#FF8C1A',
            lists: '#FF661A',
            'my-blocks': '#FF6680',
            'ai-generated': '#4C97FF',
            extracted: '#9966FF',
            script: '#FFD500'
        };
        return colors[category] || colors['ai-generated'];
    };

    const getBlockShape = (blockText) => {
        const hatBlocks = [
            'when green flag clicked',
            'when this sprite clicked',
            'when key space pressed'
        ];
        
        const reporterBlocks = [
            'touching mouse pointer?',
            'touching edge?'
        ];

        if (hatBlocks.includes(blockText)) return 'hat';
        if (reporterBlocks.includes(blockText)) return 'reporter';
        return 'stack';
    };

    const handleClick = () => {
        if (onBlockAdded) {
            onBlockAdded(block.code);
        }
    };

    const handleDragStart = (e) => {
        setIsDragging(true);
        
        // Set drag data with block information
        const dragData = {
            type: 'scratch-block',
            blockCode: block.code,
            blockName: block.name,
            category: block.category
        };
        e.dataTransfer.setData('application/json', JSON.stringify(dragData));
        e.dataTransfer.effectAllowed = 'copy';
        
        // Create a visual feedback
        const dragImage = blockRef.current.cloneNode(true);
        dragImage.style.opacity = '0.5';
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, 0, 0);
        
        setTimeout(() => {
            document.body.removeChild(dragImage);
        }, 0);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    const blockText = block.code || block.name;
    const category = block.category || 'ai-generated';
    const color = getBlockColor(category);
    const shape = getBlockShape(blockText);

    return (
        <div className={styles.blockContainer}>
            <div 
                ref={blockRef}
                className={classNames(
                    styles.scratchBlock,
                    styles[`block${shape.charAt(0).toUpperCase() + shape.slice(1)}`],
                    { [styles.dragging]: isDragging }
                )}
                style={{ backgroundColor: color, borderColor: color }}
                onClick={handleClick}
                draggable={true}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                title="Click to add or drag to workspace"
            >
                <div className={styles.blockText}>
                    {blockText}
                </div>
            </div>
            
            <div className={styles.blockInfo}>
                <div className={styles.blockName}>{block.name}</div>
                <div className={styles.blockCategory}>Category: {category}</div>
            </div>
        </div>
    );
};

SimpleBlockRenderer.propTypes = {
    block: PropTypes.shape({
        name: PropTypes.string,
        code: PropTypes.string,
        category: PropTypes.string
    }).isRequired,
    vm: PropTypes.object,
    onBlockAdded: PropTypes.func
};

export default SimpleBlockRenderer;
