import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteTodo, startEditing } from '../store/todosSlice';

const STATUS_LABELS = {
  'todo':        'To Do',
  'in-progress': 'In Progress',
  'done':        'Done',
};

export default function TodoItem({ todo, isEditing }) {
  const dispatch = useDispatch();

  const status = todo.status || (todo.completed ? 'done' : 'todo');

  const formattedDate = new Date(todo.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day:   'numeric',
    year:  'numeric',
  });

  const handleDelete = () => {
    if (window.confirm(`Delete "${todo.title}"? This cannot be undone.`)) {
      dispatch(deleteTodo(todo.id));
    }
  };

  return (
    <div
      className={[
        'task-item',
        status === 'done'  ? 'task-item--done'    : '',
        isEditing          ? 'task-item--editing' : '',
      ].filter(Boolean).join(' ')}
    >
      {/* Content */}
      <div className="task-item__body">
        <div className="task-item__title">{todo.title}</div>

        {todo.description && (
          <div className="task-item__desc">{todo.description}</div>
        )}

        <div className="task-item__meta">
          <span className={`status-badge status-badge--${status}`}>
            Status: {STATUS_LABELS[status] || status}
          </span>
          <span className="task-item__date">{formattedDate}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="task-item__actions">
        <button
          type="button"
          id={`edit-${todo.id}`}
          className="btn btn--edit"
          onClick={() => dispatch(startEditing(todo.id))}
        >
          Edit
        </button>
        <button
          type="button"
          id={`delete-${todo.id}`}
          className="btn btn--delete"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
