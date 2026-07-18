import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!task.trim()) {
      alert("Please enter a task!");
      return;
    }

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: task,
        completed: false,
      },
    ]);

    setTask("");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((item) =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((item) => item.id !== id));
  };

  const editTask = (id) => {
    const updated = prompt(
      "Edit Task",
      tasks.find((t) => t.id === id).text
    );

    if (updated) {
      setTasks(
        tasks.map((item) =>
          item.id === id
            ? { ...item, text: updated }
            : item
        )
      );
    }
  };

  const filteredTasks = tasks
    .filter((item) =>
      item.text.toLowerCase().includes(search.toLowerCase())
    )
    .filter((item) => {
      if (filter === "completed") return item.completed;
      if (filter === "pending") return !item.completed;
      return true;
    });

  return (
    <div className="container">
      <h1>☕ TaskFlow</h1>

      <div className="stats">
        <div className="card">
          <h2>{tasks.length}</h2>
          <p>Total</p>
        </div>

        <div className="card">
          <h2>
            {tasks.filter((t) => t.completed).length}
          </h2>
          <p>Completed</p>
        </div>

        <div className="card">
          <h2>
            {tasks.filter((t) => !t.completed).length}
          </h2>
          <p>Pending</p>
        </div>
      </div>

      <div className="input-box">
        <input
          type="text"
          placeholder="Add a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />

        <button onClick={addTask}>Add</button>
      </div>

      <input
        className="search"
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="filters">
        <button onClick={() => setFilter("all")}>
          All
        </button>

        <button
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>

        <button onClick={() => setFilter("pending")}>
          Pending
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="empty">
          🎉 You're all caught up!
        </p>
      ) : (
        filteredTasks.map((item) => (
          <div className="task-card" key={item.id}>
            <div className="task-left">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleTask(item.id)}
              />

              <span
                className={
                  item.completed ? "completed" : ""
                }
              >
                {item.text}
              </span>
            </div>

            <div className="btns">
              <button
                onClick={() => editTask(item.id)}
              >
                Edit
              </button>

              <button
                onClick={() => deleteTask(item.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      {tasks.length > 0 && (
        <button
          className="clear"
          onClick={() => setTasks([])}
        >
          Clear All Tasks
        </button>
      )}
    </div>
  );
}

export default App;