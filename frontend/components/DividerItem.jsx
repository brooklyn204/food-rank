import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function DividerItem({ id }) {
  const {
    setNodeRef,
    transform,
    transition,
    // listeners and attributes intentionally omitted
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    height: '40px', // FIXME: this has to be the same as SortableItem height, otherwise SortableItems will change to this size when they are dragged over it
    backgroundColor: '#fff',
    margin: '8px 0',
    borderRadius: '2px',
    pointerEvents: 'none', // prevent grabbing
    display: 'flex',
    alignItems: 'center',
  };

  return <div ref={setNodeRef} style={style}>------------------</div>;
}