import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DarkModeToggle } from "@/app/_components/dark-mode-toggle";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="w-full h-full">
      {/*<SidebarProvider>*/}
      {/*  <AppSidebar />*/}
      <main>
        {/*<SidebarTrigger className="fixed" />*/}
        {children}
        <DarkModeToggle />
      </main>
      {/*</SidebarProvider>*/}
    </div>
  );
};

export default DashboardLayout;
