import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase-config';
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  orderBy,
} from 'firebase/firestore';
import ParentDetailsDialog from '@/components/ParentDetailsDialog';
import SpinnerCircle from '@/components/SpinnerCircle';
import ErrorDisplay from '@/components/ErrorDisplay';

interface Parent {
  id: string;
  email: string;
  name: string;
  address: string;
  city: string;
  zip: string;
  state: string;
  dateJoined: Timestamp;
  baby: boolean;
  pet: boolean;
  home: boolean;
  startDateTime: Timestamp;
  jobsAwarded: number;
  nextJob: string | null;
}

export default function WorkerParentList() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getParents() {
      try {
        const q = query(
          collection(db, 'Users'),
          where('type', '==', 'parent'),
          orderBy('dateJoined', 'desc') // Sort by dateJoined
        );
        const querySnapshot = await getDocs(q);

        const parentsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Parent[];
        setParents(parentsData);
      } catch (error: any) {
        console.error(error);
        setError(error.code || 'UNKNOWN_ERROR'); // Use error.code if available
      } finally {
        setLoading(false);
      }
    }

    getParents();
  }, []);

  return (
    <>
      {loading ? (
        <SpinnerCircle />
      ) : error ? (
        <ErrorDisplay
          code={error}
          message="Failed to load parents. Please try again."
        />
      ) : (
        <div className="flex flex-col items-center justify-center w-full p-4 space-y-6">
          <ul
            role="list"
            className="divide-y divide-gray-100 w-full sm:w-full lg:w-1/2"
          >
            {parents.map((parent) => (
              <li key={parent.id} className="py-5">
                <ParentDetailsDialog parent={parent} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
