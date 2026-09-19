import type { Task } from "../types";

type TaskListProps = {
  tasks: Task[];
  onToggle: (id: string) => void;
};

export function TaskList({ tasks, onToggle }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="p-4 text-sm text-stone-500">sin dato</p>;
  }

  return (
    <ul className="divide-y divide-stone-200 border border-stone-200 bg-white">
      {tasks.map((task) => (
        <li key={task.id} className="flex items-start gap-3 px-3 py-2.5">
          <input
            id={`task-${task.id}`}
            type="checkbox"
            checked={task.done}
            onChange={() => onToggle(task.id)}
            className="mt-1"
          />
          <label htmlFor={`task-${task.id}`} className="flex-1 cursor-pointer">
            <div className={`text-sm ${task.done ? "text-stone-400 line-through" : "text-stone-900"}`}>
              {task.title}
            </div>
            <div className="text-xs text-stone-500">
              {task.owner}
              {task.date ? ` · ${task.date}` : ""}
            </div>
          </label>
        </li>
      ))}
    </ul>
  );
}
