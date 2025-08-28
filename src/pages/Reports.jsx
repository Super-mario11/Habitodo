import { useData } from "../context/DataContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Reports() {
  const { habits } = useData();

  // Guard: no habits yet
  if (!habits || habits.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Reports</h1>
        <p className="muted">No data yet. Start tracking your habits!</p>
      </div>
    );
  }

  // Build safe data
  const data = habits.map((h) => ({
    name: h.name || "Unnamed",
    completions: Array.isArray(h.completedDates)
      ? h.completedDates.length
      : 0,
    streak: typeof h.streak === "number" ? h.streak : 0,
  }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      <div className="space-y-8">
        {/* Completion Stats */}
        <div className="card h-[360px]">
          <h2 className="text-lg font-semibold mb-3">Completion Stats</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="completions" fill="#4ade80" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Streak Overview */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Current Streaks</h2>
          <ul className="space-y-2">
            {data.map((d) => (
              <li
                key={d.name}
                className="flex justify-between items-center border-b pb-2"
                style={{ borderColor: "var(--border)" }}
              >
                <span>{d.name}</span>
                <span className="font-medium">
                  {d.streak > 0 ? `🔥 ${d.streak} days` : "No streak"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
