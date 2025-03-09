import React from 'react';
import api from '../axiosConfig';

const TaskList = ({ tasks, setTasks }) => {
  const deleteTask = async (id) => {
    if (!id) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  return (
    <div className="task-list mt-4">
      {tasks.length === 0 ? (
        <p className="text-center text-base-content/70">Aucune tâche pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow p-4 flex flex-row justify-between items-center"
            >
              <div className="flex-1">
                <h3 className="text-lg font-medium text-base-content">{task.title}</h3>
                <p className="text-sm text-base-content/60">
                  Ajoutée le {new Date(task.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => deleteTask(task._id)}
                className="btn btn-error btn-sm hover:btn-error/80"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;