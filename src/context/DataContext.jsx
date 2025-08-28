import { createContext, useContext, useEffect, useMemo, useState } from "react";

const DataContext = createContext();
const ymd = (d = new Date()) => d.toISOString().split("T")[0];

function computeConsecutiveStreak(datesSet, endYMD) {
  let count = 0;
  const d = new Date(endYMD);
  while (true) {
    const key = d.toISOString().split("T")[0];
    if (!datesSet.has(key)) break;
    count += 1;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

export const DataProvider = ({ children }) => {
  /** ---------------- HABITS ---------------- */
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem("habits");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  // Normalize old habit data
  useEffect(() => {
    setHabits((prev) =>
      prev.map((h) => ({
        id: h.id,
        name: h.name ?? h.title ?? "",
        completedDates: Array.isArray(h.completedDates) ? h.completedDates : [],
        lastCompleted: h.lastCompleted ?? null,
        doneToday: h.lastCompleted === ymd(),
        streak: Number.isFinite(h.streak) ? h.streak : 0,
        longestStreak: Number.isFinite(h.longestStreak) ? h.longestStreak : 0,
        createdAt: h.createdAt ?? ymd(),
      }))
    );
  }, []);

  useEffect(() => {
    const tick = () => {
      const today = ymd();
      const yesterday = ymd(new Date(Date.now() - 86400000));
      setHabits((prev) =>
        prev.map((h) => {
          const doneToday = h.lastCompleted === today;
          let newStreak = h.streak;
          if (!doneToday) {
            if (h.lastCompleted === yesterday) {
              newStreak = h.streak;
            } else if (h.lastCompleted) {
              newStreak = 0;
            }
          }
          return { ...h, doneToday, streak: newStreak };
        })
      );
    };
    tick();
    const iv = setInterval(tick, 60 * 1000);
    return () => clearInterval(iv);
  }, []);

  const addHabit = (name) => {
    const today = ymd();
    setHabits((prev) => [
      ...prev,
      {
        id: Date.now(),
        name,
        completedDates: [],
        lastCompleted: null,
        doneToday: false,
        streak: 0,
        longestStreak: 0,
        createdAt: today,
      },
    ]);
  };

  const editHabit = (id, newName) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, name: newName } : h))
    );
  };

  const deleteHabit = (id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const toggleHabitCompletion = (id) => {
    const today = ymd();
    const yesterday = ymd(new Date(Date.now() - 86400000));

    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;

        const dates = new Set(h.completedDates);
        const hasToday = dates.has(today);

        if (hasToday) {
          dates.delete(today);
          const newLastCompleted =
            dates.size > 0 ? Array.from(dates).sort().pop() : null;
          const streakEndingAtYesterday = newLastCompleted
            ? computeConsecutiveStreak(dates, yesterday)
            : 0;

          return {
            ...h,
            completedDates: Array.from(dates).sort(),
            lastCompleted: newLastCompleted,
            doneToday: false,
            streak: streakEndingAtYesterday,
            longestStreak: h.longestStreak,
          };
        } else {
          dates.add(today);
          const newStreak =
            h.lastCompleted === yesterday ? h.streak + 1 : 1;
          const newLongest = Math.max(newStreak, h.longestStreak || 0);

          return {
            ...h,
            completedDates: Array.from(dates).sort(),
            lastCompleted: today,
            doneToday: true,
            streak: newStreak,
            longestStreak: newLongest,
          };
        }
      })
    );
  };

  /** ---------------- TASK CARDS ---------------- */
  const [taskCards, setTaskCards] = useState(() => {
    const saved = localStorage.getItem("taskCards");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("taskCards", JSON.stringify(taskCards));
  }, [taskCards]);

  /** ---------------- VALUE ---------------- */
  const value = useMemo(
    () => ({
      // Habits
      habits,
      setHabits,
      addHabit,
      editHabit,
      deleteHabit,
      toggleHabitCompletion,
      // Task Cards
      tasks: taskCards,   // 🔑 Alias so Tasks.jsx works
      setTasks: setTaskCards,
      taskCards,
      setTaskCards,
    }),
    [habits, taskCards]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => useContext(DataContext);
