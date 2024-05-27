import React from 'react';

const Bird = React.forwardRef(({ birdPosition }, ref) => {
    return (
        <div
            ref={ref}
            className="bird"
            style={{
                left: `${birdPosition.x}px`,
                top: `${birdPosition.y}px`,
            }}
        ></div>
    );
});

export default Bird;
