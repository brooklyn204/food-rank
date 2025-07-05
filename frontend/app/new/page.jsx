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
        const groupId = 1234; // TODO: submit name + locations to the server, get back group ID
        console.log('Submitted goup', groupName, 'with id', groupId,'and locations:', locations);

        router.push(`/${redirectPage}?id=${encodeURIComponent(groupId)}`);
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