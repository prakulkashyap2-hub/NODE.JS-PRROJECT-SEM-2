export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'Todo' | 'In Progress' | 'Done';

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatar_url: string;
  email: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee_id: number | null;
  assignee_name?: string;
  assignee_avatar?: string;
  due_date: string;
  created_at: string;
}

export interface Stats {
  statusStats: { status: Status; count: number }[];
  priorityStats: { priority: Priority; count: number }[];
  teamStats: { name: string; task_count: number }[];
}
