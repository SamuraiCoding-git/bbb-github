import React from 'react';

const Obstacle = ({ top, left }) => {
    return (
        <div className="absolute" style={{ top: `${top}px`, left: `${left}px` }}>
            <img src={require("../assets/pipe-bottom.svg")} alt="Obstacle" />
        </div>
    );
};

export default Obstacle;
