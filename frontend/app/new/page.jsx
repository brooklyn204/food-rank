'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from "../page.module.css";
import Location from '../../lib/models/Location';

export default function New() {
    const [groupName, setGroupName] = useState('');
    const [locations, setLocations] = useState([new Location({ name: 'Location 1' }), new Location({ name: 'Location 2' })]); 
    const defaultText = "Fun Food Fam" // TODO: pick better default text (maybe have load from config file?)
    const router = useRouter();
    const redirectPage = 'dashboard';

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page reload (to preserve logs) TODO: remove this? IDK what the implications are

        fetch('/api/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: groupName, locations : locations }),
        })
          .then(response => response.json())
          .then(data => {
            console.log('POSTed',groupName,'and',locations,'to /create endpoint, got back',data);
            let groupId = data.groupId;
            router.push(`/${redirectPage}?id=${encodeURIComponent(groupId)}`);
          })
          .catch(error => {
            // TODO: handle error -- redirect to home page, probably
            console.error(error);
          });
    };

    return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Food Finder</h1>
        <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder={defaultText}
        />
        <button
        onClick={handleSubmit}
        style={{ // TODO: make this the same across website (load from CSS file)
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          borderRadius: '4px',
          border: 'none',
          backgroundColor: '#0070f3',
          color: 'white',
          cursor: 'pointer',
        }}>
            Create Group
        </button>

      </main>
    </div>
  );
}