// frontend/src/components/TaskSorting.jsx
import React from 'react';
import { FaSortAmountDown, FaSortAlphaDown, FaSortAlphaDownAlt, FaClock, FaExclamationTriangle } from 'react-icons/fa';

const TaskSorting = ({ currentSort, onSortChange }) => {
  // Define available sort options
  const sortOptions = [
    { 
      id: 'createdAt-desc', 
      label: 'Plus récents', 
      icon: <FaClock />,
      description: 'Trier par date de création (plus récents d\'abord)'
    },
    { 
      id: 'createdAt-asc', 
      label: 'Plus anciens', 
      icon: <FaClock />,
      description: 'Trier par date de création (plus anciens d\'abord)'
    },
    { 
      id: 'dueDate-asc', 
      label: 'Date d\'échéance (urgent)', 
      icon: <FaExclamationTriangle />,
      description: 'Trier par date d\'échéance (plus urgent d\'abord)'
    },
    { 
      id: 'alphabetical-asc', 
      label: 'A à Z', 
      icon: <FaSortAlphaDown />,
      description: 'Trier par ordre alphabétique (A à Z)'
    },
    { 
      id: 'alphabetical-desc', 
      label: 'Z à A', 
      icon: <FaSortAlphaDownAlt />,
      description: 'Trier par ordre alphabétique (Z à A)'
    },
    { 
      id: 'priority-desc', 
      label: 'Priorité (haute)', 
      icon: <FaSortAmountDown />,
      description: 'Trier par priorité (haute à basse)'
    },
    { 
      id: 'priority-asc', 
      label: 'Priorité (basse)', 
      icon: <FaSortAmountDown className="rotate-180" />,
      description: 'Trier par priorité (basse à haute)'
    }
  ];

  return (
    <div className="dropdown dropdown-end">
      <button tabIndex={0} className="btn btn-ghost btn-sm">
        <FaSortAmountDown className="mr-1" />
        Trier
      </button>
      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-60">
        <li className="menu-title">Trier les tâches</li>
        {sortOptions.map(option => (
          <li key={option.id}>
            <button 
              onClick={() => onSortChange(option.id)}
              className={currentSort === option.id ? 'active' : ''}
            >
              <span className="flex items-center">
                <span className="mr-2">{option.icon}</span>
                {option.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskSorting;