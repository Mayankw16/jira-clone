import { useCallback, useEffect, useState } from "react";

import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

import { KanbanColumnHeader } from "./kanban-column-header";
import { UpdateTasksPayload } from "./task-view-switcher";
import { KanbanCard } from "./kanban-card";
import { PopulatedTasks } from "../api/use-get-tasks";
import { TaskStatus } from "../types";

const boards: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];

type TasksState = {
  [key in TaskStatus]: PopulatedTasks;
};

const createEmptyTasksState = (): TasksState => ({
  [TaskStatus.BACKLOG]: [],
  [TaskStatus.TODO]: [],
  [TaskStatus.IN_PROGRESS]: [],
  [TaskStatus.IN_REVIEW]: [],
  [TaskStatus.DONE]: [],
});

interface DataKanbanProps {
  data: PopulatedTasks;
  onChange: (tasks: UpdateTasksPayload) => void;
}

export const DataKanban = ({ data, onChange }: DataKanbanProps) => {
  const [tasks, setTasks] = useState<TasksState>(createEmptyTasksState);

  useEffect(() => {
    const groupedTasks = createEmptyTasksState();

    data.forEach((task) => groupedTasks[task.status].push(task));

    boards.forEach((status) =>
      groupedTasks[status].sort((a, b) => a.position - b.position),
    );

    setTasks(groupedTasks);
  }, [data]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const { source, destination } = result;

      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      )
        return;

      const sourceStatus = source.droppableId as TaskStatus;
      const destinationStatus = destination.droppableId as TaskStatus;

      const newTasks = structuredClone(tasks);

      // Safely remove the task from the source column
      const sourceColumn = [...newTasks[sourceStatus]];
      const [movedTask] = sourceColumn.splice(source.index, 1);

      // If there's no moved task (shouldn't happen, but just in case), return the previous state
      if (!movedTask) {
        console.error("No task found at the source index!");
        return;
      }

      // Create a new task object with potentially updated status
      const updatedMovedTask =
        sourceStatus !== destinationStatus
          ? { ...movedTask, status: destinationStatus }
          : movedTask;

      // Update the source column
      newTasks[sourceStatus] = sourceColumn;

      // Add the task to the destination column
      const destinationColumn = [...newTasks[destinationStatus]];
      destinationColumn.splice(destination.index, 0, updatedMovedTask);
      newTasks[destinationStatus] = destinationColumn;

      // Prepare minimum update payload
      const updateTasksPayload: UpdateTasksPayload = [];

      // Update the moved task
      updateTasksPayload.push({
        $id: updatedMovedTask.$id,
        status: destinationStatus,
        position: Math.min((destination.index + 1) * 1000, 1_000_000),
      });

      // Update positions for affected tasks in the destination column
      newTasks[destinationStatus].forEach((task, index) => {
        if (task && task.$id !== updatedMovedTask.$id) {
          const newPosition = Math.min((index + 1) * 1000, 1_000_000);
          if (task.position !== newPosition) {
            updateTasksPayload.push({
              $id: task.$id,
              status: destinationStatus,
              position: newPosition,
            });
          }
        }
      });

      // If the task moved between columns, update positions in the source column
      if (sourceStatus !== destinationStatus) {
        newTasks[sourceStatus].forEach((task, index) => {
          if (task) {
            const newPosition = Math.min((index + 1) * 1000, 1_000_000);
            if (task.position !== newPosition) {
              updateTasksPayload.push({
                $id: task.$id,
                status: sourceStatus,
                position: newPosition,
              });
            }
          }
        });
      }
      setTasks(newTasks);
      onChange(updateTasksPayload);
    },
    [onChange, tasks],
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto">
        {boards.map((board) => {
          return (
            <div
              key={board}
              className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-50"
            >
              <KanbanColumnHeader
                board={board}
                taskCount={tasks[board].length}
              />
              <Droppable droppableId={board}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-50 py-1.5"
                  >
                    {tasks[board].map((task, index) => (
                      <Draggable
                        key={task.$id}
                        draggableId={task.$id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <KanbanCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};
