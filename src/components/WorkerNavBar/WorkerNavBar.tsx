import { Logo } from './logo';
import { WorkerNavBarMenu } from './WorkerNavBarMenu';
import { WorkerNavBarSheet } from './WorkerNavBarSheet';
import { Outlet } from 'react-router';
import { LogOutUser } from '../LogOutUser';
import ThemeMode from '../ThemeMode'; // Import the new ThemeMode component

const WorkerNavBar = () => {
  return (
    <nav className="h-16 border-b">
      <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-4 lg:px-8">
        <Logo />
        <WorkerNavBarMenu className="hidden md:block" />

        <div className="flex items-center gap-3">
          <ThemeMode /> {/* Use the new ThemeMode component */}
          <LogOutUser />
          {/* Mobile Menu */}
          <div className="md:hidden">
            <WorkerNavBarSheet />
          </div>
        </div>
      </div>
      <Outlet />
    </nav>
  );
};

export default WorkerNavBar;
