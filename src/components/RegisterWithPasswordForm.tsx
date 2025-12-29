import { useEffect, useState } from 'react';
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
import { useNavigate, useParams } from 'react-router';
import { Input } from '@/components/ui/input';
import { Separator } from './ui/separator';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase-config';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router';

interface Register {
  email: string;
  name: string;
  type: string;
  password: string;
  confirmPassword: string;
}

const RegisterWithPasswordSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }),
    name: z.string().min(1, { message: 'Name is required' }),
    password: z.string().min(1, { message: 'Password is required' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Confirm Password is required' }),
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

export function RegisterWithPasswordForm() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<Register>({
    resolver: zodResolver(RegisterWithPasswordSchema),
    defaultValues: {
      email: useParams().email || '',
      name: '',
      type: '', // Keep as an empty string to force user selection
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      form.setValue('email', decodeURIComponent(emailParam));
    }
  }, [searchParams, form]);

  const onSubmit = async (data: Register) => {
    setLoading(true);
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
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
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'This email is already in use.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to create account.',
        });
      }
    } finally {
      setLoading(false);
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
                  <FormMessage className="text-destructive text-center" />
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm Password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 className="animate-span" />
                ) : (
                  'Complete Registration'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
