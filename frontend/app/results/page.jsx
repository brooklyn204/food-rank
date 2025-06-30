'use client';

import styles from "../page.module.css";
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

// TODO: move this to a separate file (for reusability)
export function LiveBarChart(data) {
    console.log('data:', data.data);
    console.log('is array?', Array.isArray(data.data));

    return (
    <div style={{ width: 500, height: 400, padding: '2rem' }}> {/* TODO: make this dynamic sizing; move CSS to styles file; mess with colors */}
      <ResponsiveContainer>
        <BarChart
          data={data.data}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          barSize={50}
        >
          <CartesianGrid strokeDasharray="3 0" stroke="#e0e0e0" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 14 }}
            interval={0}
            angle={-15}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tick={{ fontSize: 14 }}
            label={{
              value: 'Votes',
              angle: -90,
              position: 'insideLeft',
              style: { textAnchor: 'middle' },
            }}
          />
          {/* TODO: decide whether to leave this in or not: <Tooltip /> */}
          <Bar
            dataKey="value"
            radius={[6, 6, 0, 0]}
            fill="#3b82f6" // TODO: change this color
            animationDuration={500}
          >
            <LabelList
              dataKey="value"
              position="top"
              style={{
                fill: '#5b5b5b',
                fontWeight: 'bold',
                fontSize: 14,
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}


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
        <LiveBarChart data={votesData} />

      </main>
    </div>
  );
}