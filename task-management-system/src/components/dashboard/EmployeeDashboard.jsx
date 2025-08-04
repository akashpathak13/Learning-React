import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Calendar,
  User,
  TrendingUp
} from 'lucide-react';
import TaskCard from '../tasks/TaskCard';
import { subscribeToUserTasks, completeTask } from '../../services/taskService';
import { useAuth } from '../../contexts/AuthContext';

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, userRole } = useAuth();

  useEffect(() => {
    if (currentUser) {
      // Subscribe to real-time task updates for the current user
      const unsubscribe = subscribeToUserTasks(currentUser.uid, (tasksData) => {
        setTasks(tasksData);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  const handleCompleteTask = async (taskId) => {
    try {
      await completeTask(taskId);
    } catch (error) {
      console.error('Error completing task:', error);
      alert('Failed to complete task. Please try again.');
    }
  };

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const overdueTasks = tasks.filter(task => 
    task.dueDate && 
    new Date(task.dueDate) < new Date() && 
    task.status !== 'completed'
  ).length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: TrendingUp,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30'
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-100 dark:bg-green-900/30'
    },
    {
      title: 'Pending',
      value: pendingTasks,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
    },
    {
      title: 'Overdue',
      value: overdueTasks,
      icon: AlertTriangle,
      color: 'text-red-600 bg-red-100 dark:bg-red-900/30'
    }
  ];

  // Get tasks due today
  const today = new Date().toDateString();
  const tasksDueToday = tasks.filter(task => 
    task.dueDate && 
    new Date(task.dueDate).toDateString() === today &&
    task.status !== 'completed'
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {currentUser?.displayName || 'Employee'}!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Here are your assigned tasks and progress overview
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="card p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Completion Rate */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Completion Rate
          </h3>
          <div className="flex items-center">
            <div className="flex-1">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Progress</span>
                <span>{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
            <div className="ml-4 text-2xl font-bold text-primary-600">
              {completionRate}%
            </div>
          </div>
        </div>

        {/* Tasks Due Today */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Due Today
          </h3>
          {tasksDueToday.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No tasks due today</p>
          ) : (
            <div className="space-y-2">
              {tasksDueToday.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-sm text-gray-900 dark:text-white truncate">
                    {task.title}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    task.priority === 'high' 
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                      : task.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
              {tasksDueToday.length > 3 && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  +{tasksDueToday.length - 3} more tasks due today
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tasks List */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            My Tasks
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {totalTasks} total tasks
          </span>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No tasks assigned
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              You don't have any tasks assigned to you yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={handleCompleteTask}
                userRole={userRole}
                isUserTask={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;