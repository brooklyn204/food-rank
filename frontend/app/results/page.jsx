'use client';

import styles from "../page.module.css";
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ResultsChart from '../../components/ResultsChart';

export default function Results() {
  const params = useSearchParams();
  const groupCode = params.get('groupCode') || ''; // TODO: redirect back to home/to error page if this is empty
  const [error, setError] = useState(''); // For error checking -- necessary??
  const router = useRouter();

  // TODO: get results from server using groupCode

  // FIXME: testing
  const votesData = [
    { label: 'Apples', value: 1 },
    { label: 'Bananas', value: 5 },
    { label: 'Grapes', value: 10 },
    { label: 'Oranges', value: 2 },
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