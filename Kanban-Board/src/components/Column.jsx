import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Trash2 } from 'lucide-react';
import Card from './Card';
import AddCardForm from './AddCardForm';

const Column = ({ column, cards, index, addCard, updateCard, deleteCard, deleteColumn }) => {
  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          className="column-wrapper glass-panel"
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div className="column-header" {...provided.dragHandleProps}>
            <h3 className="column-title">{column.title}</h3>
            <button
              className="action-btn delete"
              onClick={() => deleteColumn(column.id)}
              aria-label="Delete column"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <Droppable droppableId={column.id} type="card">
            {(provided, snapshot) => (
              <div
                className={`card-list ${snapshot.isDraggingOver ? 'is-dragging-over' : ''}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {cards.map((card, index) => (
                  <Card
                    key={card.id}
                    card={card}
                    index={index}
                    columnId={column.id}
                    updateCard={updateCard}
                    deleteCard={deleteCard}
                  />
                ))}
                {provided.placeholder}
                {cards.length === 0 && !snapshot.isDraggingOver && (
                  <div className="empty-state">No cards yet — add one below</div>
                )}
              </div>
            )}
          </Droppable>
          <AddCardForm columnId={column.id} addCard={addCard} />
        </div>
      )}
    </Draggable>
  );
};

export default Column;
