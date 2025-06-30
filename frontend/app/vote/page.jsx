'use client';

import styles from "../page.module.css";
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ id, text }) {
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
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {text}
    </div>
  );
}

export default function Vote() {
  const params = useSearchParams();
  const groupCode = params.get('groupCode') || ''; // TODO: redirect back to home/to error page if this is empty
  const [error, setError] = useState(''); // For error checking -- necessary??
  const router = useRouter();
  const redirectPage = 'results';

  // TODO: get options from server using groupCode

  // FIXME: testing
  const [items, setItems] = useState([0,1,2,3]);
  const vals = ['apple', 'banana', 'grape', 'orange'];

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleSubmit = () => {
    // TODO: submit the order to the server
    console.log('Submitted order:', items);

    router.push(`/${redirectPage}`);
  };


  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Food Finder</h1>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((item) => (
              <SortableItem key={item} id={item} text={vals[item]} />
            ))}
          </SortableContext>
        </DndContext>
        
        <button
        onClick={handleSubmit}
        style={{ // TODO: fix CSS/move to a style file
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          borderRadius: '4px',
          border: 'none',
          backgroundColor: '#0070f3',
          color: 'white',
          cursor: 'pointer',
        }}
      >
        Submit Order
      </button>
      </main>
    </div>
  );
}