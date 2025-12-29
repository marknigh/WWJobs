import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
// import { Logo } from "./logo";
import { ParentNavBarMenu } from './ParentNavBarMenu';

export const ParentNavBarSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        {/* <Logo /> */}
        <ParentNavBarMenu orientation="vertical" className="mt-12" />
      </SheetContent>
    </Sheet>
  );
};
