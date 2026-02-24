import React from "react";
import { Mail, Briefcase, ChevronRight, CheckCircle2, Clock } from "lucide-react";
import { TeamMember, Task } from "../types";
import { motion } from "motion/react";

interface TeamMemberCardProps {
  member: TeamMember;
  tasks: Task[];
  key?: React.Key;
}

export function TeamMemberCard({ member, tasks }: TeamMemberCardProps) {
  const memberTasks = tasks.filter(t => t.assignee_id === member.id);
  const completedCount = memberTasks.filter(t => t.status === 'Done').length;
  const inProgressCount = memberTasks.filter(t => t.status === 'In Progress').length;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl border border-[#E1E3E5] shadow-sm overflow-hidden flex flex-col md:flex-row h-full"
    >
      {/* Member Info */}
      <div className="p-6 md:w-64 border-b md:border-b-0 md:border-r border-[#E1E3E5] bg-[#F8F9FA] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <img
            src={member.avatar_url}
            alt={member.name}
            className="w-20 h-20 rounded-full border-4 border-white shadow-md mb-4"
            referrerPolicy="no-referrer"
          />
          <h3 className="font-bold text-lg text-[#1A1C1E]">{member.name}</h3>
          <p className="text-sm text-indigo-600 font-medium mb-4">{member.role}</p>
          
          <div className="space-y-2 w-full">
            <div className="flex items-center gap-2 text-xs text-[#44474E] bg-white p-2 rounded-lg border border-[#E1E3E5]">
              <Mail size={14} className="text-[#74777F]" />
              <span className="truncate">{member.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Workload */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#74777F]">Active Workload</h4>
          <span className="text-xs font-medium px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full">
            {memberTasks.length} Total Tasks
          </span>
        </div>

        <div className="space-y-4 flex-1">
          {memberTasks.length > 0 ? (
            memberTasks.slice(0, 3).map(task => (
              <div key={task.id} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    task.status === 'Done' ? 'bg-emerald-500' : 
                    task.status === 'In Progress' ? 'bg-indigo-500' : 'bg-slate-300'
                  }`} />
                  <span className="text-sm font-medium text-[#1A1C1E] group-hover:text-indigo-600 transition-colors">
                    {task.title}
                  </span>
                </div>
                <ChevronRight size={14} className="text-[#E1E3E5] group-hover:text-indigo-600" />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-4">
              <Briefcase size={24} className="text-[#E1E3E5] mb-2" />
              <p className="text-xs text-[#74777F]">No active tasks assigned.</p>
            </div>
          )}
          {memberTasks.length > 3 && (
            <p className="text-xs text-indigo-600 font-medium cursor-pointer hover:underline">
              + {memberTasks.length - 3} more tasks
            </p>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-[#F1F3F5] grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <div>
              <p className="text-xs font-bold text-[#1A1C1E]">{completedCount}</p>
              <p className="text-[10px] text-[#74777F] uppercase font-bold">Completed</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-indigo-500" />
            <div>
              <p className="text-xs font-bold text-[#1A1C1E]">{inProgressCount}</p>
              <p className="text-[10px] text-[#74777F] uppercase font-bold">In Progress</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
