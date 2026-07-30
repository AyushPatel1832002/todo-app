import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAllTodos, selectEditingId } from '../store/todosSlice';
import TodoItem from './TodoItem';

const FILTER_OPTIONS = [
  { value: 'all',         label: 'All' },
  { value: 'todo',        label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done',        label: 'Done' },
];

export default function TodoList() {
  const todos     = useSelector(selectAllTodos);
  const editingId = useSelector(selectEditingId);
  const [filter, setFilter] = useState('all');

  // Normalise status for old items that only have `completed`
  const normalise = (t) => ({
    ...t,
    status: t.status || (t.completed ? 'done' : 'todo'),
  });

  const allNormalised = todos.map(normalise);

  const visible = filter === 'all'
    ? allNormalised
    : allNormalised.filter((t) => t.status === filter);

  return (
    <>
      {/* Section header + filter */}
      <div className="list-header">
        <h2 className="section__heading" style={{ margin: 0 }}>Task List</h2>
        <div className="list-header__filter">
          <label htmlFor="filter-select" style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>
            Filter:
          </label>
          <select
            id="filter-select"
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Empty state */}
      {todos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">📋</div>
          <div className="empty-state__title">No tasks yet</div>
          <p>Add your first task above to get started.</p>
        </div>
      ) : visible.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">🔍</div>
          <div className="empty-state__title">No tasks match this filter</div>
          <p>Try selecting a different status filter.</p>
        </div>
      ) : (
        <div className="task-list">
          {visible.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              isEditing={editingId === todo.id}
            />
          ))}
        </div>
      )}
    </>
  );
}
