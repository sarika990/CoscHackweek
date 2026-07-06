import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { v4 as uuidv4 } from 'uuid';
import Column from './Column';
import AddColumnForm from './AddColumnForm';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { initialData } from '../utils/storage';

const Board = () => {
  const [data, setData] = useLocalStorage('kanban-board-data', initialData);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'column') {
      const newColumnOrder = Array.from(data.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      setData({
        ...data,
        columnOrder: newColumnOrder,
      });
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    // Moving within the same column
    if (start === finish) {
      const newCardIds = Array.from(start.cardIds);
      newCardIds.splice(source.index, 1);
      newCardIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        cardIds: newCardIds,
      };

      setData({
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      });
      return;
    }

    // Moving from one list to another
    const startCardIds = Array.from(start.cardIds);
    startCardIds.splice(source.index, 1);
    const newStart = {
      ...start,
      cardIds: startCardIds,
    };

    const finishCardIds = Array.from(finish.cardIds);
    finishCardIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      cardIds: finishCardIds,
    };

    setData({
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    });
  };

  const addCard = (columnId, content) => {
    const newCardId = `card-${uuidv4()}`;
    const newCard = { id: newCardId, content };

    const column = data.columns[columnId];
    const newCardIds = Array.from(column.cardIds);
    newCardIds.push(newCardId);

    setData({
      ...data,
      cards: {
        ...data.cards,
        [newCardId]: newCard,
      },
      columns: {
        ...data.columns,
        [columnId]: {
          ...column,
          cardIds: newCardIds,
        },
      },
    });
  };

  const updateCard = (cardId, newContent) => {
    setData({
      ...data,
      cards: {
        ...data.cards,
        [cardId]: {
          ...data.cards[cardId],
          content: newContent,
        },
      },
    });
  };

  const deleteCard = (cardId, columnId) => {
    const newCards = { ...data.cards };
    delete newCards[cardId];

    const column = data.columns[columnId];
    const newCardIds = column.cardIds.filter((id) => id !== cardId);

    setData({
      ...data,
      cards: newCards,
      columns: {
        ...data.columns,
        [columnId]: {
          ...column,
          cardIds: newCardIds,
        },
      },
    });
  };

  const addColumn = (title) => {
    const newColumnId = `col-${uuidv4()}`;
    const newColumn = {
      id: newColumnId,
      title,
      cardIds: [],
    };

    setData({
      ...data,
      columns: {
        ...data.columns,
        [newColumnId]: newColumn,
      },
      columnOrder: [...data.columnOrder, newColumnId],
    });
  };

  const deleteColumn = (columnId) => {
    const newColumns = { ...data.columns };
    const columnToDelete = newColumns[columnId];
    
    // delete cards within column
    const newCards = { ...data.cards };
    columnToDelete.cardIds.forEach((cardId) => {
      delete newCards[cardId];
    });

    delete newColumns[columnId];
    const newColumnOrder = data.columnOrder.filter((id) => id !== columnId);

    setData({
      ...data,
      cards: newCards,
      columns: newColumns,
      columnOrder: newColumnOrder,
    });
  };

  if (!isClient) return null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="all-columns" direction="horizontal" type="column">
        {(provided) => (
          <div
            className="board-container"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {data.columnOrder.map((columnId, index) => {
              const column = data.columns[columnId];
              const cards = column.cardIds.map((cardId) => data.cards[cardId]);

              return (
                <Column
                  key={column.id}
                  column={column}
                  cards={cards}
                  index={index}
                  addCard={addCard}
                  updateCard={updateCard}
                  deleteCard={deleteCard}
                  deleteColumn={deleteColumn}
                />
              );
            })}
            {provided.placeholder}
            <div className="add-column-wrapper">
              <AddColumnForm addColumn={addColumn} />
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Board;
