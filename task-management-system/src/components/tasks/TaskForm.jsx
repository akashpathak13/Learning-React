import React, { useState, useEffect } from 'react';
import { X, Plus, Save, Calendar, User, FileText } from 'lucide-react';
import { getAllEmployees } from '../../services/userService';

const TaskForm = ({ isOpen, onClose, onSubmit, task = null, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    assignedToName: '',
    priority: 'medium',
    dueDate: '',
    status: 'pending'
  });
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
      if (task) {
        setFormData({
          title: task.title || '',
          description: task.description || '',
          assignedTo: task.assignedTo || '',
          assignedToName: task.assignedToName || '',
          priority: task.priority || 'medium',
          dueDate: task.dueDate || '',
          status: task.status || 'pending'
        });
      } else {
        setFormData({
          title: '',
          description: '',
          assignedTo: '',
          assignedToName: '',
          priority: 'medium',
          dueDate: '',
          status: 'pending'
        });
      }
    }
  }, [isOpen, task]);

  const fetchEmployees = async () => {
    try {
      const employeeList = await getAllEmployees();
      setEmployees(employeeList);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update assignedToName when assignedTo changes
    if (name === 'assignedTo') {
      const selectedEmployee = employees.find(emp => emp.uid === value);
      setFormData(prev => ({
        ...prev,
        assignedToName: selectedEmployee ? selectedEmployee.name : ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {task ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Task Title *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="title"
                name="title"
                required
                className="input-field pl-10"
                placeholder="Enter task title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="input-field"
              placeholder="Enter task description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assign to Employee *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  id="assignedTo"
                  name="assignedTo"
                  required
                  className="input-field pl-10"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  disabled={loadingEmployees}
                >
                  <option value="">Select employee</option>
                  {employees.map((employee) => (
                    <option key={employee.uid} value={employee.uid}>
                      {employee.name} ({employee.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                className="input-field"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Due Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  className="input-field pl-10"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            {task && (
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="input-field"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  {task ? <Save className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  <span>{task ? 'Update Task' : 'Create Task'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;