// frontend/src/components/TaskColumn.jsx
import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import TaskCard from './TaskCard';
import AddTaskForm from './AddTaskForm';

const TaskColumn = ({ 
  column, 
  tasks, 
  onAddTask, 
  onUpdateTask, 
  onDeleteTask, 
  onUpdateColumn, 
  onDeleteColumn,
  onMoveTask 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [showAddTask, setShowAddTask] = useState(false);

  // Setup drop target for drag and drop
  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item) => {
      const newPosition = tasks.length; // Place at end of column
      onMoveTask(item.id, item.columnId, column._id, newPosition);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onUpdateColumn(column._id, title);
      setIsEditing(false);
    }
  };

  const handleDeleteColumn = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette colonne ?')) {
      onDeleteColumn(column._id);
    }
  };

  return (
    <div 
      ref={drop}
      className={`w-80 flex-shrink-0 bg-base-200 rounded-lg shadow ${isOver ? 'border-2 border-primary' : ''}`}
    >
      {/* Column Header */}
      <div className="p-3 border-b border-base-300 flex justify-between items-center">
        {isEditing ? (
          <form onSubmit={handleTitleSubmit} className="flex-1">
            <div className="flex gap-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-sm input-bordered w-full"
                autoFocus
              />
              <button type="submit" className="btn btn-sm btn-primary">
                Enregistrer
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setTitle(column.title);
                  setIsEditing(false);
                }}
                className="btn btn-sm"
              >
                Annuler
              </button>
            </div>
          </form>
        ) : (
          <>
            <h3 className="font-bold truncate flex-1">{column.title}</h3>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-square">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                </svg>
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><a onClick={() => setIsEditing(true)}>Renommer</a></li>
                <li><a onClick={handleDeleteColumn} className="text-error">Supprimer</a></li>
              </ul>
            </div>
          </>
        )}
      </div>

      {/* Task List */}
      <div className="p-2 max-h-[calc(100vh-250px)] overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="text-center p-4 text-base-content/50">
            Aucune tâche
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task, index) => (
              <TaskCard
                key={task._id}
                task={task}
                index={index}
                columnId={column._id}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
                onMoveTask={onMoveTask}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Task Form or Button */}
      <div className="p-2 border-t border-base-300">
        {showAddTask ? (
          <AddTaskForm
            onSubmit={(taskData) => {
              onAddTask(column._id, taskData);
              setShowAddTask(false);
            }}
            onCancel={() => setShowAddTask(false)}
          />
        ) : (
          <button
            onClick={() => setShowAddTask(true)}
            className="btn btn-ghost btn-block btn-sm"
          >
            + Ajouter une tâche
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;