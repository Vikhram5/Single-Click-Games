import React from 'react';
import carImage from '/car_images/car.png';
import './Car.css';

const Car = ({ position }) => {
  let lanePosition;

  // Set position based on the lane value (0, 1, 2 for left, center, right)
  switch (position) {
    case 0:
      lanePosition = 'left';
      break;
    case 1:
      lanePosition = 'center';
      break;
    case 2:
      lanePosition = 'right';
      break;
    default:
      lanePosition = 'center';
  }

  return (
    <div className={`car ${lanePosition}`}>
      <img src={carImage} alt="Car" className="car-image" />
    </div>
  );
};

export default Car;
