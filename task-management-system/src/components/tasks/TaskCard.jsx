import React from 'react';
import { 
  Calendar, 
  User, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Flag
} from 'lucide-react';
import { cn } from '../../utils/cn';

const TaskCard = ({ 
  task, 
  onEdit, 
  onDelete, 
  onComplete, 
  userRole,
  isUserTask = false 
}) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'in-progress':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 'pending':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
  const canComplete = task.status !== 'completed' && (isUserTask || userRole === 'admin');
  const canEdit = userRole === 'admin';
  const canDelete = userRole === 'admin';

  return (
    <div className={cn(
      "card p-6 transition-all duration-200 hover:shadow-lg",
      isOverdue && "border-l-4 border-red-500"
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
              {task.description}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <span className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
            getPriorityColor(task.priority)
          )}>
            <Flag className="h-3 w-3 mr-1" />
            {task.priority}
          </span>
          <span className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
            getStatusColor(task.status)
          )}>
            {task.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
            {task.status === 'in-progress' && <Clock className="h-3 w-3 mr-1" />}
            {task.status === 'pending' && <AlertCircle className="h-3 w-3 mr-1" />}
            {task.status.replace('-', ' ')}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-500 dark:text-gray-400">
          {task.assignedToName && (
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{task.assignedToName}</span>
            </div>
          )}
          {task.dueDate && (
            <div className={cn(
              "flex items-center",
              isOverdue && "text-red-600 dark:text-red-400 font-medium"
            )}>
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                Due: {new Date(task.dueDate).toLocaleDateString()}
                {isOverdue && ' (Overdue)'}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {canComplete && (
            <button
              onClick={() => onComplete(task.id)}
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
              title="Mark as completed"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Complete
            </button>
          )}
          {canEdit && (
            <button
              onClick={() => onEdit(task)}
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              title="Edit task"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
              title="Delete task"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;