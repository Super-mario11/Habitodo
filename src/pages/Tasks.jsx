import { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import { PlusCircle, CheckCircle2, Trash2, Clock } from "lucide-react";

export default function Tasks() {
  const { taskCards, setTaskCards } = useData();
  const [cardTitle, setCardTitle] = useState("");
  const [taskName, setTaskName] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [timerMinutes, setTimerMinutes] = useState("");

  // Countdown updater
  useEffect(() => {
    const interval = setInterval(() => {
      setTaskCards((prevTasks) =>
        prevTasks.map((card) => ({
          ...card,
          items: card.items.map((item) => {
            if (item.deadline && !item.done) {
              const remaining = new Date(item.deadline) - new Date();
              return { ...item, remaining };
            }
            return item;
          }),
        }))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [setTaskCards]);

  // Add new card
  const handleAddCard = () => {
    if (!cardTitle.trim()) return;
    const newCard = {
      id: Date.now(),
      title: cardTitle.trim(),
      items: [],
    };
    setTaskCards([...(taskCards || []), newCard]);
    setCardTitle("");
  };

  // Add new item
  const handleAddItem = () => {
    if (!taskName.trim() || selectedCard === null) return;
    const deadline = timerMinutes
      ? new Date(Date.now() + timerMinutes * 60000)
      : null;

    const newItem = {
      id: Date.now(),
      name: taskName.trim(),
      done: false,
      deadline,
      remaining: deadline ? deadline - new Date() : null,
    };

    setTaskCards(
      taskCards.map((card) =>
        card.id === selectedCard
          ? { ...card, items: [...card.items, newItem] }
          : card
      )
    );
    setTaskName("");
    setTimerMinutes("");
  };

  // Toggle
  const toggleItem = (cardId, itemId) => {
    setTaskCards(
      taskCards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              items: card.items.map((i) =>
                i.id === itemId ? { ...i, done: !i.done } : i
              ),
            }
          : card
      )
    );
  };

  // Delete item
  const deleteItem = (cardId, itemId) => {
    setTaskCards(
      taskCards.map((card) =>
        card.id === cardId
          ? { ...card, items: card.items.filter((i) => i.id !== itemId) }
          : card
      )
    );
  };

  // ❌ Delete entire card
  const deleteCard = (cardId) => {
    setTaskCards(taskCards.filter((card) => card.id !== cardId));
    if (selectedCard === cardId) {
      setSelectedCard(null); // reset selection if deleted
    }
  };

  return (
    <div
      className="p-6 min-h-screen"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <h1 className="text-2xl font-bold mb-6">Tasks</h1>

      {/* Create New Card */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter card title"
          value={cardTitle}
          onChange={(e) => setCardTitle(e.target.value)}
          className="flex-1 rounded-lg px-3 py-2 shadow-sm focus:ring focus:ring-blue-300"
          style={{
            backgroundColor: "var(--sidebar-bg)",
            color: "var(--text)",
            border: "1px solid var(--sidebar-border)",
          }}
        />
        <button
          onClick={handleAddCard}
          className="flex items-center gap-1 px-4 py-2 rounded-lg shadow hover:opacity-90 transition"
          style={{ backgroundColor: "var(--link-active)", color: "#fff" }}
        >
          <PlusCircle size={18} /> Add Card
        </button>
      </div>

      {/* Add Task */}
      {selectedCard && (
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter task"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="flex-1 rounded-lg px-3 py-2 shadow-sm focus:ring focus:ring-blue-300"
            style={{
              backgroundColor: "var(--sidebar-bg)",
              color: "var(--text)",
              border: "1px solid var(--sidebar-border)",
            }}
          />
          <input
            type="number"
            placeholder="Timer (min)"
            value={timerMinutes}
            onChange={(e) => setTimerMinutes(e.target.value)}
            className="w-32 rounded-lg px-3 py-2 shadow-sm focus:ring focus:ring-blue-300"
            style={{
              backgroundColor: "var(--sidebar-bg)",
              color: "var(--text)",
              border: "1px solid var(--sidebar-border)",
            }}
          />
          <button
            onClick={handleAddItem}
            className="flex items-center gap-1 px-4 py-2 rounded-lg shadow hover:opacity-90 transition"
            style={{ backgroundColor: "var(--link-active)", color: "#fff" }}
          >
            <PlusCircle size={18} /> Add Task
          </button>
        </div>
      )}

      {/* Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(taskCards || []).length === 0 && (
          <p style={{ color: "var(--text)" }}>
            No cards yet. Create one above.
          </p>
        )}

        {taskCards.map((card) => (
          <div
            key={card.id}
            className="p-4 rounded-xl shadow-md"
            style={{
              backgroundColor: "var(--sidebar-bg)",
              border: `1px solid ${
                selectedCard === card.id
                  ? "var(--link-active)"
                  : "var(--sidebar-border)"
              }`,
              color: "var(--text)",
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2
                className="text-xl font-semibold cursor-pointer"
                onClick={() => setSelectedCard(card.id)}
              >
                {card.title}
              </h2>
              {/* ❌ Delete Card Button */}
              <button
                onClick={() => deleteCard(card.id)}
                className="px-3 py-1 rounded-lg flex items-center gap-1 transition"
                style={{
                  backgroundColor: "rgb(239,68,68)", // red
                  color: "#fff",
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>

            <ul className="space-y-3">
              {card.items.length === 0 && (
                <p style={{ color: "var(--text)", opacity: 0.6 }}>
                  No tasks inside this card.
                </p>
              )}
              {card.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg shadow-md"
                  style={{
                    backgroundColor: item.done
                      ? "rgba(34,197,94,0.15)" // soft green
                      : "var(--bg)",
                  }}
                >
                  <div>
                    <span
                      className="text-lg"
                      style={{
                        textDecoration: item.done ? "line-through" : "none",
                        color: "var(--text)",
                        opacity: item.done ? 0.6 : 1,
                      }}
                    >
                      {item.name}
                    </span>
                    {item.deadline && (
                      <div
                        className="flex items-center text-sm mt-1"
                        style={{ color: "var(--text)", opacity: 0.8 }}
                      >
                        <Clock size={14} className="mr-1" />
                        {item.remaining > 0
                          ? `${Math.floor(item.remaining / 60000)}m ${Math.floor(
                              (item.remaining % 60000) / 1000
                            )}s left`
                          : "Time's up!"}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleItem(card.id, item.id)}
                      className="px-3 py-1 rounded-lg flex items-center gap-1 transition"
                      style={{
                        backgroundColor: item.done
                          ? "rgb(34,197,94)" // green
                          : "var(--sidebar-border)",
                        color: item.done ? "#fff" : "var(--text)",
                      }}
                    >
                      <CheckCircle2 size={16} />
                    </button>

                    <button
                      onClick={() => deleteItem(card.id, item.id)}
                      className="px-3 py-1 rounded-lg flex items-center gap-1 transition"
                      style={{
                        backgroundColor: "rgb(239,68,68)", // red
                        color: "#fff",
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
