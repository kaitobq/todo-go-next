"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";

type Todo = {
  ID: string;
  title: string;
  limit: Date;
};

export default function Home() {
  const [todoList, setTodoList] = useState<Todo[]>([]);

  const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  });

  const ref = useRef<HTMLInputElement | null>(null);

  const getTodoList = async () => {
    try {
      const res = await apiClient.get<{ data: Todo[] }>("/api/todo");
      if (Array.isArray(res.data.data)) {
        setTodoList(res.data.data);
        console.log(res.data.data);
      } else {
        console.error("Unexpected response data:", res.data);
        setTodoList([]);
      }
    } catch (error) {
      console.error("Error fetching todo list:", error);
    }
  };

  const addTodo = async (todo: string) => {
    try {
      const newTodo = {
        title: todo,
        limit: new Date().toISOString(),
      };
      const res = await apiClient.post<{ data: Todo }>("/api/todo", newTodo);
      setTodoList((prevTodoList) => [...prevTodoList, res.data.data]);
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await apiClient.delete(`/api/todo/${id}`);
      const newTodoList = todoList.filter((todo) => todo.ID !== id);
      setTodoList(newTodoList);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const store = async () => {
    if (ref.current) {
      await addTodo(ref.current.value);
      ref.current.value = "";
    }
  };

  const enter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      store();
    }
  };

  useEffect(() => {
    getTodoList();
  }, []);

  return (
    <main className="container mx-auto p-4">
      <nav className="bg-blue-600 p-4 rounded-md">
        <h1 className="text-white text-center text-2xl font-bold">Todo List</h1>
      </nav>
      <div className="mt-8">
        <div className="flex items-center space-x-4 mb-4">
          <input
            className="flex-grow p-2 border border-gray-300 rounded-md"
            type="text"
            ref={ref}
            placeholder="TODO"
            onKeyDown={enter}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
            onClick={store}
          >
            ADD
          </button>
        </div>
        {Array.isArray(todoList) && (
          <ul className="space-y-2">
            {todoList.map((todo) => (
              <li
                key={todo.ID}
                className="flex justify-between items-center p-2 border border-gray-300 rounded-md"
              >
                <span className="text-lg">{todo.title}</span>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded-md"
                  onClick={() => deleteTodo(todo.ID)}
                >
                  delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
