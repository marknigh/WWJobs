import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import { format } from 'date-fns';

interface MonthlyJobsData {
  month: string;
  totalJobs: number;
}

export async function getJobsByMonth(): Promise<MonthlyJobsData[]> {
  const jobsCollection = collection(db, 'Jobs');
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);

  try {
    // Query jobs created in the past 6 months
    const jobsQuery = query(
      jobsCollection,
      where('entryDate', '>=', Timestamp.fromDate(sixMonthsAgo))
    );
    const querySnapshot = await getDocs(jobsQuery);

    // Initialize a map to group jobs by month
    const jobsByMonth: Record<string, number> = {};

    querySnapshot.forEach((doc) => {
      const job = doc.data();
      const createdAt = job.entryDate.toDate(); // Convert Firestore Timestamp to Date
      const month = format(createdAt, 'MMMM yyyy'); // Format as "Month Year"

      // Increment the count for the corresponding month
      if (jobsByMonth[month]) {
        jobsByMonth[month]++;
      } else {
        jobsByMonth[month] = 1;
      }
    });

    // Convert the map into an array of objects for charting
    const monthlyJobsData: MonthlyJobsData[] = Object.entries(jobsByMonth).map(
      ([month, totalJobs]) => ({
        month,
        totalJobs,
      })
    );

    // Sort the data by month (chronologically)
    return monthlyJobsData.sort(
      (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
    );
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}
