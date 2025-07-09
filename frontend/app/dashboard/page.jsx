'use client';

import styles from "../page.module.css";
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Voter from '../../lib/models/Voter';
import Location from '../../lib/models/Location';

import ResultsChart from '../../components/ResultsChart';
import ItemArray from '../../components/ItemArray'; // TODO: change these all to use @ -- figure out why this doesn't work??
import ExpandableBox from '../../components/ExpandableBox';

export default function Dashboard() {
    const params = useSearchParams();
    const groupId = params.get('id') || ''; // TODO: redirect back to home/to error page if this is empty (also refactor this across files to use consistent naming)
    // TODO: get results from server using id

    const locations = [
      new Location('McDonalds', 'mcdonalds.com', 4),
      new Location('Wendys', 'wendys.com', 7),
      new Location('Chipotle', 'chipotle.com', 6),
      new Location('Arbys', 'arbys.com', 7),
      new Location('Shake Shack', 'shakeshack.com',4),
    ];
    const voterData = [
      new Voter( 
        "Emily",
        [0,3,2,-1,4,1],
        3),
      new Voter( 
      "Josh",
      [4,-1,3,1,0,2],
      1),
      new Voter( 
      "Alex",
      [2,1,3,4,0,-1],
      5),
      new Voter( 
      "Nancy",
      [1,3,4,-1,0,2],
      3)
    ];


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