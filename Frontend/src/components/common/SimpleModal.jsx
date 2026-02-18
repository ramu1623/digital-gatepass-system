import React, { useState, useEffect } from 'react';
import './SimpleModal.css';

const SimpleModal = ({ isOpen, onClose, title, type = 'alert', message, onSubmit, children }) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      setInputValue('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(inputValue);
    }
    // onClose(); // Let parent handle closing for async ops or manual close
  };

  return (
    <div className="simple-modal-overlay">
      <div className="simple-modal-container">
        <div className="simple-modal-header">
          <h3>{title}</h3>
          <button className="simple-close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="simple-modal-body">
          {message && <p>{message}</p>}
          {children}
          
          {type === 'prompt' && (
            <form id="modal-form" onSubmit={handleSubmit}>
              <textarea
                className="simple-modal-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter your remarks..."
                rows="3"
                autoFocus
              />
            </form>
          )}
        </div>

        <div className="simple-modal-footer">
          {type === 'prompt' ? (
            <>
              <button className="simple-btn secondary" onClick={onClose}>Cancel</button>
              <button className="simple-btn primary" type="submit" form="modal-form">Submit</button>
            </>
          ) : (
            <button className="simple-btn primary" onClick={onClose}>OK</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleModal;
