'use client';

import styles from "../page.module.css";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ResultsChart from '../../components/ResultsChart';
import Location from '../../lib/models/Location';

export default function Results() {
  const params = useSearchParams();
  const groupCode = params.get('groupCode') || ''; // TODO: redirect back to home/to error page if this is empty
  const [error, setError] = useState(''); // For error checking -- necessary??
  const router = useRouter();
  const [locations, setLocations] = useState([]);

  useEffect(() => {
      fetch(`/api/results?code=${encodeURIComponent(groupCode)}`)
      .then(response => response.json())
      .then(data => {
        setLocations(data.locations);
        // Not using voters here, unlike dashboard
      })
      .catch(error => {
        console.error(error);
      });
  }, [groupCode]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Food Finder</h1>
        <ResultsChart data={locations} />

      </main>
    </div>
  );
}