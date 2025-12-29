import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
// import { Logo } from "./logo";
import { WorkerNavBarMenu } from './WorkerNavBarMenu';

export const WorkerNavBarSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        {/* <Logo /> */}
        <WorkerNavBarMenu orientation="vertical" className="mt-12" />
      </SheetContent>
    </Sheet>
  );
};
