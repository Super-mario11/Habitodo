// src/components/habits/HabitList.jsx
import { useState } from "react";
import { useData } from "../../context/DataContext";

export default function HabitList() {
  const { habits, toggleHabitCompletion, deleteHabit, editHabit } = useData();
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const startEditing = (habit) => {
    setEditingId(habit.id);
    setNewTitle(habit.name);
  };

  const saveEdit = (id) => {
    if (newTitle.trim() !== "") {
      editHabit(id, newTitle);
    }
    setEditingId(null);
    setNewTitle("");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Your Habits</h2>
      {habits.length === 0 && <p className="text-gray-500">No habits yet</p>}

      <ul className="space-y-2">
        {habits.map((habit) => {
          const today = new Date().toISOString().split("T")[0];
          const doneToday = habit.completedDates?.includes(today);

          return (
            <li
              key={habit.id}
              className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded-lg"
            >
              <div>
                {editingId === habit.id ? (
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="border px-2 py-1 rounded"
                  />
                ) : (
                  <>
                    <p className="font-medium">{habit.name}</p>
                    <p className="text-sm text-gray-500">
                      🔥 Streak: {habit.streak} days
                    </p>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                {/* Toggle button */}
                <button
                  onClick={() => toggleHabitCompletion(habit.id)}
                  className={`px-3 py-1 rounded transition-colors ${
                    doneToday
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 dark:bg-gray-600 text-black dark:text-white"
                  }`}
                >
                  {doneToday ? "Done ✅" : "Mark"}
                </button>

                {/* Edit button */}
                {editingId === habit.id ? (
                  <button
                    onClick={() => saveEdit(habit.id)}
                    className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  >
                    Save 💾
                  </button>
                ) : (
                  <button
                    onClick={() => startEditing(habit)}
                    className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
                  >
                    Edit ✏️
                  </button>
                )}

                {/* Delete button */}
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Delete 🗑️
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
