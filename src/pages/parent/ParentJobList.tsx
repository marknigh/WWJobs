import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import useFirebaseAuth from '@/hooks/use-auth-state-change';
import { EllipsisVertical, CircleCheck, CircleX } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router';
import { format } from 'date-fns';
import { House, Baby, PawPrint } from 'lucide-react';
import ReviewWorkerDialog from '@/components/ReviewWorkerDialog';
import JobApplicants from '@/components/JobApplicants'; // Import the new child component
import SpinnerCircle from '@/components/SpinnerCircle';
import ErrorComponent from '@/components/ErrorComponent'; // Import the ErrorComponent
import { Job } from '@/types/models'; // Import the Job type
import { useNavigate } from 'react-router';
import ParentArchiveJob from '@/components/ParentArchiveJob'; // Import the new component

const ParentJobList = () => {
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Add error state
  const { authUser, authLoading } = useFirebaseAuth();
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      if (authUser) {
        const q = query(
          collection(db, 'Jobs'),
          where('parentId', '==', authUser.uid)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          setError('No jobs found.');
          return;
        }
        const jobsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Job[];

        setMyJobs(jobsData);
      }
    } catch (error) {
      console.error(error);
      setError('Failed to load jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchJobs();
    }
  }, [authUser, authLoading]);

  if (loading) {
    return <SpinnerCircle />;
  }

  if (error) {
    return (
      <ErrorComponent
        mainText={error}
        secondaryText={
          error === 'No jobs found.'
            ? 'You have not posted any jobs yet.'
            : 'An unexpected error occurred. Please try again later.'
        }
        customButton={
          error === 'No jobs found.' ? (
            <Button
              onClick={() => navigate('/parent/job/new')}
              variant="outline"
            >
              Post Your First Job
            </Button>
          ) : null
        }
      />
    );
  }

  return (
    <>
      <div className="flex lg:w-3/4 justify-end mx-20 my-6">
        <div>
          <Button asChild>
            <Link to="/parent/job/new">New Job</Link>
          </Button>
        </div>
      </div>
      <div className="flex lg:w-3/4 mx-auto">
        <Table>
          <TableCaption>A list of your job postings.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myJobs.map((job: Job) => (
              <TableRow key={job.id}>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.description}</TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    {job.baby && <Baby />}
                    {job.pet && <PawPrint />}
                    {job.home && <House />}
                  </div>
                </TableCell>
                <TableCell>
                  {format(job.startDateTime.toDate(), 'MM/dd/yyyy')}
                </TableCell>
                <TableCell>
                  {job.active ? (
                    <CircleCheck className="text-green-800" />
                  ) : (
                    <CircleX className="text-red-800" />
                  )}
                </TableCell>
                <TableCell>
                  <JobApplicants
                    applied={job.applied ?? []}
                    awarded={job.awarded ?? ''}
                  />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <EllipsisVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-12">
                      <DropdownMenuLabel>Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {job.awarded ? (
                        <DropdownMenuItem asChild>
                          <Link to={`/parent/${job.id}/view`}>View</Link>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem asChild>
                          <Link to={`/parent/${job.id}/edit`}>Edit</Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild>
                        <ParentArchiveJob
                          jobId={job.id}
                          onArchive={fetchJobs} // Pass the fetchJobs function as a callback
                        />
                      </DropdownMenuItem>
                      {!job.awarded && (
                        <DropdownMenuItem asChild>
                          <Link to={`/parent/${job.id}/award`}>Award</Link>
                        </DropdownMenuItem>
                      )}
                      {job.awarded &&
                        job.startDateTime.toDate() < new Date() &&
                        authUser && (
                          <ReviewWorkerDialog
                            jobId={job.id}
                            awardedWorkerUid={job.awarded}
                            parent={authUser.uid}
                          />
                        )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default ParentJobList;
