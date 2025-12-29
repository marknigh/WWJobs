import { Card, CardContent } from '@/components/ui/card';
import { Baby, PawPrint, House } from 'lucide-react';
import { format } from 'date-fns';
import { Job } from '@/types/models';
import useFirebaseAuth from '@/hooks/use-auth-state-change'; // Import the hook
import SpinnerCircle from '@/components/SpinnerCircle'; // Import the spinner component
import { useNavigate } from 'react-router'; // Import useRouter for navigation
import { Button } from '@/components/ui/button'; // Import the Button component

interface WorkerJobListSmallScreenProps {
  jobs: Job[];
}

export default function WorkerJobListSmallScreen({
  jobs,
}: WorkerJobListSmallScreenProps) {
  const { authUser, authLoading } = useFirebaseAuth(); // Get the current authenticated user
  const navigate = useNavigate(); // Initialize router for navigation

  const handleViewJobClick = (job: Job, hasWon: boolean) => {
    if (hasWon) {
      navigate(`/worker/${job.id}/won`); // Navigate to won job details page
    } else {
      navigate(`/worker/${job.id}/view`); // Navigate to view job details page
    }
  };

  const getJobStatus = (job: Job) => {
    const hasWon = authUser.uid === job.awarded;
    const hasApplied = !hasWon && job.applied?.includes(authUser.uid);
    const isViewable = hasWon || (hasApplied && !job.awarded);
    return { hasWon, hasApplied, isViewable };
  };

  return (
    <>
      {authLoading ? (
        <SpinnerCircle />
      ) : (
        <div className="flex flex-col mx-4 text-center">
          {jobs.map((job) => {
            const { hasWon, hasApplied, isViewable } = getJobStatus(job);

            return (
              <Card key={job.id} className="mt-6 p-4">
                <CardContent>
                  <p className="text-md font-bold">{job.title}</p>
                  <p className="text-sm font-sans">{job.description}</p>
                  <p className="text-sm ">
                    {format(job.startDateTime.toDate(), 'MM/dd/yyyy KK:mm a')}
                  </p>
                  <div className="flex space-x-2 mt-2 justify-center">
                    {job.baby && <Baby />}
                    {job.pet && <PawPrint />}
                    {job.home && <House />}
                  </div>
                  <p className="text-sm mt-4 font-semibold">
                    {hasWon
                      ? 'You have won this job!'
                      : hasApplied && job.awarded
                        ? 'Sorry, but another worker was awarded this job.'
                        : hasApplied
                          ? 'You have applied for this job.'
                          : ''}
                  </p>
                  {(isViewable ||
                    (job.awarded !== null &&
                      !job.applied?.includes(authUser.uid))) && (
                    <div className="mt-4">
                      <Button onClick={() => handleViewJobClick(job, hasWon)}>
                        {hasWon ? 'View Won Job' : 'View Job'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
