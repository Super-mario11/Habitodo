import { useData } from "../../context/DataContext";

export default function HabitCard({ habit }) {
  const { toggleHabit, deleteHabit } = useData();

  return (
    <div className="habit-card">
      <div>
        <strong>{habit.name}</strong>
        <p>🔥 Streak: {habit.streak} days</p>
      </div>
      <div className="habit-actions">
        <button onClick={() => toggleHabit(habit.id)}>
          {habit.completedToday ? "✅ Done" : "Mark Done"}
        </button>
        <button onClick={() => deleteHabit(habit.id)}>❌</button>
      </div>
    </div>
  );
}
