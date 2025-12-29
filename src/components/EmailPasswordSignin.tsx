import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { auth, db } from '@/lib/firebase-config';
import { getDoc, doc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';

const SignInSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .nonempty('Email is required'),
  password: z.string().nonempty('Password is required'),
});

interface SignInFormValues {
  email: string;
  password: string;
}

export const EmailPasswordSignin = () => {
  const navigate = useNavigate();
  const [noUserError, setNoUserError] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { toast } = useToast();
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handlePasswordReset = async () => {
    const email = form.getValues().email;
    if (!email) {
      toast({
        title: 'Missing Email',
        description: 'Please enter your email address to reset your password.',
        variant: 'destructive',
      });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      alert('Failed to send password reset email. Please try again.');
    }
  };

  const SignIn = async (data: SignInFormValues) => {
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = result.user;
      // check to see if the user is new
      const docSnap = await getDoc(doc(db, 'Users', user.uid));
      if (!docSnap.exists()) {
        // redirect to register page
        setNoUserError(true);
      } else {
        if (docSnap.data().type === 'worker') {
          navigate('/worker/dashboard');
        } else {
          navigate('/parent/dashboard');
        }
      }
    } catch (error) {
      console.log('🚀 ~ SignIn ~ error:', error);
      setNoUserError(true);
    } finally {
      console.log('🚀 ~ SignIn ~ finally');
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(SignIn)} className="grid gap-6">
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    className="text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>
                <FormControl>
                  <Input id="password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {resetEmailSent && (
            <div className="text-sm text-success text-center">
              Password reset email sent successfully.
            </div>
          )}
          {noUserError && (
            <div className="flex flex-row text-destructive justify-center text-center text-sm gap-1">
              <p>User Doesn't Exist.{''}</p>
              <Link
                className="underline underline-offset-4"
                to={{
                  pathname: '/registerwithpassword',
                  search: `?email=${form.getValues().email}`,
                }}
              >
                Register?
              </Link>
            </div>
          )}
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EmailPasswordSignin;
