import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { CreateProjectModal } from "@/features/projects/components/create-project-modal";
import { CreateTaskModal } from "@/features/tasks/components/create-task-modal";
import { UpdateTaskModal } from "@/features/tasks/components/update-task-modal";
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <CreateWorkspaceModal />
      <CreateProjectModal />
      <CreateTaskModal />
      <UpdateTaskModal />
      <div className="flex w-full h-full">
        <div className="fixed left-0 top-0 hidden lg:block w-64 h-full overflow-y-auto bg-red-400">
          <Sidebar />
        </div>
        <div className="lg:pl-64 w-full">
          <div className="mx-auto max-w-7xl">
            <Navbar />
            <main className="py-8 px-6 flex flex-col">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
