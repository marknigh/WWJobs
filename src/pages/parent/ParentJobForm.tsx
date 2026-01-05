import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { DateTimePicker } from '@/components/DateTimePicker';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { doc, getDoc, collection, addDoc, updateDoc } from 'firebase/firestore';
import useFirebaseAuth from '@/hooks/use-auth-state-change';
import { db } from '@/lib/firebase-config';
import { useParams } from 'react-router';
import SpinnerCircle from '@/components/SpinnerCircle';
import { Job } from '@/types/models';
import { useToast } from '@/hooks/use-toast';

const jobSchema = z
  .object({
    title: z.string().nonempty('Job title is required'),
    description: z.string().nonempty('Description is required'),
    startDateTime: z.date(),
    baby: z.boolean(),
    pet: z.boolean(),
    home: z.boolean(),
    active: z.boolean(),
  })
  .refine((data) => data.baby || data.pet || data.home, {
    message: 'At least one of Baby Care, Pet Care, or Home Care is required',
    path: ['baby'], // Associate the error with the "baby" field
  });

export default function ParentJobForm() {
  const { authUser, authLoading } = useFirebaseAuth();
  const { jobId } = useParams();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const isEditing = !!jobId;

  const form = useForm<Job>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      entryDate: new Date(),
      description: '',
      title: '',
      startDateTime: new Date(),
      baby: false,
      pet: false,
      home: false,
      active: true,
      parentId: '',
    },
  });

  useEffect(() => {
    async function fetchJob() {
      if (jobId) {
        const docRef = doc(db, 'Jobs', jobId as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const jobData: Job = docSnap.data() as Job;
          form.setValue('title', jobData.title);
          form.setValue('description', jobData.description);
          form.setValue('startDateTime', jobData.startDateTime);
          form.setValue('pet', jobData.pet);
          form.setValue('home', jobData.home);
          form.setValue('baby', jobData.baby);
          form.setValue('active', jobData.active);
        } else {
          console.log('No such document!');
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    }

    fetchJob();
  }, []);

  const onSubmit = async (data: Job) => {
    data.parentId = authUser!.uid;
    if (isEditing) {
      try {
        const jobRef = doc(db, 'Jobs', jobId);
        await updateDoc(jobRef, { ...data });
        toast({
          title: 'Job Updated',
          description: 'Your job has been updated successfully.',
          variant: 'default',
        });
      } catch (error) {
        console.log('🚀 ~ onSubmit ~ error:', error);
      }
    } else {
      data.entryDate = new Date();
      try {
        await addDoc(collection(db, 'Jobs'), { ...data });
        toast({
          title: 'Job Created',
          description: 'Your job has been created successfully.',
          variant: 'default',
        });
      } catch (error) {
        console.log('🚀 ~ onSubmit ~ error:', error);
      }
    }
  };

  if (loading && authLoading) {
    return <SpinnerCircle />;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 lg:w-1/3 mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                {/* <FormDescription>Description</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDateTime"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Date of Service</FormLabel>
                <DateTimePicker
                  value={field.value.toDate()}
                  onChange={field.onChange}
                  hourCycle={12}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex lg:flex-row gap-12 mt-6">
            <FormField
              control={form.control}
              name="baby"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <Label>Baby</Label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pet"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <Label>Pet</Label>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="home"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <Label>Home</Label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center space-x-2 mt-6">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label>Active</Label>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-6 w-full">
            {isEditing ? 'Save Changes' : 'Create Job'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
