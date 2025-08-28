import { useState } from "react";
import { useData } from "../../context/DataContext";

export default function HabitForm() {
  const { addHabit } = useData();
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addHabit(name);
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="habit-form">
      <input
        type="text"
        placeholder="Enter a habit..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Add Habit</button>
    </form>
  );
}
