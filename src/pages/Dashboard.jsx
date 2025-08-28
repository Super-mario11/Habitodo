import { useData } from "../context/DataContext";

export default function Dashboard() {
  const { habits } = useData();

  // Count how many habits are completed today (supports both data shapes)
  const now = new Date();
  const todayYMD = now.toISOString().split("T")[0];  // e.g., 2025-08-23
  const todayStr = now.toDateString();               // e.g., Sat Aug 23 2025

  const completedToday = habits.filter((h) =>
    (Array.isArray(h.completedDates) && h.completedDates.includes(todayYMD)) ||
    (h.doneToday && h.lastCompleted === todayStr)
  ).length;

  const totalHabits = habits.length;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Habits */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Total Habits</h2>
          <p className="text-3xl font-bold">{totalHabits}</p>
          <p className="muted">Across all categories</p>
        </div>

        {/* Completed Today */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Completed Today</h2>
          <p className="text-3xl font-bold">{completedToday}</p>
          <p className="muted">Habits done today</p>
        </div>

        {/* Completion Rate */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Completion Rate</h2>
          <p className="text-3xl font-bold">
            {totalHabits > 0
              ? Math.round((completedToday / totalHabits) * 100)
              : 0}%
          </p>
          <p className="muted">Daily progress</p>
        </div>
      </div>
    </div>
  );
}
