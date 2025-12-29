import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router';

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tight">
          Warson Woods Jobs
        </h1>
        <p className="mx-12 mt-6 text-[17px] md:text-lg">
          Find the right worker for the job. Only in Warson Woods.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <Button onClick={() => navigate('/login')} size="lg">
            Get Started <ArrowUpRight className="!h-5 !w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
