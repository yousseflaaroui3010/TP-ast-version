// frontend/src/components/Board.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import api from '../axiosConfig';
import TaskColumn from './TaskColumn';
import AddColumnForm from './AddColumnForm';

const Board = () => {
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        setLoading(true);
        
        // Fetch columns
        const columnsRes = await api.get('/columns');
        setColumns(columnsRes.data);
        
        // Fetch all tasks
        const tasksRes = await api.get('/tasks');
        setTasks(tasksRes.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching board data:', err);
        setLoading(false);
      }
    };
    
    fetchBoardData();
  }, []);

  const handleAddColumn = async (title) => {
    try {
      const res = await api.post('/columns', { title });
      setColumns([...columns, res.data]);
    } catch (err) {
      console.error('Error adding column:', err);
    }
  };

  const handleDeleteColumn = async (columnId) => {
    try {
      await api.delete(`/columns/${columnId}`);
      setColumns(columns.filter(col => col._id !== columnId));
      // Also remove tasks associated with this column
      setTasks(tasks.filter(task => task.column !== columnId));
    } catch (err) {
      console.error('Error deleting column:', err);
    }
  };

  const handleUpdateColumn = async (columnId, title) => {
    try {
      const res = await api.put(`/columns/${columnId}`, { title });
      setColumns(columns.map(col => 
        col._id === columnId ? res.data : col
      ));
    } catch (err) {
      console.error('Error updating column:', err);
    }
  };

  const handleAddTask = async (columnId, taskData) => {
    try {
      const res = await api.post('/tasks', {
        ...taskData,
        column: columnId
      });
      setTasks([...tasks, res.data]);
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const res = await api.put(`/tasks/${taskId}`, taskData);
      setTasks(tasks.map(task => 
        task._id === taskId ? res.data : task
      ));
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleMoveTask = useCallback(async (taskId, sourceColumnId, destinationColumnId, newPosition) => {
    try {
      // Find the task
      const taskToMove = tasks.find(task => task._id === taskId);
      if (!taskToMove) return;
      
      // Create a temporary local state update for immediate feedback
      const updatedTasks = tasks.map(task => {
        if (task._id === taskId) {
          return {
            ...task,
            column: destinationColumnId,
            position: newPosition
          };
        }
        
        // If a task is in the same destination column and would be displaced
        if (task.column === destinationColumnId && task.position >= newPosition) {
          return {
            ...task,
            position: task.position + 1
          };
        }
        
        return task;
      });
      
      // Sort tasks by position in each column
      const sortedTasks = [...updatedTasks].sort((a, b) => {
        if (a.column === b.column) {
          return a.position - b.position;
        }
        return 0;
      });
      
      // Update local state immediately for a responsive feel
      setTasks(sortedTasks);
      
      // Send the move request to the server
      await api.post('/tasks/move', {
        taskId,
        sourceColumnId,
        destinationColumnId,
        newPosition
      });
      
      // Optionally refetch all tasks to ensure sync with server
      // For better performance, we're skipping this and relying on our local update
      // const tasksRes = await api.get('/tasks');
      // setTasks(tasksRes.data);
    } catch (err) {
      console.error('Error moving task:', err);
      // On error, refresh tasks from server to ensure consistency
      const tasksRes = await api.get('/tasks');
      setTasks(tasksRes.data);
    }
  }, [tasks]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-dots loading-lg"></div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Mon Tableau</h2>
        
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {columns.map(column => {
            // Get tasks for this column and sort by position
            const columnTasks = tasks
              .filter(task => task.column === column._id)
              .sort((a, b) => a.position - b.position);
              
            return (
              <TaskColumn
                key={column._id}
                column={column}
                tasks={columnTasks}
                onAddTask={handleAddTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onUpdateColumn={handleUpdateColumn}
                onDeleteColumn={handleDeleteColumn}
                onMoveTask={handleMoveTask}
              />
            );
          })}
          
          <AddColumnForm onAddColumn={handleAddColumn} />
        </div>
      </div>
    </DndProvider>
  );
};

export default Board;