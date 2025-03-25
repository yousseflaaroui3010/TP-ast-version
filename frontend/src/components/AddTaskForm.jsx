// frontend/src/components/AddTaskForm.jsx
import React, { useState } from 'react';
import { format } from 'date-fns';

const AddTaskForm = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [labels, setLabels] = useState([]);
  const [newLabel, setNewLabel] = useState('');
  const [hasDueDate, setHasDueDate] = useState(false);
  const [dueDate, setDueDate] = useState('');
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({
        title,
        description,
        priority,
        labels,
        dueDate: hasDueDate ? new Date(dueDate) : null
      });
      resetForm();
    }
  };
  
  // Reset form fields
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setLabels([]);
    setNewLabel('');
    setHasDueDate(false);
    setDueDate('');
  };
  
  // Add a new label
  const handleAddLabel = (e) => {
    e.preventDefault();
    if (newLabel.trim() && !labels.includes(newLabel.trim())) {
      setLabels([...labels, newLabel.trim()]);
      setNewLabel('');
    }
  };
  
  // Remove a label
  const handleRemoveLabel = (labelToRemove) => {
    setLabels(labels.filter(label => label !== labelToRemove));
  };

  // Handle pressing enter in title field to focus description
  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.getElementById('taskDescription').focus();
    }
  };

  // Handle pressing enter in description field to focus priority
  const handleDescriptionKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.getElementById('taskPriority').focus();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card bg-base-100 shadow p-3">
      {/* Task Title */}
      <input
        id="taskTitle"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleTitleKeyDown}
        className="input input-sm input-bordered w-full mb-2"
        placeholder="Titre de la tâche"
        autoFocus
      />
      
      {/* Task Description - Optional */}
      <textarea
        id="taskDescription"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={handleDescriptionKeyDown}
        className="textarea textarea-bordered textarea-sm w-full mb-2"
        placeholder="Description (optionnel)"
        rows="2"
      />
      
      {/* Task Priority */}
      <select
        id="taskPriority"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="select select-sm select-bordered w-full mb-2"
      >
        <option value="low">Priorité basse</option>
        <option value="medium">Priorité moyenne</option>
        <option value="high">Priorité haute</option>
      </select>
      
      {/* Due Date Toggle and Selector */}
      <div className="form-control mb-2">
        <label className="label cursor-pointer justify-start gap-2 py-1">
          <input 
            type="checkbox" 
            className="checkbox checkbox-sm" 
            checked={hasDueDate}
            onChange={() => setHasDueDate(!hasDueDate)}
          />
          <span className="label-text">Date d'échéance</span>
        </label>
        
        {hasDueDate && (
          <input 
            type="datetime-local" 
            className="input input-sm input-bordered" 
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
          />
        )}
      </div>
      
      {/* Labels Section */}
      <div className="mb-3">
        <div className="flex flex-wrap gap-1 mb-1">
          {labels.map((label, index) => (
            <span 
              key={index} 
              className="badge badge-sm"
            >
              {label}
              <button 
                type="button"
                onClick={() => handleRemoveLabel(label)}
                className="ml-1"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-1">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="input input-sm input-bordered flex-grow"
            placeholder="Ajouter une étiquette"
          />
          <button 
            type="button" 
            onClick={handleAddLabel}
            className="btn btn-sm"
          >
            +
          </button>
        </div>
      </div>
      
      {/* Form Actions */}
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