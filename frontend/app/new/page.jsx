'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from "../page.module.css";
import Location from '../../lib/models/Location';

export default function New() {
  const [groupName, setGroupName] = useState('');
  const [locations, setLocations] = useState([new Location('Location A'), new Location('Location B')]); 
  const defaultText = "Fun Food Fam" // TODO: pick better default text (maybe have load from config file?)
  const router = useRouter();
  const redirectPage = 'dashboard';

  const [locationInput, setLocationInput] = useState("");

  const handleAddLocation = () => {
    if (locationInput.trim() === "") return;

    setLocations((prev) => [...prev, new Location(locationInput.trim())]);
    setLocationInput("");
  };

  const handleRemoveLocation = (index) => {
    setLocations((prev) => prev.filter((_, i) => i !== index));
  };

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
        let groupCode = data.groupCode;
        router.push(`/${redirectPage}?id=${encodeURIComponent(groupCode)}`);
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
        {/* TODO: allow locations to be entered here */}
        <div className="max-w-md mx-auto p-4 border rounded-lg shadow-md">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Enter location name"
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleAddLocation}
              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>

          <ul className="mb-4">
            {locations.map((loc, i) => (
              <li key={i} className="flex justify-between items-center mb-1">
                <span>{loc.name}</span>
                <button
                  onClick={() => handleRemoveLocation(i)}
                  className="text-red-500 hover:text-red-700"
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        </div>
        {locations.length > 0 && (
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
        )}

      </main>
    </div>
  );
}