import { Separator } from '@/components/ui/separator';

const NotFoundPage = () => {
  return (
    <div className="flex flex-column items-center justify-center min-h-screen text-center gap-6">
      <div className="text-2xl/7 font-semibold inline-block leading-10">
        {' '}
        404{' '}
      </div>
      <Separator className="my-4" orientation="vertical" />
      <div className="text-sm"> Page Not Found </div>
    </div>
  );
};

export default NotFoundPage;
