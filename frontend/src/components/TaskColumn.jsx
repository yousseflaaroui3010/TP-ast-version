// frontend/src/components/TaskColumn.jsx
import React, { useState, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../utils/constants';
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
  
  const ref = useRef(null);

  // Handle dropping tasks into this column
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item, monitor) => {
      // Handle dropping a task into this column
      const didDrop = monitor.didDrop();
      
      // If the drop was already handled by a nested target, exit
      if (didDrop) {
        return;
      }
      
      // If the task is from a different column, move it to this column
      if (item.columnId !== column._id) {
        // Move to the end of this column
        const newPosition = tasks.length;
        onMoveTask(item.id, item.columnId, column._id, newPosition);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
      canDrop: !!monitor.canDrop(),
    }),
  });

  // Apply the drop ref to the column
  drop(ref);

  // Handle moving tasks within or between columns
  const moveTask = (id, sourceColumnId, targetColumnId, toIndex) => {
    onMoveTask(id, sourceColumnId, targetColumnId, toIndex);
  };

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

  // Highlight the column when a task is being dragged over it
  const dropTargetHighlight = isOver ? 'border-2 border-primary' : '';
  const isActive = isOver && canDrop;

  return (
    <div 
      ref={ref}
      className={`w-80 flex-shrink-0 bg-base-200 rounded-lg shadow flex flex-col ${dropTargetHighlight} ${
        isActive ? 'bg-base-300' : ''
      }`}
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
      <div className="p-2 flex-grow overflow-y-auto max-h-[calc(100vh-250px)]">
        {tasks.length === 0 ? (
          <div className="text-center p-4 text-base-content/50">
            Aucune tâche
          </div>
        ) : (
          <div>
            {tasks.map((task, index) => (
              <TaskCard
                key={task._id}
                task={task}
                index={index}
                columnId={column._id}
                moveTask={moveTask}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
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