import React, { useState, useEffect } from "react";
import { Fade } from "react-awesome-reveal";
import dlight from "./assets/desktoplight.jpg";
import ddark from "./assets/desktopdark.jpg";
import sun from "./assets/icon-sun.svg";
import moon from "./assets/icon-moon.svg";
import iclose from "./assets/icon-cross.svg";
import { BsTrash3 } from "react-icons/bs";

// Navbar section
export const Titlecontainer = ({ fonts, dark, toggle }) => {
  return (
    <nav className="flex flex-row justify-between items-center gap-36 md:gap-48 p-3">
      <h1
        className="text-3xl md:text-5xl font-semibold text-slate-50 tracking-widest"
        style={fonts}
      >
        TODO
      </h1>
      <button type="button" onClick={toggle} className="btn btn-ghost">
        <img src={dark ? sun : moon} alt="toggle icon" />
      </button>
    </nav>
  );
};

// Main container
const App = () => {
  // State for toggling dark mode
  const [dark, setDark] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  let nextId = tasks.length ? tasks[tasks.length - 1].id + 1 : 0;

  const footbutton = `flex justify-center items-center btn btn-sm btn-outline ${dark ? "btn-outline-base-300 text-slate-50 justify-center md:justify-between" : ""}`;
  const dlbtb = footbutton;

  let fonts = {
    fontFamily: "'Josefin Sans', sans-serif",
  };

  const inputClasses = `py-2 input input-md w-80 md:w-96 text-xl ${
    dark ? "bg-slate-800 text-slate-50" : "bg-slate-100 text-slate-900"
  }`;

  const containClass = `bg-slate-50 backdrop-blur-md w-80 md:w-96 h-96 p-4 rounded-lg shadow-lg flex flex-col ${
    dark ? "bg-slate-800 text-slate-50" : "bg-slate-100 text-slate-900"
  }`;

  const bgswitch = `h-screen ${dark ? "bg-slate-900" : "bg-slate-50"}`;

  const toggle = (e) => {
    e.preventDefault();
    setDark(!dark);
  };

  const handleValue = (e) => {
    e.preventDefault();
    setNewTask(e.target.value);
  };

  const handleSubmission = (e) => {
    if (e.key === "Enter" && newTask.trim()) {
      e.preventDefault();
      setTasks([...tasks, { id: nextId++, text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "Active") return !task.completed;
    if (filter === "Completed") return task.completed;
    return true;
  });

  return (
    <main className={bgswitch}>
      <div className="relative h-full w-full flex flex-col items-center">
        <img
          src={dark ? ddark : dlight}
          alt="background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-8">
          <Titlecontainer fonts={fonts} dark={dark} toggle={toggle} />
          <div className="p-4">
            <div className={inputClasses} style={fonts}>
              <input
                type="text"
                placeholder="Create a new todo ..."
                onChange={handleValue}
                onKeyDown={handleSubmission}
                value={newTask}
              />
            </div>
          </div>
          <div className={containClass} style={fonts}>
            <ul className="flex-grow overflow-y-auto">
              <Fade>
                {filteredTasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between my-2 border-b-2 p-2"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className={`checkbox check-circle mr-4 ${
                          dark
                            ? "checkbox border border-1 border-slate-50"
                            : "checkbox-base-300"
                        }`}
                        checked={task.completed}
                        onChange={() => {
                          setTasks(
                            tasks.map((t) =>
                              t.id === task.id
                                ? { ...t, completed: !t.completed }
                                : t,
                            ),
                          );
                        }}
                      />
                      <span className="text-xl font-medium">{task.text}</span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost"
                      onClick={() => handleDelete(task.id)}
                    >
                      <img src={iclose} alt="close icon" />
                    </button>
                  </li>
                ))}
              </Fade>
            </ul>
            <div className="footer border-t-2 flex justify-center md:justify-between items-center mt-6 p-2">
              <span className="hidden md:block" style={fonts}>
                {tasks.filter((task) => !task.completed).length} items left
              </span>
              <div
                className={`filter-buttons flex space-x-0 ${dark ? "text-slate-50" : "text-slate-900"}`}
              >
                <button className={footbutton} onClick={() => setFilter("All")}>
                  All
                </button>
                <button
                  className={footbutton}
                  onClick={() => setFilter("Active")}
                >
                  Active
                </button>
                <button
                  className={footbutton}
                  onClick={() => setFilter("Completed")}
                >
                  Completed
                </button>
              </div>
              <button
                className={dlbtb}
                onClick={() =>
                  setTasks(tasks.filter((task) => !task.completed))
                }
              >
                <BsTrash3 />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default App;
