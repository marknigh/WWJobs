import FutureJobs from '@/components/FutureJobs';
import WorkerRankings from '@/components/WorkerRankings';
import useFirebaseAuth from '@/hooks/use-auth-state-change';

export default function WorkerDashboard() {
  const { authUser, authLoading } = useFirebaseAuth();
  return (
    <>
      {authLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {authUser && <FutureJobs id={authUser.uid} />}
            <WorkerRankings />
          </div>
        </div>
      )}
    </>
  );
}
