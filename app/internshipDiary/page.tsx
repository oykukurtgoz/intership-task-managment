"use client";
import React, { ChangeEvent, useState, useEffect } from "react";
import { Button } from "@radix-ui/themes";
import Link from "next/link";
import axios from "axios";

interface Diary {
  id: number;
  title: string;
  description: string;
}

const InternshipDiary = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [currentDiary, setCurrentDiary] = useState<Diary | null>(null);

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const response = await axios.get("/api/internshipDiary");
        setDiaries(response.data);
      } catch (error) {
        console.error("Failed to fetch diaries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiaries();
  }, []);

  const deleteDiary = async (diaryId: number) => {
    try {
      const res = await axios.delete(`/api/internshipDiary/${diaryId}`, {
        data: { diaryId },
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 200) {
        setDiaries((prev) => prev.filter((diary) => diary.id !== diaryId));
      } else {
        console.error("Failed to delete diary");
      }
    } catch (error) {
      console.error("Failed to delete diary", error);
    }
  };

  const handleDeleteClick = (diaryId: number) => () => deleteDiary(diaryId);

  const handleUpdateClick = (diary: Diary) => {
    setIsUpdateMode(true);
    setCurrentDiary(diary);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentDiary((prev) =>
      prev ? { ...prev, [name]: value } : null
    );
  };

  const updateDiary = async () => {
    if (!currentDiary) return;
    try {
      const res = await axios.patch(
        `/api/internshipDiary/${currentDiary.id}`,
        {
          data: {
            diaryId: currentDiary.id,
            title: currentDiary.title,
            description: currentDiary.description,
          },
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.status === 200) {
        setDiaries((prev) =>
          prev.map((diary) =>
            diary.id === currentDiary.id ? currentDiary : diary
          )
        );
        setIsUpdateMode(false);
        setCurrentDiary(null);
      } else {
        console.error("Failed to update diary");
      }
    } catch (error) {
      console.error("Failed to update diary", error);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-center text-violet-700">Internship Diaries</h1>

      {diaries.length === 0 ? (
        <p className="text-center text-gray-500">No diaries found.</p>
      ) : (
        diaries.map((diary) => (
          <div
            key={diary.id}
            className="bg-white shadow-md rounded-lg p-4 space-y-2 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-violet-800">{diary.title}</h2>
            <p className="text-gray-700">{diary.description}</p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                className="text-red-600 hover:text-red-800 transition"
                onClick={handleDeleteClick(diary.id)}
                title="Delete"
              >
                🗑️
              </button>
              <button
                className="text-blue-600 hover:text-blue-800 transition"
                onClick={() => handleUpdateClick(diary)}
                title="Update"
              >
                ✏️
              </button>
            </div>
          </div>
        ))
      )}

      {isUpdateMode && currentDiary && (
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 space-y-3 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800">Update Diary</h2>
          <input
            type="text"
            name="title"
            value={currentDiary.title}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Title"
          />
          <textarea
            name="description"
            value={currentDiary.description}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Description"
          />
          <div className="flex space-x-2 justify-end">
            <button
              onClick={updateDiary}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setIsUpdateMode(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-center pt-4">
        <Link href="/internshipDiary/new">
          <Button className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded">
            + New Diary
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default InternshipDiary;
