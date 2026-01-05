import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
import { format } from 'date-fns';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';

interface NextJob {
  id: string;
  title: string;
  description: string;
  startDateTime: string;
  applied: string[];
  awarded?: string | null;
}

interface Applicant {
  id: string;
  name: string;
  email: string;
}

export default function NextJobCard() {
  const [nextJob, setNextJob] = useState<NextJob | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [awardedApplicant, setAwardedApplicant] = useState<string | null>(null);
  const { authUser } = useFirebaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchNextJob() {
      if (!authUser) return;

      const q = query(
        collection(db, 'Jobs'),
        where('parentId', '==', authUser.uid),
        where('startDateTime', '>=', new Date())
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const jobData = querySnapshot.docs[0].data();
        setNextJob({
          id: querySnapshot.docs[0].id,
          title: jobData.title,
          description: jobData.description,
          startDateTime: format(
            jobData.startDateTime.toDate(),
            'MMMM dd, yyyy KK:mm a'
          ),
          applied: jobData.applied || [],
          awarded: jobData.awarded || null,
        });
      }
    }

    fetchNextJob();
  }, [authUser]);

  useEffect(() => {
    async function fetchApplicants(appliedIds: string[]) {
      const fetchedApplicants = await Promise.all(
        appliedIds.map(async (userId) => {
          const userDoc = await getDoc(doc(db, 'Users', userId));
          if (userDoc.exists()) {
            const data = userDoc.data();
            return {
              id: userDoc.id,
              name: data.name,
              email: data.email,
            };
          }
          return null;
        })
      );
      setApplicants(
        fetchedApplicants.filter((applicant) => applicant !== null)
      );
    }
    fetchApplicants(nextJob?.applied || []);
  }, [nextJob]);

  useEffect(() => {
    async function fetchAwardedApplicant(userId: string) {
      const userDoc = await getDoc(doc(db, 'Users', userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setAwardedApplicant(data.name || 'Unknown');
      }
    }

    if (nextJob?.awarded) {
      fetchAwardedApplicant(nextJob.awarded);
    } else {
      setAwardedApplicant(null);
    }
  }, [nextJob]);

  return (
    <div className="flex flex-col items-center justify-center p-4 lg:w-1/3 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Next Job</CardTitle>
        </CardHeader>
        <CardContent>
          {nextJob ? (
            <div className="space-y-2">
              <p>{nextJob.title}</p>
              <p>{nextJob.description}</p>
              <p>{nextJob.startDateTime}</p>
              <div>
                <h4 className="font-semibold">Applicants:</h4>
                {applicants.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {applicants.map((applicant) => (
                      <div
                        key={applicant.id}
                        className="p-4 border rounded shadow-sm"
                      >
                        <h5 className="font-medium">{applicant.name}</h5>
                        <p className="text-sm text-gray-600">
                          {applicant.email}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No one has applied yet.</p>
                )}
              </div>
              {awardedApplicant && (
                <div className="mt-4">
                  <h4 className="font-semibold">Awarded Applicant:</h4>
                  <p>{awardedApplicant}</p>
                </div>
              )}
              <Button
                className="mt-4 px-4 py-2 w-full"
                onClick={() =>
                  navigate(
                    applicants.length > 0
                      ? `/parent/${nextJob.id}/view`
                      : `/parent/${nextJob.id}/edit`
                  )
                }
              >
                {applicants.length > 0 ? 'View Job Details' : 'Edit Job'}
              </Button>
            </div>
          ) : (
            <p>No upcoming jobs found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
