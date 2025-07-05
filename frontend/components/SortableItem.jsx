import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function SortableItem({ id, text, draggable = true }) {
  if (id === undefined || text === undefined) {
    return; // TODO: add better error handling
  }

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '0.5rem 1rem',
    border: '1px solid #ccc',
    marginBottom: '8px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    cursor: draggable ? 'grab' : 'default', // Change cursor based on draggable prop
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {text}
    </div>
  );
}