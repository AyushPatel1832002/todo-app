import React from 'react';
import { useSelector } from 'react-redux';
import { selectAllTodos } from './store/todosSlice';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

export default function App() {
  const todos = useSelector(selectAllTodos);

  const todoCount     = todos.filter((t) => t.status === 'todo' || (!t.status && !t.completed)).length;
  const progressCount = todos.filter((t) => t.status === 'in-progress').length;
  const doneCount     = todos.filter((t) => t.status === 'done' || (!t.status && t.completed)).length;

  return (
    <div className="page">
      <div className="card">
        {/* ── Header ── */}
        <header className="page__header">
          <h1 className="page__title">Task Management App</h1>

          {todos.length > 0 && (
            <div className="page__stats">
              <div className="stat">
                <span className="stat__dot stat__dot--todo" />
                <span className="stat__count">{todoCount}</span>
                <span>To Do</span>
              </div>
              <div className="stat">
                <span className="stat__dot stat__dot--progress" />
                <span className="stat__count">{progressCount}</span>
                <span>In Progress</span>
              </div>
              <div className="stat">
                <span className="stat__dot stat__dot--done" />
                <span className="stat__count">{doneCount}</span>
                <span>Done</span>
              </div>
            </div>
          )}
        </header>

        {/* ── Add New Task ── */}
        <section className="card__section">
          <h2 className="section__heading">Add New Task</h2>
          <TodoForm />
        </section>

        {/* ── Task List ── */}
        <section className="card__section">
          <TodoList />
        </section>
      </div>
    </div>
  );
}
