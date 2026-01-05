import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router';
import { Pickaxe, Home, User, List, Moon, Sun } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarRail,
} from '@/components/ui/sidebar';
import { LogOutUser } from '@/components/LogOutUser';
import { useTheme } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import HeaderPathName from './HeaderPathName';

export default function ParentSidebar() {
  const location = useLocation();
  const { setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState<string>('dark');
  const isActive = (path: string) => location.pathname === path;

  const toggleDarkLightMode = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setTheme(newTheme);
    setIsDarkMode(String(!isDarkMode));
  };

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <User className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Parent Dashboard</span>
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
                isActive={isActive('/parent/dashboard')}
              >
                <Link to="/parent/dashboard">
                  <Home className="size-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/parent/profile')}>
                <Link to="/parent/profile">
                  <User className="size-4" />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/parent/jobs')}>
                <Link to="/parent/jobs">
                  <List className="size-4" />
                  <span>Jobs</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/parent/workers')}>
                <Link to="/parent/workers">
                  <Pickaxe className="size-4" />
                  <span>Workers</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      <div className="grow bg-background text-foreground">
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
      </div>
    </SidebarProvider>
  );
}
