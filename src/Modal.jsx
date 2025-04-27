import React, { useState, useEffect } from 'react';
import './Modal.css';

const CustomModal = ({ isVisible, title, content, onOk, onCancel, isError }) => {
  const [activeButton, setActiveButton] = useState('ok');
  const [autoClickTimer, setAutoClickTimer] = useState(null);

  useEffect(() => {
    if (!isVisible) return;

    const buttons = ['cancel', 'ok'];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % buttons.length;
      setActiveButton(buttons[index]);
    }, 3000);

    setAutoClickTimer(setTimeout(() => {
      if (activeButton === 'cancel') {
        onCancel();
      } else {
        onOk();
      }
    }, 3000));

    return () => clearInterval(interval);
  }, [isVisible, activeButton, onOk, onCancel]);

  if (!isVisible) return null;

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <h2 className={`custom-modal-title ${isError ? 'error' : ''}`}>{title}</h2>
        <div className="custom-modal-content">{content}</div>
        <div className="custom-modal-footer">
          <button
            className={`modal-btn cancel-btn ${activeButton === 'cancel' ? 'active' : ''}`}
            onClick={onCancel}
            autoFocus={activeButton === 'cancel'}
          >
            Cancel
          </button>
          <button
            className={`modal-btn ok-btn ${activeButton === 'ok' ? 'active' : ''}`}
            onClick={onOk}
            autoFocus={activeButton === 'ok'}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
