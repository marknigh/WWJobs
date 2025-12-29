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
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { EllipsisVertical } from 'lucide-react';

function WorkerApply({ job, userAuth, onJobApplied }) {
  const { toast } = useToast();

  async function Apply() {
    try {
      const jobRef = doc(db, 'Jobs', job.id);
      await updateDoc(jobRef, {
        applied: arrayUnion(userAuth.uid),
      });
      console.log('🚀 ~ Apply ~ props.userAuth.uid:', userAuth.uid);
      toast({
        title: 'You have successfully applied for ' + job.title,
        description: format(new Date(), 'MMM dd, yyyy'),
      });
      onJobApplied();
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
            <DialogTrigger>Apply</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Do you want to apply for {job.title}</DialogTitle>
                <DialogDescription>{job.description}</DialogDescription>
              </DialogHeader>
              <DialogFooter className="justify-start">
                <Button variant="default" onClick={Apply}>
                  Apply
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
}

export default WorkerApply;
