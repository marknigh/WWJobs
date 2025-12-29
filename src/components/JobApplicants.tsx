import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { Award, Loader } from 'lucide-react'; // Import a smaller loading indicator

interface JobApplicantsProps {
  applied: string[];
  awarded: string;
}

interface UserPhoto {
  uid: string;
  photoURL: string | null;
}

export default function JobApplicants({
  applied = [], // Ensure applied is always an array
  awarded,
}: JobApplicantsProps) {
  const [appliedPhotos, setAppliedPhotos] = useState<UserPhoto[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState<boolean[]>([]); // State for loading avatars

  useEffect(() => {
    async function fetchAppliedPhotos() {
      try {
        setLoadingPhotos(new Array(applied.length).fill(true)); // Initialize loading state
        const photos = await Promise.all(
          applied.map(async (userId, index) => {
            const userDoc = await getDoc(doc(db, 'Users', userId));
            const photo = userDoc.exists()
              ? { uid: userId, photoURL: userDoc.data().photoURL }
              : { uid: userId, photoURL: null };
            setLoadingPhotos((prev) => {
              const updated = [...prev];
              updated[index] = false; // Set loading to false for this avatar
              return updated;
            });
            return photo;
          })
        );
        setAppliedPhotos(photos);
      } catch (error) {
        console.error(error);
      }
    }

    if (applied.length > 0) {
      fetchAppliedPhotos();
    }
  }, [applied]);

  return (
    <div className="flex flex-row gap-3">
      {appliedPhotos.map((user, index) => (
        <div key={index} className="relative">
          <Avatar className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
            {loadingPhotos[index] ? (
              <Loader className="h-2 w-2 animate-spin text-gray-500" /> // Ensure spinner is visible
            ) : user.photoURL ? (
              <AvatarImage
                src={user.photoURL}
                alt="Worker"
                className="h-full w-full object-cover rounded-full"
              />
            ) : (
              <AvatarFallback className="h-8 w-8 rounded-full">
                W
              </AvatarFallback>
            )}
          </Avatar>
          {awarded === user.uid && (
            <Award className="h-3 w-3 ring-[2px] ring-background rounded-full bg-gray-200 text-yellow-600 absolute bottom-0 right-0" />
          )}
        </div>
      ))}
    </div>
  );
}
