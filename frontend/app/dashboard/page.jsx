'use client';

import styles from "../page.module.css";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Voter from '../../lib/models/Voter';
import Location from '../../lib/models/Location';

import ResultsChart from '../../components/ResultsChart';
import ItemArray from '../../components/ItemArray'; // TODO: change these all to use @ -- figure out why this doesn't work??
import ExpandableBox from '../../components/ExpandableBox';

export default function Dashboard() {
  console.log("Dashboard page loaded");
    const params = useSearchParams();
    const groupId = params.get('id') || ''; // TODO: redirect back to home/to error page if this is empty (also refactor this across files to use consistent naming)
    // TODO: get results from server using id
    const [name, setName] = useState(''); // TODO: add name to page
    const [locations, setLocations] = useState([]);
    const [voterData, setVoterData] = useState([]);

    useEffect(() => {
        fetch(`/api/results?code=${encodeURIComponent(groupId)}`, {
          method: 'GET', // or 'GET'
          headers: {
            'Content-Type': 'application/json',
          }
        })
        .then(response => response.json())
        .then(data => {
          setName(data.name);
          setLocations(data.locations); 
          setVoterData(data.voters);
        })
        .catch(error => {
          console.error(error);
        });
    }, [groupId]);

    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <h1>Food Finder</h1>
          <h3>Aggregate Results</h3>
          <ResultsChart data={locations} />
          {/* TODO: add in a pie chart showing how many users would at least accept each location, or maybe color each bar/sort the bars based on how many people would accept it? Should probably build into ResultsChart component, so propogates to Results page */}
          <h3>Detailed Results</h3>
          {voterData.map((voter,index) => 
          <ExpandableBox title={voter.name} key={index}>
            <ItemArray items={voter.orderedLocations} vals={locations} interactive={false} linePosition={voter.lineLocation} />
          </ExpandableBox>
          )}
          
        
        </main>
      </div>
    );
}