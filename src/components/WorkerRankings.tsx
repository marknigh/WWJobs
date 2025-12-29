import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase-config';

interface WorkerRating {
  workerId: string;
  averageRating: number;
  name: string;
  reviewCount: number;
}

export default function WorkerRankings() {
  const [rankings, setRankings] = useState<WorkerRating[]>([]);

  useEffect(() => {
    // Fetch and calculate worker rankings based on reviews
    async function fetchRankings() {
      try {
        const reviewsSnapshot = await getDocs(collection(db, 'Reviews'));
        const ratingsMap: Record<string, { total: number; count: number }> = {};

        reviewsSnapshot.docs.forEach((doc) => {
          const { workerId, rating } = doc.data();
          if (!ratingsMap[workerId]) {
            ratingsMap[workerId] = { total: 0, count: 0 };
          }
          ratingsMap[workerId].total += rating;
          ratingsMap[workerId].count += 1;
        });

        const rankingsData = await Promise.all(
          Object.entries(ratingsMap).map(
            async ([workerId, { total, count }]) => {
              const userDoc = await getDoc(doc(db, 'Users', workerId));
              const name = userDoc.exists() ? userDoc.data().name : 'Unknown';
              return {
                workerId,
                averageRating: total / count,
                name,
                reviewCount: count, // Add the number of reviews
              };
            }
          )
        );

        rankingsData.sort((a, b) => b.averageRating - a.averageRating); // Sort by highest rating
        setRankings(rankingsData);
      } catch (error) {
        console.error('Error fetching worker rankings:', error);
      }
    }
    fetchRankings();
  }, []);

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-lg font-bold mb-4">Top Rated Workers</h2>
      {rankings.length > 0 ? (
        <ul className="space-y-2">
          {rankings.map((worker, index) => (
            <li key={worker.workerId} className="p-2 border rounded">
              <h3 className="font-semibold">
                #{index + 1}: {worker.name}
              </h3>
              <p>Average Rating: {worker.averageRating.toFixed(2)}</p>
              <p className="text-sm font-light">
                Number of Reviews: {worker.reviewCount}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No rankings available.</p>
      )}
    </div>
  );
}
