import { useEffect, useState } from "react";
import { TeamMember, Task } from "../types";
import { TeamMemberCard } from "../components/TeamMemberCard";

export function TeamView() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/team").then(res => res.json()),
      fetch("/api/tasks").then(res => res.json())
    ]).then(([teamData, tasksData]) => {
      setTeam(teamData);
      setTasks(tasksData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-[#1A1C1E]">Team Members</h1>
        <p className="text-[#44474E] mt-1">View your team's workload and expertise.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {team.map((member) => (
          <TeamMemberCard key={member.id} member={member} tasks={tasks} />
        ))}
      </div>
    </div>
  );
}
