import { DarkModeToggle } from "@/app/_components/dark-mode-toggle";

interface ProjectLayoutProps {
  children: React.ReactNode;
}

const ProjectLayout = ({ children }: ProjectLayoutProps) => {
  return (
    <div className="w-full h-full">
      <main>
        {children}
        <DarkModeToggle />
      </main>
    </div>
  );
};

export default ProjectLayout;
