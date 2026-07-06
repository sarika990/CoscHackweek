import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

const AddColumnForm = ({ addColumn }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      addColumn(value);
      setValue('');
      setIsAdding(false);
    }
  };

  if (isAdding) {
    return (
      <div className="glass-panel" style={{ padding: '16px' }}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="input-field"
            placeholder="Enter column title..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
          />
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Add Column
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
    <button className="add-column-btn" onClick={() => setIsAdding(true)}>
      <Plus size={20} /> Add another column
    </button>
  );
};

export default AddColumnForm;
