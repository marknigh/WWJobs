import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase-config';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import useFirebaseAuth from '@/hooks/use-auth-state-change';
import { EllipsisVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { House, Baby, PawPrint } from 'lucide-react';
import WorkerApply from '@/components/WorkerApply';
import WorkerUnApply from '@/components/WorkerUnApply';
import { Switch } from '@/components/ui/switch';
import SpinnerCircle from '@/components/SpinnerCircle';
import { useMediaQuery } from 'react-responsive';
import { Card, CardContent } from '@/components/ui/card';
import JobApplicants from '@/components/JobApplicants'; // Import the new child component
import { Job } from '@/types/models'; // Import the Job interface
import WorkerJobListSmallScreen from './WorkerJobListSmallScreen'; // Import the new component

interface ExtendedJob extends Job {
  parentName: string;
}

export default function WorkerJobList() {
  const [jobs, setJobs] = useState<ExtendedJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<ExtendedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterNotAwarded, setFilterNotAwarded] = useState(false);
  const { authUser, authLoading } = useFirebaseAuth();
  const isSmallScreen = useMediaQuery({ query: '(max-width: 768px)' });
  const navigate = useNavigate();

  async function fetchJobs() {
    try {
      const q = query(collection(db, 'Jobs'), where('active', '==', true));
      const querySnapshot = await getDocs(q);
      const activeJobs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Job[];

      // Fetch worker photos and parent names for each job
      const jobsWithDetails = await Promise.all(
        activeJobs.map(async (job) => {
          let parentName = 'Unknown';
          if (job.parentId) {
            const parentDoc = await getDoc(doc(db, 'Users', job.parentId));
            if (parentDoc.exists()) {
              parentName = parentDoc.data().name;
            }
          }

          let workerPhotos: { uid: string; photoURL: string | null }[] = [];
          if (job.applied && job.applied.length > 0) {
            workerPhotos = await Promise.all(
              job.applied.map(async (workerId) => {
                const workerDoc = await getDoc(doc(db, 'Users', workerId));
                return workerDoc.exists()
                  ? { uid: workerId, photoURL: workerDoc.data().photoURL }
                  : { uid: workerId, photoURL: null };
              })
            );
          }

          return { ...job, workerPhotos, parentName };
        })
      );

      setJobs(jobsWithDetails);
      setFilteredJobs(jobsWithDetails); // Initialize filtered jobs
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!authLoading) {
      fetchJobs();
    }
  }, [authLoading]);

  const handleJobApplied = () => {
    fetchJobs();
  };

  const handleFilterChange = (checked: boolean) => {
    setFilterNotAwarded(checked);
    if (checked) {
      // Filter jobs that are not awarded
      const notAwardedJobs = jobs.filter((job) => !job.awarded);
      setFilteredJobs(notAwardedJobs);
    } else {
      // Reset to all jobs
      setFilteredJobs(jobs);
    }
  };

  if (authLoading || loading) {
    return <SpinnerCircle />;
  }
  return (
    <>
      {isSmallScreen ? (
        <WorkerJobListSmallScreen jobs={filteredJobs} />
      ) : (
        <>
          <div className="flex items-center justify-end lg:w-3/4 m-6">
            <Switch
              id="filter-not-awarded"
              checked={filterNotAwarded}
              onCheckedChange={handleFilterChange}
            />
            <label
              htmlFor="filter-not-awarded"
              className="ml-2 text-sm font-medium text-gray-700"
            >
              Show Not Awarded Jobs
            </label>
          </div>
          <div className="flex lg:w-3/4 mx-auto">
            <Table>
              <TableCaption>A list of Active Jobs.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Parent</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Applied Workers</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>{job.parentName}</TableCell>
                    <TableCell>{job.title}</TableCell>
                    <TableCell>{job.description}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {job.baby && (
                          <Avatar>
                            <AvatarImage src="/broken-image.jpg" alt="Baby" />
                            <AvatarFallback>
                              <Baby />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        {job.pet && (
                          <Avatar>
                            <AvatarImage src="/broken-image.jpg" alt="Pet" />
                            <AvatarFallback>
                              <PawPrint />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        {job.home && (
                          <Avatar>
                            <AvatarImage src="/broken-image.jpg" alt="Home" />
                            <AvatarFallback>
                              <House />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(job.startDateTime.toDate(), 'MM/dd/yyyy')}
                    </TableCell>
                    <TableCell>
                      <JobApplicants
                        applied={job.applied || []}
                        awarded={job.awarded || ''}
                      />
                    </TableCell>
                    <TableCell>
                      <>
                        {authUser &&
                          (job.awarded === authUser.uid ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <EllipsisVertical />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() =>
                                    navigate(`/worker/${job.id}/won`)
                                  }
                                >
                                  You Won!!
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : job.applied?.includes(authUser.uid) ? (
                            <WorkerUnApply
                              job={job}
                              userAuth={authUser}
                              onJobWidthdrawn={handleJobApplied}
                            />
                          ) : (
                            <WorkerApply
                              job={job}
                              userAuth={authUser}
                              onJobApplied={handleJobApplied}
                            />
                          ))}
                      </>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </>
  );
}
