import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

import { TaskStatus } from "../types";

export const useTaskFilters = () =>
  useQueryStates({
    projectId: parseAsString,
    status: parseAsStringEnum(Object.values(TaskStatus)),
    assigneeId: parseAsString,
    search: parseAsString,
    dueDate: parseAsString,
  });
