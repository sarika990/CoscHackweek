import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

const AddCardForm = ({ columnId, addCard }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      addCard(columnId, value);
      setValue('');
      setIsAdding(false);
    }
  };

  if (isAdding) {
    return (
      <div className="add-form-container">
        <form onSubmit={handleSubmit}>
          <textarea
            className="input-field"
            placeholder="Enter card title..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
            rows={3}
            style={{ resize: 'none' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
              if (e.key === 'Escape') {
                setIsAdding(false);
                setValue('');
              }
            }}
          />
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Add Card
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setIsAdding(false);
                setValue('');
              }}
            >
              <X size={18} />
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="add-form-container">
      <button
        className="btn btn-ghost"
        style={{ width: '100%', justifyContent: 'flex-start' }}
        onClick={() => setIsAdding(true)}
      >
        <Plus size={18} /> Add a card
      </button>
    </div>
  );
};

export default AddCardForm;
