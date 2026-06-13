import { ProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";
import { WorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";

import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { AnalyticsCard } from "./analytics-card";
import { DottedSeparator } from "./dotted-seperator";

interface AnalyticsProps {
  data: WorkspaceAnalytics | ProjectAnalytics;
}

export const Analytics = ({ data }: AnalyticsProps) => (
  <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
    <div className="w-full flex">
      <div className="flex items-center">
        <AnalyticsCard
          title="Total tasks"
          value={data.taskCount}
          difference={data.taskDifference}
        />
        <DottedSeparator direction="vertical" />
      </div>
      <div className="flex items-center">
        <AnalyticsCard
          title="Assigned tasks"
          value={data.assignedTaskCount}
          difference={data.assignedTaskDifference}
        />
        <DottedSeparator direction="vertical" />
      </div>
      <div className="flex items-center">
        <AnalyticsCard
          title="Incomple tasks"
          value={data.incompleteTaskCount}
          difference={data.incompleteTaskDifference}
        />
        <DottedSeparator direction="vertical" />
      </div>
      <div className="flex items-center">
        <AnalyticsCard
          title="Completed tasks"
          value={data.completedTaskCount}
          difference={data.completedTaskDifference}
        />
        <DottedSeparator direction="vertical" />
      </div>
      <div className="flex items-center">
        <AnalyticsCard
          title="Overdue tasks"
          value={data.overdueTaskCount}
          difference={data.overdueTaskDifference}
        />
      </div>
    </div>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
);
