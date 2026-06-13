import { redirect } from "next/navigation";

import { getUser } from "@/features/auth/queries";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";

const TasksPage = async () => {
  const user = await getUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="h-full flex flex-col">
      <TaskViewSwitcher />
    </div>
  );
};

export default TasksPage;
