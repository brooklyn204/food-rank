'use client';

import styles from "../page.module.css";
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ResultsChart from '../../components/ResultsChart';
import Location from '../../lib/models/Location';

export default function Results() {
  const params = useSearchParams();
  const groupCode = params.get('groupCode') || ''; // TODO: redirect back to home/to error page if this is empty
  const [error, setError] = useState(''); // For error checking -- necessary??
  const router = useRouter();

  // TODO: get results from server using groupCode

  // FIXME: testing
  const votesData = [
      new Location('McDonalds', 'mcdonalds.com', 4),
      new Location('Wendys', 'wendys.com', 7),
      new Location('Chipotle', 'chipotle.com', 6),
      new Location('Arbys', 'arbys.com', 7),
      new Location('Shake Shack', 'shakeshack.com',4),
    ];


  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Food Finder</h1>
        <ResultsChart data={votesData} />

      </main>
    </div>
  );
}