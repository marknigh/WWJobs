import { Timestamp } from 'firebase/firestore';

export interface Parent {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  baby: boolean;
  pet: boolean;
  home: boolean;
  children: string;
  pets: string;
}

export interface Job {
  title: string;
  description: string;
  startDateTime: Timestamp;
  active: boolean;
  id: string;
  baby: boolean;
  pet: boolean;
  home: boolean;
  applied?: string[];
  awarded?: string;
  parentId: string;
  entryDate: Date;
  location: string;
}

export interface Worker {
  id: string;
  dateJoined: Timestamp;
  email: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  mobile: string;
  baby: boolean;
  pet: boolean;
  home: boolean;
  gender: string;
  dob: Timestamp;
  school: string;
  notes: string;
  photoURL: string;
}

// Form type for UI - uses Date instead of Timestamp
export type WorkerFormData = Omit<Worker, 'dob' | 'dateJoined'> & {
  dob: Date;
  dateJoined: Date;
};

export interface Review {
  id: string;
  rating: number;
  review: string;
  parentName: string;
  createdAt: Timestamp;
}