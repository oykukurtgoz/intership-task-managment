"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { TaskState } from "@prisma/client";

interface Task {
  id: number;
  title: string;
  taskState: TaskState;
}

interface Diary {
  id: number;
  title: string;
  createdAt: string;
}

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);

  const categories: TaskState[] = ["TODO", "INPROGRESS", "DONE"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskRes, diaryRes] = await Promise.all([
          axios.get("/api/task"),
          axios.get("/api/internshipDiary"),
        ]);
        setTasks(taskRes.data);
        setDiaries(
          diaryRes.data.sort(
            (a: Diary, b: Diary) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-500 animate-pulse">Yükleniyor...</p>
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-12">
      {/* Görev Kartları */}
      <section>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Tasks
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => {
            const count = tasks.filter((task) => task.taskState === category)
              .length;
            return (
              <div
                key={category}
                className="bg-gradient-to-br from-violet-100 to-violet-200 hover:shadow-xl transition duration-300 rounded-xl p-6 text-center border border-violet-300"
              >
                <h2 className="text-lg font-semibold text-violet-800 uppercase tracking-wider">
                  {category}
                </h2>
                <p className="text-4xl font-extrabold text-violet-600 mt-2">
                  {count}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Günlük Kartları */}
      <section>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Recent Internship Diaries
        </h1>
        {diaries.length === 0 ? (
          <p className="text-gray-500 italic">Henüz günlük eklenmedi.</p>
        ) : (
          <div className="space-y-4">
            {diaries.map((diary) => (
              <div
                key={diary.id}
                className="bg-white hover:bg-gray-50 transition duration-300 border border-gray-200 rounded-lg p-5 flex justify-between items-center shadow-sm"
              >
                <p className="text-base font-medium text-gray-800">
                  {diary.title}
                </p>
                <span className="text-sm text-gray-500">
                  {new Date(diary.createdAt).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
