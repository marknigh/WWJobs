import { db } from '../lib/firebase-config';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { doc, updateDoc, arrayRemove } from 'firebase/firestore';
// import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import { EllipsisVertical } from 'lucide-react';
import { Job } from '@/types/models';

interface WorkerApplyProps {
  job: Job;
  userAuth: any;
  onJobWidthdrawn: any;
}

const WorkerUnApply = ({
  job,
  userAuth,
  onJobWidthdrawn,
}: WorkerApplyProps) => {
  const { toast } = useToast();

  async function Withdraw() {
    try {
      const jobRef = doc(db, 'Jobs', job.id);
      await updateDoc(jobRef, {
        applied: arrayRemove(userAuth.uid),
      });
      toast({
        title: 'You have Successfully Withdrawn',
        // description: 'Friday, February 10, 2023 at 5:57 PM',
      });
      onJobWidthdrawn();
    } catch (error) {
      console.log('🚀 ~ Apply ~ error:', error);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-12">
        <DropdownMenuItem asChild>
          <Dialog>
            <DialogTrigger>Withdraw</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Do you want to withdrawn your application for {job.title}
                </DialogTitle>
                <DialogDescription>{job.description}</DialogDescription>
              </DialogHeader>
              <DialogFooter className="justify-start">
                <Button variant="default" onClick={Withdraw}>
                  Withdraw?
                </Button>
                <DialogClose asChild>
                  <Button variant="secondary">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WorkerUnApply;
