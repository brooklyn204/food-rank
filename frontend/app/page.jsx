'use client';

import styles from "./page.module.css";
import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function Home() {
  const [name, setName] = useState('');
  const [submittedName, setSubmittedName] = useState('');
  const [error, setError] = useState(''); // For error checking -- necessary??
  const router = useRouter();
  const redirectPage = 'welcome';

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
        <form onSubmit={handleSubmit}>
        <label>
          Enter your name: <br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </label>
        <br />
        <button type="submit" style={{ marginTop: '1rem' }}>
          Submit
        </button>
      </form>

      {submittedName && (
        <p style={{ marginTop: '1rem' }}>
          Nice to meet you, <strong>{submittedName}</strong>!
        </p>
      )}
        
      </main>
    </div>
  );
}