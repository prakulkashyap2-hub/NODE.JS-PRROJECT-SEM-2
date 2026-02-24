import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./views/Dashboard";
import { TasksView } from "./views/TasksView";
import { TeamView } from "./views/TeamView";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<TasksView />} />
          <Route path="team" element={<TeamView />} />
        </Route>
      </Routes>
    </Router>
  );
}
