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
import ItemArray from '../../components/ItemArray'; // TODO: change these all to use @ -- figure out why this doesn't work??

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

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    // TODO: submit the order to the server
    console.log('Submitted order:', items);

    router.push(`/${redirectPage}`);
  };


  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Food Finder</h1>

        {/* TODO: allow user to enter their name */}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <ItemArray items={items} vals={vals} interactive={true} />
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
        Submit Votes
      </button>
      </main>
    </div>
  );
}