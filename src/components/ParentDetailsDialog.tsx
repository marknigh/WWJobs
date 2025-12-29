import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import { format } from 'date-fns';
import { PawPrint, Baby, House } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';

interface ParentDetails {
  parent: {
    id: string;
    name: string;
    email: string;
    address: string;
    city: string;
    zip: string;
    state: string;
    dateJoined: any;
    baby: boolean;
    pet: boolean;
    home: boolean;
    startDateTime: Timestamp;
    jobsAwarded: number;
    nextJob: string | null;
  };
}

const ParentDetailsDialog: React.FC<ParentDetails> = ({ parent }) => {
  const [totalJobsCreated, setTotalJobsCreated] = useState<number>(0);
  const [totalJobsAwarded, setTotalJobsAwarded] = useState<number>(
    parent.jobsAwarded
  );
  const [nextJob, setNextJob] = useState<string | null>(parent.nextJob);

  useEffect(() => {
    async function fetchAdditionalDetails() {
      try {
        // Query to count the total jobs created by the parent
        const jobsCreatedQuery = query(
          collection(db, 'Jobs'),
          where('parentId', '==', parent.id)
        );
        const jobsCreatedSnapshot = await getDocs(jobsCreatedQuery);
        setTotalJobsCreated(jobsCreatedSnapshot.size);

        // Query to count the total jobs awarded by the parent
        const jobsAwardedQuery = query(
          collection(db, 'Jobs'),
          where('parentId', '==', parent.id),
          where('awarded', '!=', null)
        );
        const jobsAwardedSnapshot = await getDocs(jobsAwardedQuery);
        setTotalJobsAwarded(jobsAwardedSnapshot.size);

        // Query to find the next job based on startDate
        const nextJobQuery = query(
          collection(db, 'Jobs'),
          where('parentId', '==', parent.id),
          where('startDateTime', '>', Timestamp.now()), // Filter jobs with startDate in the future
          orderBy('startDateTime', 'asc'), // Order by startDate in ascending order
          limit(1) // Limit to the next job
        );
        const nextJobSnapshot = await getDocs(nextJobQuery);
        if (!nextJobSnapshot.empty) {
          const job = nextJobSnapshot.docs[0].data();
          const formattedDate = format(
            job.startDateTime.toDate(),
            'MMMM dd, yyyy K:mm a'
          );
          setNextJob(formattedDate);
        } else {
          setNextJob('No upcoming jobs');
        }
      } catch (error) {
        console.error('Error fetching additional parent details:', error);
      }
    }

    fetchAdditionalDetails();
  }, [parent.id]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex min-w-0 gap-x-4 cursor-pointer">
          <div className="min-w-0 flex-auto">
            <div className="flex justify-between">
              <p className="text-sm font-semibold">{parent.name}</p>
              <p className="text-xs text-right">
                {parent.address}, {parent.city}, {parent.state} {parent.zip}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="mt-1 truncate text-xs">{parent.email}</p>
              <p className="text-xs text-right">
                Joined: {parent.dateJoined.toDate().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-center">
            {parent.name}
            <p className="text-xs font-normal text-center">
              {parent.dateJoined
                ? `Member Since: ${format(parent.dateJoined.toDate(), 'MMMM yyyy')}`
                : 'N/A'}
            </p>
          </DialogTitle>
        </DialogHeader>
        <div>
          <p className="text-sm text-center">{parent.email}</p>
          <p className="text-sm text-center">
            {parent.address} &#x2022; {parent.city}, {parent.state}.{' '}
            {parent.zip}
          </p>
        </div>
        <div className="flex justify-center space-x-2">
          <Avatar className="w-6 h-6 rounded-full">
            <AvatarImage
              src="/broken-image.jpg"
              className="w-full h-full rounded-full"
            />
            <AvatarFallback className="w-full h-full flex items-center justify-center bg-red-600 text-white rounded-full">
              {totalJobsCreated}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">Jobs Created</span>
        </div>
        <div className="flex justify-center space-x-2">
          <Avatar className="w-6 h-6 rounded-full">
            <AvatarImage
              src="/broken-image.jpg"
              className="w-full h-full rounded-full"
            />
            <AvatarFallback className="w-full h-full flex items-center justify-center bg-blue-600 text-white rounded-full">
              {totalJobsAwarded}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">Jobs Awarded</span>
        </div>
        <p className="text-sm text-center">
          <strong>Next Scheduled Job</strong>: {nextJob}
        </p>
        <div className="flex justify-center space-x-4">
          {parent.baby && <Baby />}
          {parent.pet && <PawPrint />}
          {parent.home && <House />}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParentDetailsDialog;
