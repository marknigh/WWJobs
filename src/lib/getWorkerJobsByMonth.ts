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

export async function getWorkerJobsByMonth(uid: string): Promise<MonthlyJobsData[]> {
  const now = new Date();
  const fiveMonthsAgo = new Date();
  fiveMonthsAgo.setMonth(now.getMonth() - 5); // Get the date 5 months ago

  try {
    // Query jobs applied for in the past 5 months
    const jobsQuery = query(
      collection(db, 'Jobs'),
      where('awarded', '==', uid),
      where('entryDate', '>=', Timestamp.fromDate(fiveMonthsAgo))
    );
    const querySnapshot = await getDocs(jobsQuery);

    // Initialize a map to group jobs by month
    const jobsByMonth: Record<string, number> = {};

    querySnapshot.forEach((doc) => {
      const job = doc.data();
      console.log('🚀 ~ querySnapshot.forEach ~ job:', job);
      const entryDate = job.entryDate.toDate(); // Convert Firestore Timestamp to Date
      const month = format(entryDate, 'MMMM yyyy'); // Format as "Month Year"

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
