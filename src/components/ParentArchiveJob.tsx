import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase-config';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface ParentArchiveJobProps {
  jobId: string;
  onArchive: () => void; // Add a callback prop
}

const ParentArchiveJob: React.FC<ParentArchiveJobProps> = ({
  jobId,
  onArchive,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleArchive = async () => {
    setLoading(true);
    try {
      const jobRef = doc(db, 'Jobs', jobId);
      await updateDoc(jobRef, { active: false });
      toast({
        title: 'Job Archived',
        description: 'The job has been successfully archived.',
      });
      setOpen(false);
      onArchive(); // Trigger the callback to refresh the job list
    } catch (error) {
      console.error('Error archiving job:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to archive the job. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        Archive
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <h2>Archive Job</h2>
          </DialogHeader>
          <p>
            Jobs can only be archived by changing their active status to false.
            Are you sure you want to archive this job?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleArchive} disabled={loading}>
              {loading ? 'Archiving...' : 'Archive'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ParentArchiveJob;
