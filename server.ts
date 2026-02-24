import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("tasks.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS team_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    avatar_url TEXT,
    email TEXT UNIQUE
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Todo',
    priority TEXT DEFAULT 'Medium',
    assignee_id INTEGER,
    due_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assignee_id) REFERENCES team_members(id)
  );
`);

// Seed data if empty
const memberCount = db.prepare("SELECT COUNT(*) as count FROM team_members").get() as { count: number };
if (memberCount.count === 0) {
  const insertMember = db.prepare("INSERT INTO team_members (name, role, avatar_url, email) VALUES (?, ?, ?, ?)");
  insertMember.run("Alex Rivera", "Lead Designer", "https://picsum.photos/seed/alex/100/100", "alex@example.com");
  insertMember.run("Sarah Chen", "Senior Developer", "https://picsum.photos/seed/sarah/100/100", "sarah@example.com");
  insertMember.run("Jordan Smith", "Product Manager", "https://picsum.photos/seed/jordan/100/100", "jordan@example.com");
  insertMember.run("Taylor Wong", "QA Engineer", "https://picsum.photos/seed/taylor/100/100", "taylor@example.com");
}

const taskCount = db.prepare("SELECT COUNT(*) as count FROM tasks").get() as { count: number };
if (taskCount.count === 0) {
  const insertTask = db.prepare("INSERT INTO tasks (title, description, status, priority, assignee_id, due_date) VALUES (?, ?, ?, ?, ?, ?)");
  insertTask.run("Design System Audit", "Review current component library for accessibility", "In Progress", "High", 1, "2026-03-01");
  insertTask.run("API Integration", "Connect task dashboard to backend endpoints", "Todo", "High", 2, "2026-02-25");
  insertTask.run("User Interview Analysis", "Synthesize findings from last week's research", "Done", "Medium", 3, "2026-02-20");
  insertTask.run("Bug: Mobile Layout", "Fix navigation overlap on small screens", "Todo", "Low", 4, "2026-03-05");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/team", (req, res) => {
    const members = db.prepare("SELECT * FROM team_members").all();
    res.json(members);
  });

  app.get("/api/tasks", (req, res) => {
    const tasks = db.prepare(`
      SELECT tasks.*, team_members.name as assignee_name, team_members.avatar_url as assignee_avatar
      FROM tasks
      LEFT JOIN team_members ON tasks.assignee_id = team_members.id
      ORDER BY created_at DESC
    `).all();
    res.json(tasks);
  });

  app.post("/api/tasks", (req, res) => {
    const { title, description, status, priority, assignee_id, due_date } = req.body;
    const info = db.prepare(`
      INSERT INTO tasks (title, description, status, priority, assignee_id, due_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(title, description, status || 'Todo', priority || 'Medium', assignee_id, due_date);
    res.json({ id: info.lastInsertRowid });
  });

  app.patch("/api/tasks/:id", (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(", ");
    const values = Object.values(updates);
    
    if (fields.length > 0) {
      db.prepare(`UPDATE tasks SET ${fields} WHERE id = ?`).run(...values, id);
    }
    res.json({ success: true });
  });

  app.delete("/api/tasks/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
    res.json({ success: true });
  });

  app.get("/api/stats", (req, res) => {
    const statusStats = db.prepare("SELECT status, COUNT(*) as count FROM tasks GROUP BY status").all();
    const priorityStats = db.prepare("SELECT priority, COUNT(*) as count FROM tasks GROUP BY priority").all();
    const teamStats = db.prepare(`
      SELECT team_members.name, COUNT(tasks.id) as task_count
      FROM team_members
      LEFT JOIN tasks ON team_members.id = tasks.assignee_id
      GROUP BY team_members.id
    `).all();
    res.json({ statusStats, priorityStats, teamStats });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
