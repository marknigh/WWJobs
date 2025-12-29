import { useParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SpinnerCircle from '@/components/SpinnerCircle';
import { Job } from '@/types/models';
import useFirebaseAuth from '@/hooks/use-auth-state-change';
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  arrayUnion,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase-config'; // Import Firebase Firestore configuration
import { toast } from '@/hooks/use-toast';

export default function WorkerJobDetails() {
  const { jobId } = useParams(); // Get job ID from the route
  const navigate = useNavigate();
  const { authUser, authLoading } = useFirebaseAuth(); // Get the current authenticated user
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState<
    { id: string; name: string; photoURL: string }[]
  >([]);

  useEffect(() => {
    // Fetch job details from Firebase Firestore
    async function fetchJobDetails() {
      setLoading(true);
      try {
        const jobRef = doc(db, 'Jobs', jobId); // Reference to the job document
        const jobSnapshot = await getDoc(jobRef);

        if (jobSnapshot.exists()) {
          console.log('Job data:', jobSnapshot.data());
          setJob(jobSnapshot.data() as Job); // Cast the data to the Job type
        } else {
          console.error('Job not found');
          setJob(null);
        }
      } catch (error) {
        console.error('Failed to fetch job details:', error);
      } finally {
        setLoading(false);
      }
    }

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  useEffect(() => {
    async function fetchApplicants() {
      if (!job?.applied || job.applied.length === 0) return;

      try {
        const fetchedApplicants = await Promise.all(
          job.applied.map(async (applicantId) => {
            const userRef = doc(db, 'Users', applicantId);
            const userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists()) {
              const userData = userSnapshot.data();
              return {
                id: applicantId,
                name: userData.name || 'Unknown',
                photoURL: userData.photoURL || '',
              };
            } else {
              console.warn(`User with ID ${applicantId} not found`);
              return { id: applicantId, name: 'Unknown', photoURL: '' };
            }
          })
        );

        setApplicants(fetchedApplicants);
      } catch (error) {
        console.error('Failed to fetch applicants:', error);
      }
    }

    fetchApplicants();
  }, [job?.applied]);

  const handleApply = async () => {
    if (!authUser) return;

    try {
      await updateDoc(job.id, { applied: arrayUnion(userAuth.uid) });
      console.log('🚀 ~ Apply ~ props.userAuth.uid:', userAuth.uid);
      // toast({
      //   title: 'You have successfully applied for ' + job.title,
      //   description: format(new Date(), 'MMM dd, yyyy'),
      // });
    } catch (error) {
      console.error('Failed to apply for the job:', error);
      alert('Failed to apply for the job. Please try again.');
    }
  };

  if (authLoading || loading) {
    return <SpinnerCircle />;
  }

  if (!job) {
    return <p className="text-center mt-8">Job not found.</p>;
  }

  return (
    <div className="mx-4 mt-8">
      <Card className="text-center">
        <CardTitle className="text-lg font-semibold">{job.title}</CardTitle>
        <CardContent>
          <p className="text-sm mt-2">{job.description}</p>
          <p className="text-sm mt-2">
            Start Date:{' '}
            {job.startDateTime && new Date(job.startDateTime).toLocaleString()}
          </p>
          <p className="text-sm mt-2">
            Location: {job.location || 'Not specified'}
          </p>
          <div className="mt-4">
            <h2 className="text-md font-semibold">Applicants:</h2>
            <ul className="flex flex-wrap justify-evenly gap-4 mt-2">
              {applicants.length > 0 ? (
                applicants.map((applicant) => (
                  <li
                    key={applicant.id}
                    className="flex items-center space-x-2"
                  >
                    {applicant.photoURL && (
                      <img
                        src={applicant.photoURL}
                        alt={applicant.name}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span>{applicant.name}</span>
                  </li>
                ))
              ) : (
                <p>No applicants yet.</p>
              )}
            </ul>
          </div>
          <div className="mt-6">
            {!job.applied?.includes(authUser.uid) ? (
              <Button onClick={handleApply}>Apply for Job</Button>
            ) : (
              <Button>Withdraw</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
