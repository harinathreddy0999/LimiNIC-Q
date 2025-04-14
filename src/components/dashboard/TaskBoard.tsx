import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Plus, X, Edit, Trash2 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  assignee?: {
    name: string;
    avatar: string;
  };
}

interface TaskBoardProps {
  tasks?: Task[];
  onTaskMove?: (taskId: string, newStatus: Task["status"]) => void;
  onTaskClick?: (task: Task) => void;
  onAddTask?: () => void;
  isLoading?: boolean;
}

const defaultTasks: Task[] = [
  {
    id: "1",
    title: "Design System Updates",
    description: "Update component library with new design tokens",
    status: "todo",
    assignee: {
      name: "Alice Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    },
  },
  {
    id: "2",
    title: "API Integration",
    description: "Integrate new backend endpoints",
    status: "in-progress",
    assignee: {
      name: "Bob Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    },
  },
  {
    id: "3",
    title: "User Testing",
    description: "Conduct user testing sessions",
    status: "done",
    assignee: {
      name: "Carol Williams",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol",
    },
  },
];

const TaskBoard = ({
  tasks = defaultTasks,
  onTaskMove = () => {},
  onTaskClick = () => {},
  onAddTask = () => {},
  isLoading = false,
}: TaskBoardProps) => {
  const [loading, setLoading] = useState(isLoading);
  const [addingTask, setAddingTask] = useState(false);
  const [movingTaskId, setMovingTaskId] = useState<string | null>(null);
  const { toast } = useToast();

  // Simulate loading for demo purposes
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);
  const columns = [
    {
      id: "todo",
      title: "To Do",
      color: "bg-gray-50",
      borderColor: "border-gray-200",
    },
    {
      id: "in-progress",
      title: "In Progress",
      color: "bg-blue-50",
      borderColor: "border-blue-100",
    },
    {
      id: "done",
      title: "Done",
      color: "bg-green-50",
      borderColor: "border-green-100",
    },
  ];

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
    setMovingTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: Task["status"]) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");

    // Simulate API call with loading state
    setMovingTaskId(taskId);

    // Simulate network delay
    setTimeout(() => {
      onTaskMove(taskId, status);
      setMovingTaskId(null);

      toast({
        title: "Task moved",
        description: `Task has been moved to ${status.replace("-", " ")}`,
      });
    }, 600);
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Task Board</h2>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 h-9 shadow-sm transition-colors opacity-50 cursor-not-allowed"
            disabled={true}
          >
            {loading ? (
              <>
                <LoadingSpinner className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Task
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6 h-[calc(100%-4rem)]">
          {columns.map((column) => (
            <div
              key={column.id}
              className={`${column.color} rounded-xl p-4 border ${column.borderColor}`}
            >
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <span
                  className={`h-2 w-2 rounded-full mr-2 ${column.id === "todo" ? "bg-gray-400" : column.id === "in-progress" ? "bg-blue-400" : "bg-green-400"}`}
                ></span>
                {column.title}
              </h3>
              <div className="space-y-3 flex flex-col items-center justify-center min-h-[200px]">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full border-4 border-gray-100 border-t-blue-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-blue-500/20 animate-pulse" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-500 mt-3">
                  Loading tasks...
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Task Board</h2>
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 h-9 shadow-sm transition-colors"
          onClick={() => {
            setAddingTask(true);
            // Simulate API call
            setTimeout(() => {
              onAddTask();
              setAddingTask(false);
              toast({
                title: "Success",
                description: "New task has been created",
              });
            }, 1000);
          }}
          disabled={addingTask}
        >
          {addingTask ? (
            <>
              <LoadingSpinner className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Task
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6 h-[calc(100%-4rem)]">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`${column.color} rounded-xl p-4 border ${column.borderColor}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id as Task["status"])}
          >
            <h3 className="font-medium text-gray-900 mb-4 flex items-center">
              <span
                className={`h-2 w-2 rounded-full mr-2 ${column.id === "todo" ? "bg-gray-400" : column.id === "in-progress" ? "bg-blue-400" : "bg-green-400"}`}
              ></span>
              {column.title}
            </h3>
            <div className="space-y-3">
              {tasks
                .filter((task) => task.status === column.id)
                .map((task) => (
                  <motion.div
                    key={task.id}
                    layoutId={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e as any, task.id)}
                    onClick={() => onTaskClick(task)}
                    className={movingTaskId === task.id ? "opacity-50" : ""}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 rounded-xl border-0 bg-white shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">
                          {task.title}
                        </h4>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast({
                                title: "Edit mode",
                                description:
                                  "Task editing functionality will be implemented",
                              });
                            }}
                          >
                            <Edit className="h-3 w-3 text-gray-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full hover:bg-red-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast({
                                title: "Delete action",
                                description:
                                  "Task deletion functionality will be implemented",
                                variant: "destructive",
                              });
                            }}
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {task.description}
                      </p>
                      {task.assignee && (
                        <div className="flex items-center mt-3 pt-3 border-t border-gray-100">
                          <img
                            src={task.assignee.avatar}
                            alt={task.assignee.name}
                            className="w-7 h-7 rounded-full mr-2 border border-white shadow-sm"
                          />
                          <span className="text-sm text-gray-700 font-medium">
                            {task.assignee.name}
                          </span>
                        </div>
                      )}
                      {movingTaskId === task.id && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
                          <LoadingSpinner className="h-6 w-6 text-blue-500 animate-spin" />
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
