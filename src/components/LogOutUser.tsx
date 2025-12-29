import React from 'react';
import { useNavigate } from 'react-router';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase-config';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export const LogOutUser: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  return (
    <Button size="icon" variant="outline" onClick={handleLogout}>
      <LogOut />
    </Button>
  );
};
