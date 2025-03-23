// frontend/src/components/AddColumnForm.jsx
import React, { useState } from 'react';

const AddColumnForm = ({ onAddColumn }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAddColumn(title);
      setTitle('');
      setIsAdding(false);
    }
  };

  if (!isAdding) {
    return (
      <div className="w-64 flex-shrink-0">
        <button
          onClick={() => setIsAdding(true)}
          className="btn btn-outline btn-primary w-full"
        >
          + Ajouter une colonne
        </button>
      </div>
    );
  }

  return (
    <div className="w-80 flex-shrink-0 bg-base-200 rounded-lg shadow p-3">
      <form onSubmit={handleSubmit}>
        <h3 className="font-bold mb-2">Ajouter une colonne</h3>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input input-bordered w-full mb-2"
          placeholder="Titre de la colonne"
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setIsAdding(false);
              setTitle('');
            }}
            className="btn btn-ghost"
          >
            Annuler
          </button>
          <button type="submit" className="btn btn-primary">
            Ajouter
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddColumnForm;