import { useEffect, useState } from 'react';
import { BarChart, Bar, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { getWorkerJobsByMonth } from '@/lib/getWorkerJobsByMonth'; // Function to fetch worker jobs data

const chartConfig = {
  totalJobs: {
    label: 'Jobs Won',
    color: '#2563eb',
  },
} satisfies ChartConfig;

const WorkerJobsWon = (uid: string) => {
  const [monthlyJobsData, setMonthlyJobsData] = useState<
    { month: string; totalJobs: number }[]
  >([]);

  useEffect(() => {
    // Fetch jobs data when the component mounts
    const fetchJobsData = async () => {
      const data = await getWorkerJobsByMonth(uid); // Fetch jobs grouped by month
      setMonthlyJobsData(data);
    };

    fetchJobsData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jobs Won</CardTitle>
        <CardDescription>
          Showing the number jobs you won during the past 5 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        {monthlyJobsData.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <BarChart data={monthlyJobsData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <Bar
                dataKey="totalJobs"
                fill="var(--color-totalJobs)"
                radius={1}
              />{' '}
            </BarChart>
          </ChartContainer>
        ) : (
          <p className="text-center text-gray-500">Loading data...</p>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkerJobsWon;
