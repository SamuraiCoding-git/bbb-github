import React from 'react';

const Background = ({ ctx, night, width, height }) => {
    const dayImage = new Image();
    const nightImage = new Image();
    dayImage.src = '../assets/background.svg';
    nightImage.src = '../assets/foreground.svg';

    dayImage.onload = () => {
        ctx.drawImage(dayImage, 0, 0, width, height);
    };

    nightImage.onload = () => {
        ctx.drawImage(nightImage, 0, 0, width, height);
    };

    return null;
};

export default Background;
