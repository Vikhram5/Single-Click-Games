import React from 'react';
import './Road.css';
import Car from './Car'; // Import the Car component
import Obstacles from './Obstacles'; // Import the Obstacles component

const Road = ({ isGamePaused, carPosition, onCollision, onMissedCoin, children }) => {
    return (
        <div className={`road-container ${isGamePaused ? 'paused' : ''}`}>
            <div className="road"></div>
            <div className="road"></div>
            
            {/* Car component - dynamic position based on carPosition */}
            <Car position={carPosition} />
            
            {/* Obstacles component - pass car position and handle collision/missed coin */}
            <Obstacles
                carPosition={carPosition}
                onCollision={onCollision}
                onMissedCoin={onMissedCoin}
                isGamePaused={isGamePaused}
            />

            {children}
        </div>
    );
};

export default Road;
