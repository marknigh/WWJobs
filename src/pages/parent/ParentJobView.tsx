import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {
  doc,
  getDoc,
  Timestamp,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Baby, House, PawPrint, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReviewWorkerDialog from '@/components/ReviewWorkerDialog';
import SpinnerCircle from '@/components/SpinnerCircle';
import { Job, Worker } from '@/types/models';
import ErrorComponent from '@/components/ErrorComponent';

const ParentJobView: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [awardedWorker, setAwardedWorker] = useState<Worker | null>(null);
  const [reviewExists, setReviewExists] = useState<boolean>(false);

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return;
      try {
        const jobDoc = await getDoc(doc(db, 'Jobs', jobId));
        if (jobDoc.exists()) {
          const jobData = jobDoc.data() as Job;
          setJob(jobData);

          // Fetch worker details if there are applied workers
          if (jobData.applied && jobData.applied.length > 0) {
            const workersData = await Promise.all(
              jobData.applied.map(async (workerId) => {
                const workerDoc = await getDoc(doc(db, 'Users', workerId));
                if (workerDoc.exists()) {
                  return {
                    uid: workerId,
                    photoURL: workerDoc.data().photoURL || null,
                    name: workerDoc.data().name || 'Unknown',
                  };
                }
                return { uid: workerId, photoURL: null, name: 'Unknown' };
              })
            );
            setWorkers(workersData);
          }

          // Fetch awarded worker details
          if (jobData.awarded) {
            const awardedWorkerDoc = await getDoc(
              doc(db, 'Users', jobData.awarded)
            );
            if (awardedWorkerDoc.exists()) {
              setAwardedWorker({
                uid: jobData.awarded,
                photoURL: awardedWorkerDoc.data().photoURL || null,
                name: awardedWorkerDoc.data().name || 'Unknown',
              });
            }
          }

          // Check if a review exists for this job
          const reviewsQuery = query(
            collection(db, 'Reviews'),
            where('jobId', '==', jobId)
          );
          const reviewsSnapshot = await getDocs(reviewsQuery);
          setReviewExists(!reviewsSnapshot.empty);
        } else {
          console.error('Job not found');
        }
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  if (loading) {
    <SpinnerCircle />;
  }

  if (!job) {
    return (
      <ErrorComponent
        mainText="Oops! Something Went Wrong"
        secondaryText="Job Not Found"
        customButton={
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full p-4 space-y-6">
      <Card className="shadow-none lg:w-1/2 sm:w-full">
        <CardHeader>
          <h2 className="text-xl font-bold">Job Details</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="font-semibold">Title:</p>
              <p>{job.title}</p>
            </div>
            <div>
              <p className="font-semibold">Description:</p>
              <p>{job.description}</p>
            </div>
            <div>
              <p className="font-semibold">Start Date:</p>
              <p>
                {format(job.startDateTime.toDate(), 'MMMM dd, yyyy K:mm a')}
              </p>
            </div>
            <div>
              <p className="font-semibold">Services:</p>
              <div className="flex space-x-2">
                {job.baby && <Baby />}
                {job.pet && <PawPrint />}
                {job.home && <House />}
              </div>
            </div>
            <div className="flex flex-col space-y-4">
              <p className="font-semibold">Applied Workers:</p>
              <div className="flex space-x-4">
                {workers.length > 0 ? (
                  workers.map((worker) => (
                    <div
                      key={worker.uid}
                      className="flex flex-col items-center"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={worker.photoURL || '/default-avatar.png'}
                          alt={worker.name}
                        />
                        <AvatarFallback>{worker.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <p className="text-sm mt-1">{worker.name}</p>
                    </div>
                  ))
                ) : (
                  <p>No workers have applied yet.</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-4">
          {awardedWorker ? (
            <>
              <p className="font-semibold">Awarded Worker:</p>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={awardedWorker.photoURL || '/default-avatar.png'}
                    alt={awardedWorker.name}
                  />
                  <AvatarFallback>
                    {awardedWorker.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm text-gray-500">
                  This job has been awarded to {awardedWorker.name}.
                </p>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">
              This job is still open for applications.
            </p>
          )}
          {reviewExists || job.startDateTime.toDate() > new Date() ? (
            <p className="text-sm text-gray-500">
              {reviewExists
                ? 'A review has already been written for this job.'
                : 'You can write a review after the job start date.'}
            </p>
          ) : (
            <ReviewWorkerDialog
              jobId={job.id}
              awardedWorkerUid={job.awarded}
              parent={job.parentId}
            >
              <Button asChild>
                <Star className="h-4 w-4" />
                <span>Write a Review</span>
              </Button>
            </ReviewWorkerDialog>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ParentJobView;
