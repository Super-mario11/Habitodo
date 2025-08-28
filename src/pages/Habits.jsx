import { useState } from "react";
import { useData } from "../context/DataContext";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

export default function HabitPage() {
  const { habits, addHabit, toggleHabitCompletion, editHabit, deleteHabit } =
    useData();
  const { theme } = useTheme();
  const [habitName, setHabitName] = useState("");

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!habitName.trim()) return;
    addHabit(habitName);
    setHabitName("");
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text)",
      }}
      data-theme={theme}
    >
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Habit Tracker</h1>

        {/* Add Habit Form */}
        <form onSubmit={handleAddHabit} className="flex gap-3 mb-8">
          <input
            type="text"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            placeholder="Enter a new habit..."
            className="flex-1 px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 transition"
            style={{
              backgroundColor: "var(--sidebar-bg)",
              borderColor: "var(--sidebar-border)",
              color: "var(--text)",
            }}
          />
          <button
            type="submit"
            className="px-5 py-2 rounded-xl font-medium transition hover:scale-105"
            style={{
              backgroundColor: "var(--link-active)",
              color: "#fff",
            }}
          >
            Add
          </button>
        </form>

        {/* Habits List */}
        <div className="grid gap-4">
          {habits.length === 0 && (
            <p className="text-center opacity-70">
              No habits yet. Add one above!
            </p>
          )}

          <AnimatePresence>
            {habits.map((habit) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                className="p-5 rounded-2xl shadow hover:shadow-lg transition-all flex flex-col gap-3"
                style={{
                  backgroundColor: "var(--sidebar-bg)",
                  border: "1px solid var(--sidebar-border)",
                  color: "var(--text)",
                }}
              >
                {/* Header Row */}
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{habit.name}</h3>
                  <div className="flex items-center gap-2 text-sm opacity-80">
                    <span>🔥 {habit.streak}d</span>
                    <span>🏆 {habit.longestStreak || 0}d</span>
                  </div>
                </div>

                {/* Buttons Row */}
                <div className="flex gap-3 flex-wrap">
                  {/* Complete button */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleHabitCompletion(habit.id)}
                    className="px-4 py-2 rounded font-medium transition-colors duration-200"
                    style={{
                      backgroundColor: habit.doneToday
                        ? "green"
                        : "var(--sidebar-border)",
                      color: habit.doneToday ? "#fff" : "var(--text)",
                    }}
                  >
                    {habit.doneToday ? "Completed ✅" : "Mark Complete"}
                  </motion.button>

                  {/* Edit button */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const newName = prompt(
                        "Enter new habit name",
                        habit.name
                      );
                      if (newName) editHabit(habit.id, newName);
                    }}
                    className="px-4 py-2 rounded font-medium transition-colors hover:brightness-110"
                    style={{
                      backgroundColor: "#3b82f6",
                      color: "#fff",
                    }}
                  >
                    ✏️ Edit
                  </motion.button>

                  {/* Delete button */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => deleteHabit(habit.id)}
                    className="px-4 py-2 rounded font-medium transition-colors hover:brightness-110"
                    style={{
                      backgroundColor: "#ef4444",
                      color: "#fff",
                    }}
                  >
                    🗑 Delete
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
