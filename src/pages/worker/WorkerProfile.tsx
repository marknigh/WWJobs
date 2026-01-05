import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { db, storage } from '@/lib/firebase-config';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import {
  getDownloadURL,
  uploadBytes,
  ref as storageRef,
} from 'firebase/storage';
import useFirebaseAuth from '@/hooks/use-auth-state-change';
import SpinnerCircle from '@/components/SpinnerCircle';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SanitizePicture } from '@/lib/SanitizePicture';
import { DateTimePicker } from '@/components/DateTimePicker';
import { Worker, WorkerFormData } from '@/types/models';
import { Label } from '@/components/ui/label';

const profileSchema = z.object({
  id: z.string(),
  dateJoined: z.date(),
  email: z.string().email({ message: 'Invalid email address' }),
  name: z.string().min(1, { message: 'Name is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  zip: z.string().min(1, { message: 'ZIP code is required' }),
  mobile: z.string().min(1, { message: 'Mobile phone number is required' }),
  baby: z.boolean(),
  pet: z.boolean(),
  home: z.boolean(),
  gender: z.string().min(1, { message: 'Gender is required' }),
  dob: z.date(),
  school: z.string().min(1, { message: 'School is required' }),
  notes: z.string().min(1, { message: 'Notes are required' }),
  photoURL: z.string(),
});

export default function WorkerProfile() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<Worker>({
    id: '',
    dateJoined: Timestamp.fromDate(new Date()),
    email: '',
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    mobile: '',
    baby: false,
    pet: false,
    home: false,
    gender: '',
    dob: Timestamp.now(),
    school: '',
    notes: '',
    photoURL: '',
  });
  const [loading, setLoading] = useState(true);
  const { authUser, authLoading } = useFirebaseAuth();
  const { toast } = useToast();
  const form = useForm<WorkerFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    async function fetchProfile() {
      if (authUser) {
        const docRef = doc(db, 'Users', authUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const workerData = docSnap.data() as Worker;

          // Convert Worker to WorkerFormData for the form
          const formData: WorkerFormData = {
            ...workerData,
            dob: workerData.dob?.toDate() || new Date(),
            dateJoined: workerData.dateJoined?.toDate() || new Date(),
          };

          console.log('🚀 ~ fetchProfile ~ formData:', formData);
          setProfile(workerData);
          form.reset(formData);
        } else {
          console.log('No such document!');
        }
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchProfile();
    }
  }, [authUser, authLoading]);

  const handlePhotoChange = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const fileOk = await SanitizePicture(event.target.files[0]);
        if (fileOk && authUser) {
          const imageRef = storageRef(storage, 'userImages/' + authUser.uid);
          await uploadBytes(imageRef, file);
          const downloadURL = await getDownloadURL(imageRef);
          const userRef = doc(db, 'Users', authUser.uid);
          await updateDoc(userRef, { photoURL: downloadURL });
          setProfile({ ...profile, photoURL: downloadURL });
          form.setValue('photoURL', downloadURL);
        }
        toast({
          title: 'Profile Updated',
          description: new Date().toLocaleString(),
        });
      } catch (error) {
        console.log('File is not an image: ', error);
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
        });
      }
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (data: WorkerFormData) => {
    try {
      // Convert WorkerFormData to Worker for Firebase
      if (authUser) {
        const workerData: Partial<Worker> = {
          ...data,
          dob: Timestamp.fromDate(data.dob),
          dateJoined: Timestamp.fromDate(data.dateJoined),
        };

        const profileRef = doc(db, 'Users', authUser.uid);
        await updateDoc(profileRef, workerData);
        toast({
          title: 'Profile Updated',
          description: new Date().toLocaleString(),
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    }
  };

  return (
    <>
      {loading ? (
        <SpinnerCircle />
      ) : (
        <div className="flex flex-col items-center justify-center w-full p-4 space-y-6 max-h-screen overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full lg:w-1/3">
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        disabled
                        placeholder="Your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row items-center gap-8 mt-4">
                <FormField
                  control={form.control}
                  name="photoURL"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel htmlFor="photo">Photo</FormLabel>
                      <FormControl className="flex flex-row items-center gap-4">
                        <div
                          onClick={handleAvatarClick}
                          style={{ cursor: 'pointer' }}
                        >
                          <Avatar>
                            <AvatarImage src={field.value} />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <input
                            className="w-1"
                            ref={fileInputRef}
                            type="file"
                            style={{ display: 'none' }}
                            accept=".png,.jpg"
                            onChange={handlePhotoChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full lg:w-1/3">
                      <FormLabel htmlFor="name">Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-row flex-wrap gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="w-full lg:w-1/4">
                      <FormLabel htmlFor="address">Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Your address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="w-full lg:w-1/6">
                      <FormLabel htmlFor="city">City</FormLabel>
                      <FormControl>
                        <Input placeholder="Your city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="w-full lg:w-1/6">
                      <FormLabel htmlFor="state">State</FormLabel>
                      <FormControl>
                        <Input placeholder="Your State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zip"
                  render={({ field }) => (
                    <FormItem className="w-full lg:w-1/6">
                      <FormLabel htmlFor="zip">ZIP Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Your ZIP code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-row gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem className="w-full lg:w-1/4">
                      <FormLabel htmlFor="mobile">
                        Mobile Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Your mobile number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2 mt-4 w-full">
                <Label className="">Jobs you like</Label>
              </div>
              <div className="flex flex-row gap-12 mt-2">
                <FormField
                  control={form.control}
                  name="baby"
                  render={({ field }) => (
                    <FormItem className="w-full lg:w-1/6 space-x-2">
                      <FormControl>
                        <Switch
                          id="baby"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel htmlFor="baby">Baby</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pet"
                  render={({ field }) => (
                    <FormItem className="w-full lg:w-1/6 space-x-2">
                      <FormControl>
                        <Switch
                          id="pet"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel htmlFor="pet">Pet</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="home"
                  render={({ field }) => (
                    <FormItem className="w-full lg:w-1/6 space-x-2">
                      <FormControl>
                        <Switch
                          id="home"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel htmlFor="home">Home</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-row flex-wrap gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="w-full lg:w-1/6">
                      <FormLabel htmlFor="gender">Gender</FormLabel>
                      <FormControl>
                        <Select
                          defaultValue={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="w-full lg:w-1/4">
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          displayFormat={{ hour24: 'MMMM dd, yyyy' }}
                          granularity="day"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="What's your Birthday?"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem className="w-full lg:w-1/4">
                      <FormLabel htmlFor="school">School</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your school or university"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-row gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="w-full lg:w-1/2">
                      <FormLabel htmlFor="notes">About Me</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about yourself"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="mt-4">
                Save Changes
              </Button>
            </form>
          </Form>
        </div>
      )}
    </>
  );
}
