import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { db } from '@/lib/firebase-config';
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { House, Baby, PawPrint, UserRound } from 'lucide-react';
import { format } from 'date-fns';
import { Worker } from '@/types/models';
import { userRound } from 'lucide-react';
import SpinnerCircle from '@/components/SpinnerCircle';
export default function WorkerList() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function getWorkers() {
      try {
        const q = query(collection(db, 'Users'), where('type', '==', 'worker'));
        const querySnapshot = await getDocs(q);
        const newData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || '',
            email: data.email || '',
            address: data.address || '',
            city: data.city || '',
            dob: data.dob || null,
            dateJoined: data.dateJoined || null,
            gender: data.gender || '',
            photoURL: data.photoURL || '',
            baby: data.baby || false,
            pet: data.pet || false,
            home: data.home || false,
          } as Worker;
        });
        setWorkers(newData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    getWorkers();
  }, []);

  const calculateAge = (dob: Timestamp) => {
    const birthDate = dob.toDate();
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const formatDateJoined = (dateJoined: Timestamp) => {
    return format(dateJoined.toDate(), 'MMMM yyyy');
  };

  return (
    <>
      {loading ? (
        <SpinnerCircle />
      ) : (
        <div className="flex flex-col items-center justify-center w-full p-4 space-y-6">
          <ul role="list">
            {workers.map((worker) => (
              <li
                key={worker.id}
                className="flex justify-between items-center gap-x-48 py-5 cursor-pointer"
                onClick={() => navigate(`/parent/worker/${worker.id}`)}
              >
                <div className="flex items-center min-w-0 gap-x-4">
                  {worker.photoURL ? (
                    <img
                      alt=""
                      src={worker.photoURL}
                      className="size-12 flex-none rounded-full"
                    />
                  ) : (
                    <UserRound className="size-12 flex-none rounded-ful" />
                  )}
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold">{worker.name}</p>
                    <p className="text-sm">
                      {worker.gender.charAt(0).toUpperCase() +
                        worker.gender.slice(1)}
                    </p>
                    <p className="mt-1 truncate text-xs ">
                      {worker.dob ? calculateAge(worker.dob) : 'N/A'} years old
                    </p>
                    <p className="mt-1 truncate text-xs">
                      Joined:{' '}
                      {worker.dateJoined
                        ? formatDateJoined(worker.dateJoined)
                        : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                  <div className="flex gap-4">
                    {worker.baby && <Baby />}
                    {worker.pet && <PawPrint />}
                    {worker.home && <House />}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
