"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { CalendarIcon, PlusIcon, SettingsIcon } from "lucide-react";

import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";
import {
  type PopulatedTasks,
  useGetTasks,
} from "@/features/tasks/api/use-get-tasks";
import {
  type Projects,
  useGetProjects,
} from "@/features/projects/api/use-get-projects";
import {
  type Members,
  useGetMembers,
} from "@/features/members/api/use-get-members";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Analytics } from "@/components/analytics";
import { Button } from "@/components/ui/button";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";
import { DottedSeparator } from "@/components/dotted-seperator";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { Loader } from "@/components/loader";
import { Error } from "@/components/error";

export const WorkspaceClient = () => {
  const workspaceId = useWorkspaceId();

  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetWorkspaceAnalytics({ workspaceId });
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
  });
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const isLoading =
    isLoadingAnalytics ||
    isLoadingTasks ||
    isLoadingProjects ||
    isLoadingMembers;

  if (isLoading) return <Loader />;

  if (!analytics || !tasks || !projects || !members)
    return (
      <Error message="This workspace either does not exist or you are not authorized to access it." />
    );

  return (
    <div className="h-full flex flex-col space-y-4">
      <Analytics data={analytics} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskList tasks={tasks.rows} />
        <ProjectList projects={projects.rows} />
        <MembersList members={members.rows} />
      </div>
    </div>
  );
};

interface TaskListProps {
  tasks: PopulatedTasks;
}

export const TaskList = ({ tasks }: TaskListProps) => {
  const workspaceId = useWorkspaceId();
  const { open } = useCreateTaskModal();

  return (
    <div className="col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Tasks ({tasks.length})</p>
          <Button variant="muted" size="icon" onClick={open}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="mt-4" />
        <ul className="flex flex-col h-80 overflow-scroll hide-scrollbar">
          {tasks.map((task) => (
            <li key={task.$id} className="mb-4 first-of-type:mt-4">
              <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition ring-0 border">
                  <CardContent>
                    <p className="text-lg font-medium truncate">{task.name}</p>
                    <div className="flex items-center gap-x-2">
                      <p className="truncate">{task.project?.name}</p>
                      <div className="size-1 rounded-full bg-neutral-300" />
                      <div className="text-sm text-muted-foreground flex items-center">
                        <CalendarIcon className="size-3 mr-1" />
                        <span className="truncate max-w-40">
                          {formatDistanceToNow(new Date(task.dueDate))}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No tasks found
          </li>
        </ul>
        <Button variant="muted" className="mt-4 w-full" asChild>
          <Link href={`/workspaces/${workspaceId}/tasks`}>Show All</Link>
        </Button>
      </div>
    </div>
  );
};

interface ProjectListProps {
  projects: Projects;
}

export const ProjectList = ({ projects }: ProjectListProps) => {
  const workspaceId = useWorkspaceId();
  const { open } = useCreateProjectModal();

  return (
    <div className="col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Projects ({projects.length})</p>
          <Button variant="secondary" size="icon" onClick={open}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="mt-4" />
        <ul className="flex flex-col h-93 overflow-scroll hide-scrollbar">
          {projects.map((project) => (
            <li key={project.$id} className="mb-4 first-of-type:mt-4">
              <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition border ring-0">
                  <CardContent className="flex items-center gap-x-2.5">
                    <ProjectAvatar
                      className="size-12"
                      fallbackClassName="text-lg"
                      name={project.name}
                      image={project.imageURL}
                    />
                    <p className="text-base font-medium truncate">
                      {project.name}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No projects found
          </li>
        </ul>
      </div>
    </div>
  );
};

interface MembersListProps {
  members: Members;
}

export const MembersList = ({ members }: MembersListProps) => {
  const workspaceId = useWorkspaceId();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Members ({members.length})</p>
          <Button asChild variant="secondary" size="icon">
            <Link href={`/workspaces/${workspaceId}/members`}>
              <SettingsIcon className="size-4 text-neutral-400" />
            </Link>
          </Button>
        </div>
        <DottedSeparator className="mt-4" />
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-93 overflow-scroll hide-scrollbar">
          {members.map((member) => (
            <li key={member.$id} className="mb-4 first-of-type:mt-4">
              <Card className="shadow-none rounded-lg overflow-hidden border ring-0">
                <CardContent className="flex flex-col items-center gap-x-2">
                  <MemberAvatar className="size-12 mb-2" name={member.name} />
                  <div className="flex flex-col items-center overflow-hidden">
                    <p className="text-base font-medium line-clamp-1">
                      {member.name}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {member.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No members found
          </li>
        </ul>
      </div>
    </div>
  );
};
