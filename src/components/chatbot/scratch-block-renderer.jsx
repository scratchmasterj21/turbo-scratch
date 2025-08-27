import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './scratch-block-renderer.css';

// Scratch block colors by category
const blockColors = {
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

// Block shapes and styles
const blockShapes = {
    // Hat blocks (events)
    'when green flag clicked': 'hat',
    'when this sprite clicked': 'hat',
    'when key space pressed': 'hat',
    
    // Stack blocks (most blocks)
    'move 10 steps': 'stack',
    'turn right 15 degrees': 'stack',
    'turn left 15 degrees': 'stack',
    'go to x: 0 y: 0': 'stack',
    'glide 1 secs to x: 0 y: 0': 'stack',
    'say Hello for 2 secs': 'stack',
    'say Hello': 'stack',
    'think Hmm for 2 secs': 'stack',
    'switch costume to costume1': 'stack',
    'next costume': 'stack',
    'hide': 'stack',
    'show': 'stack',
    'play sound until done': 'stack',
    'start sound': 'stack',
    'change pitch by 10': 'stack',
    'wait 1 secs': 'stack',
    'repeat 10': 'stack',
    'forever': 'stack',
    'if <> then': 'stack',
    'wait until <>': 'stack',
    'touching mouse pointer?': 'reporter',
    'touching edge?': 'reporter',
    'set score to 0': 'stack',
    'change score by 1': 'stack'
};

const ScratchBlockRenderer = ({ block, onClick, showActions = true }) => {
    const blockText = block.code || block.name;
    const category = block.category || 'ai-generated';
    const color = blockColors[category] || blockColors['ai-generated'];
    const shape = blockShapes[blockText] || 'stack';
    
    const blockClass = classNames(
        styles.scratchBlock,
        styles[`block${shape.charAt(0).toUpperCase() + shape.slice(1)}`],
        { [styles.clickable]: onClick }
    );

    const blockStyle = {
        backgroundColor: color,
        borderColor: color
    };

    const renderBlockContent = () => {
        // Split multi-line blocks
        const lines = blockText.split('\n');
        
        if (lines.length === 1) {
            return (
                <div className={styles.blockText}>
                    {blockText}
                </div>
            );
        } else {
            return (
                <div className={styles.multiLineBlock}>
                    {lines.map((line, index) => (
                        <div key={index} className={styles.blockLine}>
                            {line}
                        </div>
                    ))}
                </div>
            );
        }
    };

    return (
        <div className={styles.blockContainer}>
            <div 
                className={blockClass}
                style={blockStyle}
                onClick={onClick}
            >
                {renderBlockContent()}
            </div>
            
            {showActions && (
                <div className={styles.blockActions}>
                    <button
                        className={styles.actionButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(blockText);
                        }}
                        title="Copy code"
                    >
                        📋
                    </button>
                    <button
                        className={styles.actionButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onClick) onClick();
                        }}
                        title="Add to workspace"
                    >
                        ➕
                    </button>
                </div>
            )}
            
            <div className={styles.blockCategory}>
                Category: {category}
            </div>
        </div>
    );
};

ScratchBlockRenderer.propTypes = {
    block: PropTypes.shape({
        name: PropTypes.string,
        code: PropTypes.string,
        category: PropTypes.string
    }).isRequired,
    onClick: PropTypes.func,
    showActions: PropTypes.bool
};

export default ScratchBlockRenderer;
