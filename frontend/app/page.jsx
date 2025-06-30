'use client';

import styles from "./page.module.css";
import { useState } from 'react';
import { useRouter } from 'next/navigation';



export default function Home() {
  const [name, setName] = useState('');
  const [submittedName, setSubmittedName] = useState('');
  const [error, setError] = useState(''); // For error checking -- necessary??
  const router = useRouter();
  const redirectPage = 'vote';
  const newGroupPage = 'new';

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    // Client-side validation
    if (!name) {
      setError('Please enter your name.');
      return;
    }

    // Submit the name to the API here
    
    router.push(`/${redirectPage}?name=${encodeURIComponent(name)}`);
    
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Food Finder</h1>
        <form onSubmit={handleSubmit}>
        <label>
          Enter your group code: <br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="XXX-XXX"
          />
        </label>
        <br />
        <button type="submit" style={{ marginTop: '1rem' }}>
          Vote
        </button>
      </form>

      <p>
        Or <a href={newGroupPage}>create a new group</a>.
      </p>
        
      </main>
    </div>
  );
}