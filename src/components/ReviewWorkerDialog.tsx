import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase-config';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { DialogClose } from '@radix-ui/react-dialog';

interface ReviewWorkerDialogProps {
  jobId: string;
  awardedWorkerUid?: string;
  parent: string;
  children?: React.ReactNode;
}

const ReviewWorkerDialog: React.FC<ReviewWorkerDialogProps> = ({
  jobId,
  awardedWorkerUid,
  parent,
}) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [review, setReview] = useState<string>('');

  const closeDialog = () => {
    setOpen(false);
    setRating(null);
    setReview('');
  };

  const submitReview = async () => {
    try {
      // Add the review to the Reviews collection in Firestore
      await addDoc(collection(db, 'Reviews'), {
        jobId,
        workerId: awardedWorkerUid,
        rating,
        review,
        createdAt: Timestamp.now(),
        parentId: parent,
      });

      closeDialog();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">Review</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review Worker</DialogTitle>
          <DialogDescription>
            Provide a rating and review for the worker.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="font-medium">Rate the worker:</p>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`h-8 w-8 rounded-full ${
                    rating! >= star ? 'bg-yellow-500' : 'bg-gray-300'
                  }`}
                >
                  {star}
                </button>
              ))}
            </div>
          </div>
          <Textarea
            placeholder="Write your review here..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button onClick={submitReview}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewWorkerDialog;
