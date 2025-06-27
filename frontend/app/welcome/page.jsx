'use client';

import { useSearchParams } from 'next/navigation';

export default function WelcomePage() {
  const params = useSearchParams();
  const name = params.get('name');

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome!</h1>
      {name ? (
        <p>Glad to have you here, <strong>{name}</strong>! 🎉</p>
      ) : (
        <p>We don’t know your name yet!</p>
      )}
    </div>
  );
}