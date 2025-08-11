'use client';

import styles from "../page.module.css";
import { useState, useEffect } from 'react';
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
import Location from '../../lib/models/Location';

export default function Vote() {
  const params = useSearchParams();
  const groupCode = params.get('name') || ''; // TODO: redirect back to home/to error page if this is empty
  const [error, setError] = useState(''); // For error checking -- necessary??
  const router = useRouter();
  const redirectPage = 'results';

  const [userName, setUserName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
  useEffect(() => {
        fetch(`/api/options?code=${encodeURIComponent(groupCode)}`)
        .then(response => response.json())
        .then(data => {
          const order = data.locations.map((location, index) => index);
          order.push(-1);
          setItems(order); // Create unique IDs for each item
          setGroupName(data.name);
          setLocations(data.locations);
        })
        .catch(error => {
          console.error(error);
        });
    }, [groupCode]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
      console.log("items are",items," locations are", locations);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    // TODO: check if userName is empty/do other validation
    fetch('/api/vote', {
      method: 'POST',
      headers: {
            'Content-Type': 'application/json',
          },
      body: JSON.stringify({ code: groupCode, name: userName, order: items}),
    })
    .catch(error => {
      // handle error
      console.error(error);
    });
    console.log('Submitted order:', items);

    router.push(`/${redirectPage}?groupCode=${encodeURIComponent(groupCode)}`);
  };


  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Food Finder</h1>
        <p>Voting for where your group {groupName} should eat</p>

        <label>
          Enter your name: <br />
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder=""
          />
        </label>
        {/* TODO: show instructions for voting */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <ItemArray items={items} vals={locations} interactive={true} />
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