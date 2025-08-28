import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import "./Sidebar.css";

export default function Sidebar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const links = [
    { path: "/dashboard", label: "📊 Dashboard" },
    { path: "/reports", label: "📈 Reports" },
    { path: "/habits", label: "✅ Habits" },
    { path: "/tasks", label: "📝 Tasks" },
    { path: "/calendar", label: "📅 Calendar" },
    { path: "/settings", label: "⚙️ Settings" },
  ];

  return (
    <aside className="sidebar">
      <h2 className="logo">Habit + To-Do</h2>
      <nav>
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`nav-link ${
              location.pathname === link.path ? "active" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="theme-toggle">
        <button onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>
    </aside>
  );
}
