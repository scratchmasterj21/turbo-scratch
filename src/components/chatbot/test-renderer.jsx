import React from 'react';

const TestRenderer = ({ block }) => {
    console.log('🧪 TestRenderer called with block:', block);
    
    return (
        <div 
            style={{
                display: 'inline-block !important',
                padding: '20px !important',
                margin: '10px !important',
                backgroundColor: 'red !important',
                color: 'white !important',
                border: '5px solid yellow !important',
                borderRadius: '20px !important',
                fontSize: '18px !important',
                fontWeight: 'bold !important',
                zIndex: '9999 !important',
                position: 'relative !important',
                width: '300px !important',
                height: '100px !important',
                overflow: 'visible !important',
                visibility: 'visible !important',
                opacity: '1 !important'
            }}
        >
            🧪 TEST BLOCK: {block?.name || block?.code || 'NO BLOCK DATA'}
        </div>
    );
};

export default TestRenderer;
