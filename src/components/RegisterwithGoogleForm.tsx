import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router';
import { Input } from '@/components/ui/input';
import { Separator } from './ui/separator';
import { auth, db } from '@/lib/firebase-config';
import { setDoc } from 'firebase/firestore';

interface GoogleRegister {
  email: string;
  name: string;
}

const RegisterWithPasswordSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }),
    name: z.string().min(1, { message: 'Name is required' }),
    password: z.string().min(1, { message: 'Password is required' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Confirm Password is required' }),
    gender: z.string().min(1, { message: 'Gender is required' }),
    dob: z.date(),
    type: z
      .union([z.enum(['parent', 'worker']), z.literal('')]) // Allow empty string initially
      .refine((value) => value !== '', {
        message: 'Please select either Parent or Worker.',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export function RegisterWithGoogleForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const form = useForm<GoogleRegister>({
    resolver: zodResolver(RegisterWithPasswordSchema),
    defaultValues: {
      email: '',
      name: '',
    },
  });

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      form.setValue('email', decodeURIComponent(emailParam));
    }
  }, [searchParams, form]);

  const onSubmit = async (data: GoogleRegister) => {
    try {
      await setDoc(doc(db, 'Users', userCredentials.user.uid), {
        name: data.name,
        email: data.email,
        uid: userCredentials.user.uid,
        type: data.type,
        dateJoined: new Date(),
      });
      if (data.type === 'parent') {
        navigate('/Parent/Profile');
      } else if (data.type === 'worker') {
        navigate('/Worker/Profile');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Sorry, something went wrong creating your account',
        description: 'There was a unknown problem.',
      });
      await userCredentials.user.delete();
      console.error('User creation rolled back due to Firestore error.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center my-6">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
        <div className="text-center">
          <h1 className="text-xl font-bold">How do you want to register?</h1>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <FormField
              name="type"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      className="flex justify-evenly p-2"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormItem className="space-x-2">
                        <FormControl>
                          <RadioGroupItem value="parent" />
                        </FormControl>
                        <FormLabel className="font-normal">Parent</FormLabel>
                      </FormItem>
                      <FormItem className="space-x-2">
                        <FormControl>
                          <RadioGroupItem value="worker" />
                        </FormControl>
                        <FormLabel className="font-normal">Worker</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      placeholder="This will be your username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-4">
              <Button type="submit" className="w-full">
                Complete Registration
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
