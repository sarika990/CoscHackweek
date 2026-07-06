import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Pencil, Trash2, Check, X } from 'lucide-react';

const Card = ({ card, index, columnId, updateCard, deleteCard }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(card.content);

  const handleSave = () => {
    if (editValue.trim()) {
      updateCard(card.id, editValue);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(card.content);
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          className="glass-card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.9 : 1,
            transform: snapshot.isDragging 
              ? `${provided.draggableProps.style?.transform} scale(1.02)` 
              : provided.draggableProps.style?.transform
          }}
        >
          {isEditing ? (
            <div className="card-content" style={{ flexDirection: 'column', gap: '8px' }}>
              <textarea
                className="input-field"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                autoFocus
                rows={3}
                style={{ resize: 'none', padding: '8px' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSave();
                  }
                  if (e.key === 'Escape') {
                    handleCancel();
                  }
                }}
              />
              <div className="form-actions" style={{ marginTop: 0 }}>
                <button className="btn btn-primary" onClick={handleSave} style={{ padding: '4px 8px' }}>
                  <Check size={16} /> Save
                </button>
                <button className="btn btn-ghost" onClick={handleCancel} style={{ padding: '4px 8px' }}>
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="card-content">
              <div className="card-title">{card.content}</div>
              <div className="card-actions">
                <button
                  className="action-btn"
                  onClick={() => setIsEditing(true)}
                  aria-label="Edit card"
                >
                  <Pencil size={14} />
                </button>
                <button
                  className="action-btn delete"
                  onClick={() => deleteCard(card.id, columnId)}
                  aria-label="Delete card"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default Card;
