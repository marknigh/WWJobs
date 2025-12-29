import { Logo } from './logo';
import { ParentNavBarMenu } from './ParentNavBarMenu';
import { ParentNavBarSheet } from './ParentNavBarSheet';
import { Outlet } from 'react-router';
import { LogOutUser } from '@/components/LogOutUser';
import ThemeMode from '@/components/ThemeMode'; // Import the new ThemeMode component

const ParentNavBar = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {' '}
      {/* Apply bg-background */}
      <nav className="h-16 border-b">
        <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-4 lg:px-8">
          <Logo />
          <ParentNavBarMenu className="hidden md:block" />

          <div className="flex items-center gap-3">
            <ThemeMode /> {/* Use the new ThemeMode component */}
            <LogOutUser />
            {/* Mobile Menu */}
            <div className="md:hidden">
              <ParentNavBarSheet />
            </div>
          </div>
        </div>
        <Outlet />
      </nav>
    </div>
  );
};

export default ParentNavBar;
