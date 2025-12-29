import React, { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import { format } from 'date-fns';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';

import { Job } from '@/types/models';
import { useToast } from '@/hooks/use-toast';
import SpinnerCircle from '@/components/SpinnerCircle'; // Import SpinnerCircle

export default function FutureJobs({ id }: { id: string }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null); // State for selected job
  const [dialogOpen, setDialogOpen] = useState(false); // State for dialog visibility
  const [loading, setLoading] = useState(true); // State for loading
  const { toast } = useToast();

  useEffect(() => {
    // Fetch jobs that are in the future and not awarded
    async function fetchJobs() {
      try {
        const jobsQuery = query(
          collection(db, 'Jobs'),
          where('active', '==', true),
          where('startDateTime', '>', new Date()),
          where('awarded', '==', null), // Job not awarded
          limit(10) // Limit to 10 jobs
        );

        const querySnapshot = await getDocs(jobsQuery);
        const jobsData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id, // Include the document ID
            ...(doc.data() as Job),
          }))
          .filter((job: Job) => !job.applied?.includes(id)); // Exclude jobs where the worker has already applied
        setJobs(jobsData);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    }
    fetchJobs();
  }, [id]);

  // Function to handle applying for a job
  async function applyForJob(jobId: string) {
    try {
      const jobRef = doc(db, 'Jobs', jobId);
      await updateDoc(jobRef, {
        applied: arrayUnion(id), // Add worker ID to the applied array
      });
      setDialogOpen(false); // Close dialog after applying
      toast({
        title: 'Application Successful',
      });
    } catch (error) {
      console.error('Error applying for job:', error);
    }
  }

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-lg font-bold mb-4">Jobs You Should Apply For</h2>
      {loading ? (
        <SpinnerCircle /> // Show SpinnerCircle while loading
      ) : jobs.length > 0 ? (
        <>
          <ul className="space-y-2">
            {jobs.map((job: Job) => (
              <li key={job.id} className="p-2 border rounded">
                <h3 className="font-semibold">{job.title}</h3>
                <p>
                  {format(job.startDateTime.toDate(), 'MMM dd, yyyy KK:mm a')}
                </p>
                <p>{job.description}</p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedJob(job); // Set the selected job
                    setDialogOpen(true); // Open the dialog
                  }}
                >
                  Apply
                </Button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No available future jobs.</p>
      )}

      {/* Dialog for applying to a job */}
      {selectedJob && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedJob.title}</DialogTitle>
              <p className="text-sm text-pretty">{selectedJob.description}</p>
            </DialogHeader>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => applyForJob(selectedJob.id)}>
                Confirm Application
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
