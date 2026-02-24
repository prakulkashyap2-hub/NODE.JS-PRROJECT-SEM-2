import React, { useEffect, useState } from "react";
import { Plus, Filter, Search as SearchIcon, X } from "lucide-react";
import { Task, TeamMember } from "../types";
import { TaskCard } from "../components/TaskCard";
import { motion, AnimatePresence } from "motion/react";

export function TasksView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<Task['status'] | 'All'>('All');
  const [search, setSearch] = useState("");

  const fetchTasks = () => {
    fetch("/api/tasks")
      .then(res => res.json())
      .then(data => setTasks(data));
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/tasks").then(res => res.json()),
      fetch("/api/team").then(res => res.json())
    ]).then(([tasksData, teamData]) => {
      setTasks(tasksData);
      setTeam(teamData);
      setLoading(false);
    });
  }, []);

  const handleStatusChange = async (id: number, status: Task['status']) => {
    await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchTasks();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      fetchTasks();
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'All' || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) || 
                         task.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1A1C1E]">Tasks</h1>
          <p className="text-[#44474E] mt-1">Manage and assign tasks to your team.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus size={18} />
          New Task
        </button>
      </header>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-2xl border border-[#E1E3E5] shadow-sm">
        <div className="relative flex-1 w-full">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777F]" size={16} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F1F3F5] border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-[#74777F]" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-[#F1F3F5] border-none rounded-xl text-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer w-full sm:w-auto"
          >
            <option value="All">All Status</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {filteredTasks.length === 0 && !loading && (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#E1E3E5]">
          <p className="text-[#74777F]">No tasks found matching your criteria.</p>
        </div>
      )}

      {/* New Task Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <TaskModal
            team={team}
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
              setIsModalOpen(false);
              fetchTasks();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function TaskModal({ team, onClose, onSuccess }: { team: TeamMember[], onClose: () => void, onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    assignee_id: "",
    due_date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/tasks", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        assignee_id: formData.assignee_id ? parseInt(formData.assignee_id) : null
      })
    });
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-[#E1E3E5] flex items-center justify-between bg-[#F8F9FA]">
          <h3 className="text-lg font-bold">Create New Task</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#E1E3E5] rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#74777F] uppercase tracking-wider mb-1">Title</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What needs to be done?"
              className="w-full px-4 py-2 bg-[#F1F3F5] border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#74777F] uppercase tracking-wider mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add more details..."
              className="w-full px-4 py-2 bg-[#F1F3F5] border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#74777F] uppercase tracking-wider mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2 bg-[#F1F3F5] border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#74777F] uppercase tracking-wider mb-1">Due Date</label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full px-4 py-2 bg-[#F1F3F5] border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#74777F] uppercase tracking-wider mb-1">Assignee</label>
            <select
              value={formData.assignee_id}
              onChange={(e) => setFormData({ ...formData, assignee_id: e.target.value })}
              className="w-full px-4 py-2 bg-[#F1F3F5] border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
            >
              <option value="">Unassigned</option>
              {team.map(member => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#E1E3E5] text-[#44474E] rounded-xl font-medium hover:bg-[#F1F3F5] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Create Task
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
