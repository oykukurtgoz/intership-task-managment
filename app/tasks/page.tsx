"use client";
import { TaskState } from '@prisma/client';
import axios from 'axios';
import { useState, useEffect, ChangeEvent } from 'react';

interface Task {
  id: number;
  title: string;
  taskState: TaskState;
}

const categories: TaskState[] = ['TODO', 'INPROGRESS', 'DONE'];

const TaskPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  useEffect(() => {
    fetch('/api/task')
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  const addTask = async () => {
    if (newTask !== '') {
      const res = await fetch('/api/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTask, taskState: selectedCategory }),
      });
      const newTaskData: Task = await res.json();
      setTasks((prev) => [...prev, newTaskData]);
      setNewTask('');
      setSelectedCategory(categories[0]);
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      const res = await axios.delete(`/api/task/${taskId}`, {
        data: { taskId },
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.status === 200) {
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
      }
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-slate-100 to-gray-200">
      <div className="max-w-4xl mx-auto mb-10">
        <h1 className="text-3xl font-semibold text-center mb-6 text-violet-700">Task Management</h1>
        <div className="flex flex-col md:flex-row items-center justify-center gap-3">
          <input
            type="text"
            className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-violet-400"
            placeholder="New Task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as TaskState)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-lg transition-shadow shadow-md hover:shadow-lg"
            onClick={addTask}
          >
            Add
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {categories.map((category) => (
          <div key={category} className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="text-xl font-semibold mb-4 text-violet-700">{category}</h2>
            <div className="space-y-4">
              {tasks
                .filter((task) => task.taskState === category)
                .map((task) => (
                  <div
                    key={task.id}
                    className="bg-violet-50 hover:bg-violet-100 transition-colors duration-200 rounded-xl px-4 py-3 shadow-sm flex justify-between items-center"
                  >
                    <p className="text-sm font-medium text-gray-800 truncate">{task.title}</p>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 hover:bg-red-100 rounded-full w-8 h-8 flex items-center justify-center"
                      title="Delete"
                    >
                      &times;
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskPage;
