import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Topbar />
      <main className="ml-64 mt-16 p-8">
        {children}
      </main>
    </div>
  );
};
