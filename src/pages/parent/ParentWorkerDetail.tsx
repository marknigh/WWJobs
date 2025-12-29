import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { db } from '@/lib/firebase-config';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { Star } from 'lucide-react';
import { format } from 'date-fns';
import SpinnerCircle from '@/components/SpinnerCircle';
import { Button } from '@/components/ui/button';
import { Worker, Review } from '@/types/models';

export default function WorkerDetail() {
  const { workerId } = useParams();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function GetWorkerAndReviews() {
      try {
        // Get worker details
        if (!workerId) {
          throw new Error('Worker ID is undefined');
        }
        const docRef = doc(db, 'Users', workerId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setWorker(docSnap.data() as Worker);
        }

        // Get reviews for the worker
        const reviewsQuery = query(
          collection(db, 'Reviews'),
          where('workerId', '==', workerId)
        );
        const reviewsSnap = await getDocs(reviewsQuery);
        const fetchedReviews: Review[] = [];

        for (const reviewDoc of reviewsSnap.docs) {
          const reviewData = reviewDoc.data();
          const parentId = reviewData.parentId; // Assuming `parentId` exists in the review document

          // Fetch parent name using parentId
          let parentName = 'Unknown';
          if (parentId) {
            const parentDocRef = doc(db, 'Users', parentId); // Assuming `Parents` collection exists
            const parentDocSnap = await getDoc(parentDocRef);
            if (parentDocSnap.exists()) {
              parentName = parentDocSnap.data().name; // Assuming `name` field exists in the parent document
            }
          }

          fetchedReviews.push({
            id: reviewDoc.id,
            rating: reviewData.rating,
            review: reviewData.review,
            parentName,
            createdAt: reviewData.createdAt,
          } as Review);
        }

        setReviews(fetchedReviews);
      } catch (error) {
        console.error('Error fetching worker or reviews:', error);
      } finally {
        setLoading(false);
      }
    }

    GetWorkerAndReviews();
  }, [workerId]);

  if (loading) {
    return <SpinnerCircle />;
  }

  if (!worker) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>Worker not found</p>
        <Button onClick={() => navigate('/parent/workers')} variant="outline">
          Workers List
        </Button>
      </div>
    );
  }

  const calculateOverallRating = (reviews: Review[]) => {
    if (reviews.length === 0) return 'No reviews';
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  return (
    <div className="p-4 lg:w-1/3 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{worker.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8 rounded-full">
              <AvatarImage
                src={worker.photoURL || '/broken-image.jpg'}
                alt="Worker"
                className="h-full w-full object-cover rounded-full"
              />
              <AvatarFallback className="h-8 w-8 rounded-full">
                W
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Gender: {worker.gender}</p>
              <p className="text-sm font-medium">
                Birthday: {format(worker.dob.toDate(), 'PPP')}
              </p>
              {reviews.length > 0 && (
                <>
                  <p className="text-sm font-medium">
                    Overall Rating: {calculateOverallRating(reviews)}
                  </p>
                  <p className="text-sm font-medium">
                    Number of Reviews: {reviews.length}
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-sm text-gray-600">
                No reviews have been written.
              </p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {reviews.map((review) => (
                  <li key={review.id} className="py-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < review.rating
                              ? 'text-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-sm">
                      {review.parentName} -{' '}
                      {format(review.createdAt.toDate(), 'MMMM yyyy')}
                    </p>
                    <p className="mt-1 text-sm font-light text-gray-600">
                      {review.review}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => navigate('/parent/workers')}
            variant="outline"
            className="w-full"
          >
            Workers List
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
