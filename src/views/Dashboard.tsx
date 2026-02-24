import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from "lucide-react";
import { Stats } from "../types";

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

export function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const totalTasks = stats.statusStats.reduce((acc, curr) => acc + curr.count, 0);
  const completedTasks = stats.statusStats.find(s => s.status === 'Done')?.count || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-[#1A1C1E]">Dashboard Overview</h1>
        <p className="text-[#44474E] mt-1">Track your team's progress and task distribution.</p>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          icon={CheckCircle2}
          color="text-indigo-600"
          bg="bg-indigo-50"
        />
        <StatCard
          title="Completion Rate"
          value={`${completionRate}%`}
          icon={TrendingUp}
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
        <StatCard
          title="In Progress"
          value={stats.statusStats.find(s => s.status === 'In Progress')?.count || 0}
          icon={Clock}
          color="text-amber-600"
          bg="bg-amber-50"
        />
        <StatCard
          title="High Priority"
          value={stats.priorityStats.find(p => p.priority === 'High')?.count || 0}
          icon={AlertCircle}
          color="text-rose-600"
          bg="bg-rose-50"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl border border-[#E1E3E5] shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-6">Task Distribution by Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.statusStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F5" />
                <XAxis dataKey="status" axisLine={false} tickLine={false} tick={{ fill: '#74777F', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#74777F', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: '#F8F9FA' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {stats.statusStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl border border-[#E1E3E5] shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-6">Team Workload</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.teamStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="task_count"
                  nameKey="name"
                >
                  {stats.teamStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {stats.teamStats.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm text-[#44474E]">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="truncate">{entry.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-6 rounded-2xl border border-[#E1E3E5] shadow-sm flex items-center gap-4"
    >
      <div className={cn("p-3 rounded-xl", bg, color)}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-[#74777F]">{title}</p>
        <p className="text-2xl font-bold text-[#1A1C1E]">{value}</p>
      </div>
    </motion.div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
