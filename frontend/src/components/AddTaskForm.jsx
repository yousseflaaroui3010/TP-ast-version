// frontend/src/components/AddTaskForm.jsx
import React, { useState } from 'react';

const AddTaskForm = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({
        title,
        description,
        priority
      });
      resetForm();
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
  };

  return (
    <form onSubmit={handleSubmit} className="card bg-base-100 shadow p-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input input-sm input-bordered w-full mb-2"
        placeholder="Titre de la tâche"
        autoFocus
      />
      
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="textarea textarea-bordered textarea-sm w-full mb-2"
        placeholder="Description (optionnel)"
        rows="2"
      />
      
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="select select-sm select-bordered w-full mb-2"
      >
        <option value="low">Priorité basse</option>
        <option value="medium">Priorité moyenne</option>
        <option value="high">Priorité haute</option>
      </select>
      
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            resetForm();
            onCancel();
          }}
          className="btn btn-ghost btn-sm"
        >
          Annuler
        </button>
        <button type="submit" className="btn btn-primary btn-sm">
          Ajouter
        </button>
      </div>
    </form>
  );
};

export default AddTaskForm;