import { v4 as uuidv4 } from 'uuid';

export const initialData = {
  columns: {
    'col-1': {
      id: 'col-1',
      title: 'To Do',
      cardIds: ['card-1', 'card-2'],
    },
    'col-2': {
      id: 'col-2',
      title: 'In Progress',
      cardIds: ['card-3'],
    },
    'col-3': {
      id: 'col-3',
      title: 'Done',
      cardIds: [],
    },
  },
  cards: {
    'card-1': { id: 'card-1', content: 'Design the glassmorphism UI' },
    'card-2': { id: 'card-2', content: 'Setup Vite React project' },
    'card-3': { id: 'card-3', content: 'Implement drag and drop' },
  },
  columnOrder: ['col-1', 'col-2', 'col-3'],
};
