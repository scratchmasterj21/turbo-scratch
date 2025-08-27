import React, { useEffect, useRef, useState } from 'react';
import './real-scratchblocks-renderer.css';

const RealScratchBlocksRenderer = ({ block, vm, onBlockAdded, isStack = false, stackBlocks = [] }) => {
    const blockRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [rendered, setRendered] = useState(false);

    useEffect(() => {
        if (blockRef.current && !rendered) {
            createRealScratchBlock();
        }
    }, [block, rendered]);

    const createRealScratchBlock = async () => {
        try {
            // Try to load scratchblocks if not already loaded
            if (typeof window.scratchblocks === 'undefined') {
                // Load scratchblocks from CDN
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/scratchblocks@3.6.2/build/scratchblocks-v3.6.2-min.js';
                script.onload = () => {
                    window.scratchblocks.loadLanguages(window.scratchblocksTranslations);
                    renderBlock();
                };
                script.onerror = () => {
                    console.error('Failed to load scratchblocks');
                    setRendered(true);
                };
                document.head.appendChild(script);
            } else {
                renderBlock();
            }
        } catch (error) {
            console.error('Error creating real Scratch block:', error);
            setRendered(true);
        }
    };

    const renderBlock = () => {
        try {
            if (!blockRef.current) return;

            // Convert block description to scratchblocks syntax
            const syntax = convertToScratchBlocksSyntax(block);
            
            // Render the block
            window.scratchblocks.renderMatching(blockRef.current, syntax, {
                style: 'scratch3',
                scale: 0.8
            });

            setRendered(true);
        } catch (error) {
            console.error('Error rendering block:', error);
            setRendered(true);
        }
    };

    const convertToScratchBlocksSyntax = (block) => {
        // Convert block description to scratchblocks syntax
        const blockText = block.name || block.code;
        
        // Basic conversion - you can expand this
        let syntax = blockText;
        
        // Convert common patterns
        syntax = syntax.replace(/move (\d+) steps/g, 'move ($1) steps');
        syntax = syntax.replace(/turn right (\d+) degrees/g, 'turn right ($1) degrees');
        syntax = syntax.replace(/turn left (\d+) degrees/g, 'turn left ($1) degrees');
        syntax = syntax.replace(/wait (\d+) seconds/g, 'wait ($1) secs');
        syntax = syntax.replace(/repeat (\d+) times/g, 'repeat ($1)');
        syntax = syntax.replace(/set (.+) to (\d+)/g, 'set [$1 v] to ($2)');
        syntax = syntax.replace(/change (.+) by (\d+)/g, 'change [$1 v] by ($2)');
        syntax = syntax.replace(/say (.+) for (\d+) seconds/g, 'say [$1 v] for ($2) secs');
        syntax = syntax.replace(/play (.+) sound/g, 'play sound [$1 v] until done');
        syntax = syntax.replace(/go to random position/g, 'go to [random position v]');
        syntax = syntax.replace(/create clone of (.+)/g, 'create clone of [$1 v]');
        syntax = syntax.replace(/delete this clone/g, 'delete this clone');
        syntax = syntax.replace(/when green flag clicked/g, 'when green flag clicked');
        syntax = syntax.replace(/when this sprite clicked/g, 'when this sprite clicked');
        syntax = syntax.replace(/if (.+) then/g, 'if <$1> then');
        syntax = syntax.replace(/forever/g, 'forever');
        syntax = syntax.replace(/hide/g, 'hide');
        syntax = syntax.replace(/show/g, 'show');
        
        return syntax;
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
            const blockCodes = stackBlocks.map(b => b.code || b.name);
            if (onBlockAdded) {
                onBlockAdded(blockCodes, true);
            }
        }
    };

    return (
        <div 
            className="real-scratch-block-container"
            style={{
                display: 'inline-block',
                margin: '4px',
                padding: '8px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                cursor: 'grab',
                userSelect: 'none',
                transition: 'all 0.2s ease',
                position: 'relative',
                zIndex: 1000
            }}
            draggable={true}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={handleClick}
            title={`Click to add or drag to workspace: ${block.name || block.code}`}
        >
            <div 
                ref={blockRef}
                className="scratchblocks-render"
                style={{
                    minHeight: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            />
            {!rendered && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '12px',
                    color: '#666'
                }}>
                    Loading...
                </div>
            )}
        </div>
    );
};

export default RealScratchBlocksRenderer;
