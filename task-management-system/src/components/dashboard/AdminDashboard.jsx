import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import TaskForm from '../tasks/TaskForm';
import TaskCard from '../tasks/TaskCard';
import TaskChart from '../charts/TaskChart';
import { 
  addTask, 
  updateTask, 
  deleteTask, 
  completeTask, 
  subscribeToAllTasks 
} from '../../services/taskService';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tasksLoading, setTasksLoading] = useState(true);
  const { userRole } = useAuth();

  useEffect(() => {
    // Subscribe to real-time task updates
    const unsubscribe = subscribeToAllTasks((tasksData) => {
      setTasks(tasksData);
      setTasksLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddTask = async (taskData) => {
    setLoading(true);
    try {
      await addTask(taskData);
      setIsTaskFormOpen(false);
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = async (taskData) => {
    setLoading(true);
    try {
      await updateTask(editingTask.id, taskData);
      setIsTaskFormOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
      }
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await completeTask(taskId);
    } catch (error) {
      console.error('Error completing task:', error);
      alert('Failed to complete task. Please try again.');
    }
  };

  const openEditForm = (task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const closeForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(null);
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
      title: 'In Progress',
      value: inProgressTasks,
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

  if (tasksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage tasks and monitor team performance
          </p>
        </div>
        <button
          onClick={() => setIsTaskFormOpen(true)}
          className="btn-primary mt-4 sm:mt-0 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Task</span>
        </button>
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TaskChart tasks={tasks} />
      </div>

      {/* Tasks List */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            All Tasks
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {totalTasks} total tasks
          </span>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No tasks yet
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating a new task for your team.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setIsTaskFormOpen(true)}
                className="btn-primary flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-5 w-5" />
                <span>Add Task</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEditForm}
                onDelete={handleDeleteTask}
                onComplete={handleCompleteTask}
                userRole={userRole}
              />
            ))}
          </div>
        )}
      </div>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={closeForm}
        onSubmit={editingTask ? handleEditTask : handleAddTask}
        task={editingTask}
        loading={loading}
      />
    </div>
  );
};

export default AdminDashboard;