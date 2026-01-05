import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase-config';
import {
  doc,
  DocumentData,
  getDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { useParams } from 'react-router';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Worker, Job } from '@/types/models';

async function awardJobToWorker(jobId: string, workerId: string) {
  const jobRef = doc(db, 'Jobs', jobId);

  await updateDoc(jobRef, {
    awarded: workerId,
  });
}

function ParentAwardJob() {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job>();
  const [loading, setLoading] = useState(true);
  const [workers, setWorkers] = useState<Worker[]>([]);

  async function GetJob() {
    try {
      if (!jobId) {
        throw new Error('Job ID is required');
      }
      const jobRef = doc(db, 'Jobs', jobId);
      const jobSnap: DocumentData = await getDoc(jobRef);
      if (jobSnap.exists()) {
        setJob(jobSnap.data());
        const appliedWorkers = jobSnap.data().applied || [];
        const workerData: Worker[] = await Promise.all(
          appliedWorkers.map(async (workerId: string) => {
            const workerRef = doc(db, 'Users', workerId);
            const workerSnap = await getDoc(workerRef);
            if (workerSnap.exists()) {
              return { id: workerId, ...workerSnap.data() };
            }
            return null;
          })
        );
        setWorkers(workerData.filter((worker) => worker !== null));
      }
    } catch (error) {
      console.log('🚀 ~ GetJob ~ error:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    GetJob();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  const calculateAge = (birthday: Timestamp) => {
    const birthDate = birthday.toDate();
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">{job ? job.title : ''}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workers.map((worker) => (
          <Card key={worker.id}>
            <CardHeader>
              <CardTitle>{worker.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 rounded-full">
                  <AvatarImage
                    src={worker.photoURL || '/broken-image.jpg'}
                    alt={worker.name}
                    className="h-full w-full object-cover rounded-full"
                  />
                  <AvatarFallback className="h-16 w-16 rounded-full">
                    {worker.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    Age: {worker.dob ? calculateAge(worker.dob) : 'N/A'}
                  </p>
                  <p className="text-sm font-medium">
                    Gender: {worker.gender || 'N/A'}
                  </p>
                  <p className="text-sm font-medium">
                    Joined:{' '}
                    {worker.dateJoined
                      ? formatDistanceToNow(worker.dateJoined.toDate())
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <Button
                className="mt-4 w-full"
                onClick={() => jobId && awardJobToWorker(jobId, worker.id)}
              >
                Award Job
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ParentAwardJob;
