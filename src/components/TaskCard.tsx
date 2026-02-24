import React from "react";
import { Calendar, Clock, MoreVertical, User } from "lucide-react";
import { Task } from "../types";
import { motion } from "motion/react";

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: number, status: Task['status']) => void;
  onDelete: (id: number) => void;
  key?: React.Key;
}

export function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps) {
  const priorityColors = {
    Low: "bg-blue-50 text-blue-600 border-blue-100",
    Medium: "bg-amber-50 text-amber-600 border-amber-100",
    High: "bg-rose-50 text-rose-600 border-rose-100",
  };

  const statusColors = {
    Todo: "bg-slate-100 text-slate-600",
    "In Progress": "bg-indigo-100 text-indigo-600",
    Done: "bg-emerald-100 text-emerald-600",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white p-5 rounded-xl border border-[#E1E3E5] shadow-sm hover:shadow-md transition-shadow group"
    >
      <div className="flex justify-between items-start mb-3">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <div className="flex items-center gap-1">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
            className={`text-xs font-medium px-2 py-1 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer ${statusColors[task.status]}`}
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <button 
            onClick={() => onDelete(task.id)}
            className="p-1 text-[#74777F] hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      <h4 className="font-semibold text-[#1A1C1E] mb-2 line-clamp-1">{task.title}</h4>
      <p className="text-sm text-[#44474E] mb-4 line-clamp-2">{task.description}</p>

      <div className="flex items-center justify-between pt-4 border-t border-[#F1F3F5]">
        <div className="flex items-center gap-2 text-[#74777F]">
          <Calendar size={14} />
          <span className="text-xs">{new Date(task.due_date).toLocaleDateString()}</span>
        </div>

        {task.assignee_name ? (
          <div className="flex items-center gap-2" title={task.assignee_name}>
            <img
              src={task.assignee_avatar}
              alt={task.assignee_name}
              className="w-6 h-6 rounded-full border border-white shadow-sm"
              referrerPolicy="no-referrer"
            />
            <span className="text-xs font-medium text-[#44474E] max-w-[80px] truncate">
              {task.assignee_name.split(' ')[0]}
            </span>
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full bg-[#F1F3F5] flex items-center justify-center text-[#74777F]">
            <User size={12} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
