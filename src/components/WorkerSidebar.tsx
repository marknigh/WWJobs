import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import {
  Star,
  Sun,
  Moon,
  BriefcaseBusiness,
  Briefcase,
  Home,
  User,
  Users,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Outlet } from 'react-router';
// import { Toaster } from '@/components/ui/toaster';
import { Separator } from '@/components/ui/separator';
import HeaderPathName from './HeaderPathName';
import { LogOutUser } from './LogOutUser';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { Toaster } from './ui/toaster';

export default function WorkerSidebar() {
  const location = useLocation();
  const { setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState('dark');
  const isActive = (path: string) => location.pathname === path;

  const toggleDarkLightMode = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setTheme(newTheme);
    setIsDarkMode(isDarkMode);
  };

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <BriefcaseBusiness className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Worker Dashboard</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/worker/dashboard')}
              >
                <Link to="/worker/dashboard">
                  <Home className="size-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/worker/profile')}>
                <Link to="/worker/profile">
                  <User className="size-4" />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/worker/jobs')}>
                <Link to="/worker/jobs">
                  <Briefcase className="size-4" />
                  <span>Available Jobs</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/worker/parents')}>
                <Link to="/worker/parents">
                  <Users className="size-4" />
                  <span>Parent List</span>
                </Link>
              </SidebarMenuButton>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive('/worker/reviews')}
                >
                  <Link to="/worker/reviews">
                    <Star className="size-4" />
                    <span>Reviews</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <div className="grow">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <HeaderPathName />
          <div className="flex flex-row grow justify-end gap-4">
            <div>
              <Button size="icon" onClick={toggleDarkLightMode}>
                {isDarkMode ? <Sun /> : <Moon />}
              </Button>
            </div>
            <div>
              <LogOutUser />
            </div>
          </div>
        </header>
        <div className="p-6">
          <Toaster />
          <Outlet />
        </div>
      </div>{' '}
    </SidebarProvider>
  );
}
