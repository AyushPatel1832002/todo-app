import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addTodo,
  updateTodo,
  cancelEditing,
  selectEditingTodo,
} from '../store/todosSlice';

const emptyForm = { title: '', description: '', status: 'todo' };

const STATUS_OPTIONS = [
  { value: 'todo',        label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done',        label: 'Done' },
];

export default function TodoForm() {
  const dispatch     = useDispatch();
  const editingTodo  = useSelector(selectEditingTodo);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const titleRef = useRef(null);

  const isEditing = Boolean(editingTodo);

  useEffect(() => {
    if (editingTodo) {
      setForm({
        title:       editingTodo.title,
        description: editingTodo.description,
        status:      editingTodo.status || 'todo',
      });
      titleRef.current?.focus();
    } else {
      setForm(emptyForm);
    }
  }, [editingTodo]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Please enter a task name.');
      return;
    }
    if (isEditing) {
      dispatch(updateTodo({ id: editingTodo.id, ...form }));
    } else {
      dispatch(addTodo(form));
    }
    setForm(emptyForm);
    setError('');
  };

  const handleCancel = () => {
    dispatch(cancelEditing());
    setForm(emptyForm);
    setError('');
  };

  return (
    <form className="entry-form" onSubmit={handleSubmit} noValidate>
      {/* Task Name */}
      <div className="form-field">
        <input
          id="task-title"
          ref={titleRef}
          type="text"
          placeholder="Task Name"
          value={form.title}
          onChange={handleChange('title')}
          autoComplete="off"
        />
      </div>

      {/* Task Description */}
      <div className="form-field">
        <textarea
          id="task-description"
          placeholder="Task Description"
          value={form.description}
          onChange={handleChange('description')}
          rows={4}
        />
      </div>

      {/* Status Dropdown */}
      <div className="form-field">
        <select
          id="task-status"
          value={form.status}
          onChange={handleChange('status')}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="form-error">⚠ {error}</div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.6rem' }}>
        <button type="submit" className="btn btn--add" style={{ flex: 1 }}>
          {isEditing ? 'Update Task' : 'Add Task'}
        </button>
        {isEditing && (
          <button type="button" className="btn btn--ghost" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
