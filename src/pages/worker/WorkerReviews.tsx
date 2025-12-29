import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  doc,
  getDoc,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import useFirebaseAuth from '@/hooks/use-auth-state-change';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SpinnerCircle from '@/components/SpinnerCircle';

interface Review {
  jobId: string;
  workerId: string;
  rating: number;
  review: string;
  createdAt: Date;
  parentId: string;
}

export default function WorkersReviews() {
  const { authUser } = useFirebaseAuth();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [overallRating, setOverallRating] = useState<number | null>(null);

  useEffect(() => {
    async function fetchReviews() {
      if (!authUser) return;

      try {
        // Query reviews for the authenticated worker
        const reviewsQuery = query(
          collection(db, 'Reviews'),
          where('workerId', '==', authUser.uid)
        );
        const querySnapshot = await getDocs(reviewsQuery);

        const reviewsData = await Promise.all(
          querySnapshot.docs.map(async (document) => {
            const data = document.data();

            // Fetch parent name from Users collection
            const parentRef = doc(db, 'Users', data.parentId);
            const parentDoc = await getDoc(parentRef);
            const parentName = parentDoc.exists()
              ? parentDoc.data().name
              : 'Unknown Parent';
            // Fetch job title from Jobs collection
            const jobRef = doc(db, 'Jobs', data.jobId);
            const jobDoc = await getDoc(jobRef);
            const jobTitle = jobDoc.exists()
              ? jobDoc.data().title
              : 'Unknown Job';

            return {
              jobTitle: jobTitle,
              workerId: data.workerUid,
              rating: data.rating,
              review: data.review,
              createdAt: data.createdAt.toDate(),
              parentName: parentName,
              parentId: data.parentId,
              jobId: data.jobId,
            };
          })
        );

        setReviews(reviewsData);

        // Calculate the overall rating
        const totalRating = reviewsData.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        const averageRating =
          reviewsData.length > 0 ? totalRating / reviewsData.length : null;
        setOverallRating(averageRating);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [authUser]);

  return (
    <>
      {loading ? (
        <SpinnerCircle />
      ) : (
        <>
          <div className="text-lg font-semibold">
            Overall Rating:{' '}
            {overallRating !== null
              ? overallRating.toFixed(1)
              : 'No reviews yet'}
          </div>
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.jobId}>
                <CardHeader>
                  <CardTitle>
                    <p>{review.jobTitle}</p>
                    <p className="text-sm text-gray-500 mt-3">
                      {review.parentName} -
                      {format(review.createdAt, 'MMMM dd, yyyy')}{' '}
                    </p>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-yellow-500">
                    {'★'.repeat(review.rating)}
                    {'☆'.repeat(5 - review.rating)}
                  </div>
                  <p className="mt-2">{review.review}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </>
  );
}
