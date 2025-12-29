import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { db } from '@/lib/firebase-config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import useFirebaseAuth from '@/hooks/use-auth-state-change';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import SpinnerCircle from '@/components/SpinnerCircle';
import { Loader2 } from 'lucide-react';
import { Parent } from '@/types/models'; // Import the Parent interface
import ErrorComponent from '@/components/ErrorComponent'; // Import ErrorComponent

const profileSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  name: z.string().min(1, { message: 'Name is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  zip: z.string().min(1, { message: 'ZIP code is required' }),
  phone: z.string().min(1, { message: 'Phone number is required' }),
  baby: z.boolean(),
  pet: z.boolean(),
  home: z.boolean(),
  children: z.string().min(1, { message: 'Number of children is required' }),
  pets: z.string(),
});

const ParentProfile = () => {
  const [profile, setProfile] = useState<Parent | null>(null); // Use the imported Parent interface
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // Added state for submit button
  const [error, setError] = useState(false); // State to track errors
  const { authUser, authLoading } = useFirebaseAuth();
  const { toast } = useToast();
  const form = useForm<Parent>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile || undefined,
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        if (authUser) {
          const docSnap = await getDoc(doc(db, 'Users', authUser.uid));
          if (docSnap.exists()) {
            setProfile(docSnap.data() as Parent);
            form.reset(docSnap.data());
          } else {
            console.error('Document does not exist.');
            setError(true); // Set error state if document does not exist
          }
        }
      } catch (error) {
        console.error(error);
        setError(true); // Set error state on failure
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchProfile();
    }
  }, [authLoading, authUser, form]);

  const handleSubmit = async (data: Parent) => {
    console.log('🚀 ~ handleSubmit ~ data:', data);
    setSubmitting(true); // Set submitting state to true
    try {
      if (!authUser) {
        toast({
          variant: 'destructive',
          title: 'Authentication Error',
          description: 'User is not authenticated.',
        });
        return;
      }
      const profileRef = doc(db, 'Users', authUser.uid);
      await updateDoc(profileRef, data as Record<string, any>);
      toast({
        title: 'Profile Updated',
        description: new Date().toLocaleString(),
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    } finally {
      setSubmitting(false); // Reset submitting state
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center w-full h-screen">
          <SpinnerCircle />
        </div>
      ) : error ? ( // Render ErrorComponent if an error occurred or document does not exist
        <ErrorComponent
          mainText="Failed to Load Profile"
          secondaryText="The requested profile could not be found. Please try again later."
        />
      ) : (
        <div className="flex flex-col items-center justify-center w-full p-4 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input disabled placeholder="Your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-wrap gap-2">
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
                    <FormItem className="w-full lg:w-1/4">
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
                        <Input placeholder="Your state" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zip"
                  render={({ field }) => (
                    <FormItem className="w-full lg:w-1/4">
                      <FormLabel htmlFor="zip">ZIP Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Your ZIP code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-row">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel htmlFor="phone">Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Your phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-row items-center justify-start gap-12 w-full my-8">
                <FormField
                  control={form.control}
                  name="baby"
                  render={({ field }) => (
                    <FormItem className="space-x-2">
                      <FormControl>
                        <Switch
                          id="baby"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel htmlFor="baby">Baby Care </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pet"
                  render={({ field }) => (
                    <FormItem className="space-x-2">
                      <FormControl>
                        <Switch
                          id="pet"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel htmlFor="pet">Pet Care </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="home"
                  render={({ field }) => (
                    <FormItem className="space-x-2">
                      <FormControl>
                        <Switch
                          id="home"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel htmlFor="home">Home Care </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-row justify-start w-full gap-4 my-2">
                <FormField
                  control={form.control}
                  name="children"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="children"># of Children</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          defaultValue={field.value || '0'} // Ensure default value
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={field.value || '0'} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">0</SelectItem>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="pets"># of Pets</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          defaultValue={field.value || '0'} // Ensure default value
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={field.value || '0'} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">0</SelectItem>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="w-full mt-4"
                disabled={loading || submitting}
              >
                {submitting ? <Loader2 className="animate-spin" /> : 'Save'}
              </Button>
            </form>
          </Form>
        </div>
      )}
    </>
  );
};

export default ParentProfile;
