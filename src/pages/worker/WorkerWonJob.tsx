import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { db } from '@/lib/firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { format } from 'date-fns';
import SpinnerCircle from '@/components/SpinnerCircle';
import { Parent, Job } from '@/types/models'; // Import interfaces
import { Baby, House, PawPrint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
import ErrorComponent from '@/components/ErrorComponent'; // Import the Error component

export default function WorkerWonJob() {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [parent, setParent] = useState<Parent | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchJobDetails() {
      try {
        const jobRef = doc(db, 'Jobs', jobId);
        const jobDoc = await getDoc(jobRef);
        if (jobDoc.exists()) {
          const jobData = jobDoc.data() as Job;
          setJob(jobData);

          if (jobData.parentId) {
            const parentDoc = await getDoc(doc(db, 'Users', jobData.parentId));
            if (parentDoc.exists()) {
              setParent(parentDoc.data() as Parent);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchJobDetails();
  }, [jobId]);

  if (loading) {
    return <SpinnerCircle />;
  }

  if (!job) {
    return (
      <ErrorComponent
        mainText="Job not found."
        secondaryText="The job you are looking for does not exist."
        customButton={
          <Button onClick={() => navigate('/worker/jobs')}>Go Back</Button>
        }
      />
    );
  }

  return (
    <Card className="flex flex-col text-center lg:w-1/4 mx-auto mt-10">
      <CardHeader>
        <CardTitle>Congratulation!!</CardTitle>
        <p className="text-sm text-gray-600">{job.title}</p>
        <p className="text-sm text-gray-600">{job.description}</p>
        <p className="text-sm text-gray-600">
          {format(job.startDateTime.toDate(), 'MMMM dd, yyyy - KK:mm a')}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 items-center justify-center">
          {job.baby && <Baby className="text-blue-500" />}
          {job.pet && <PawPrint className="text-green-500" />}
          {job.home && <House className="text-yellow-500" />}
        </div>

        <p className="font-semibold text-sm text-gray-600 mt-4">
          Parent Information:
        </p>
        {parent ? (
          <div className="text-sm text-gray-600">
            <p>{parent.name}</p>
            <p>{parent.email}</p>
            <p>{parent.phone || 'N/A'}</p>
            {parent.address && <p>{parent.address}</p>}
            {parent.city && <span>{parent.city}, </span>}
            {parent.state && <span>{parent.state}. </span>}
            {parent.zip && <span>{parent.zip}</span>}
            {parent.address && (
              <div className="mt-4">
                <iframe
                  title="Parent Location"
                  src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_APP_GOOGLE_API}&q=${encodeURIComponent(
                    parent.address
                  )}`}
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    parent.address
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline mt-2 block"
                >
                  View on Google Maps
                </a>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-600">Parent details not available.</p>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => navigate('/worker/jobs')}>
          Go Back
        </Button>
      </CardFooter>
    </Card>
  );
}
