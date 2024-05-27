import React from 'react';

const Pipes = ({ pipePosition }) => {
    return (
        <div
            className="pipe"
            style={{
                left: `${pipePosition.x}px`,
                top: `${pipePosition.y}px`,
            }}
        ></div>
    );
};

export default Pipes;
