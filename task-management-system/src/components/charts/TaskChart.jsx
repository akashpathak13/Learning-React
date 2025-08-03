import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const TaskChart = ({ tasks }) => {
  // Status distribution data
  const statusData = [
    {
      name: 'Completed',
      value: tasks.filter(task => task.status === 'completed').length,
      color: '#10b981'
    },
    {
      name: 'In Progress',
      value: tasks.filter(task => task.status === 'in-progress').length,
      color: '#f59e0b'
    },
    {
      name: 'Pending',
      value: tasks.filter(task => task.status === 'pending').length,
      color: '#6b7280'
    }
  ];

  // Tasks per employee data
  const employeeData = tasks.reduce((acc, task) => {
    const employeeName = task.assignedToName || 'Unassigned';
    const existing = acc.find(item => item.employee === employeeName);
    
    if (existing) {
      existing.total += 1;
      if (task.status === 'completed') existing.completed += 1;
      if (task.status === 'pending') existing.pending += 1;
      if (task.status === 'in-progress') existing.inProgress += 1;
    } else {
      acc.push({
        employee: employeeName,
        total: 1,
        completed: task.status === 'completed' ? 1 : 0,
        pending: task.status === 'pending' ? 1 : 0,
        inProgress: task.status === 'in-progress' ? 1 : 0
      });
    }
    
    return acc;
  }, []);

  // Priority distribution data
  const priorityData = [
    {
      name: 'High',
      value: tasks.filter(task => task.priority === 'high').length,
      color: '#ef4444'
    },
    {
      name: 'Medium',
      value: tasks.filter(task => task.priority === 'medium').length,
      color: '#f59e0b'
    },
    {
      name: 'Low',
      value: tasks.filter(task => task.priority === 'low').length,
      color: '#10b981'
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-900 dark:text-white font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-900 dark:text-white font-medium">{data.name}</p>
          <p style={{ color: data.payload.color }} className="text-sm">
            Count: {data.value}
          </p>
        </div>
      );
    }
    return null;
  };

  if (tasks.length === 0) {
    return (
      <div className="col-span-2 card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Task Analytics
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          No data available for charts
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Task Status Distribution */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Task Status Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<PieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Tasks per Employee */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tasks per Employee
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={employeeData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="employee" 
              tick={{ fontSize: 12, fill: 'currentColor' }}
              className="text-gray-600 dark:text-gray-400"
            />
            <YAxis 
              tick={{ fontSize: 12, fill: 'currentColor' }}
              className="text-gray-600 dark:text-gray-400"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" />
            <Bar dataKey="inProgress" stackId="a" fill="#f59e0b" name="In Progress" />
            <Bar dataKey="pending" stackId="a" fill="#6b7280" name="Pending" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Priority Distribution */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Priority Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={priorityData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {priorityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<PieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Trends */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Task Creation Trends
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={getWeeklyData(tasks)}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 12, fill: 'currentColor' }}
              className="text-gray-600 dark:text-gray-400"
            />
            <YAxis 
              tick={{ fontSize: 12, fill: 'currentColor' }}
              className="text-gray-600 dark:text-gray-400"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="tasks" fill="#3b82f6" name="Tasks Created" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

// Helper function to get weekly data
const getWeeklyData = (tasks) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekData = days.map(day => ({ day, tasks: 0 }));
  
  const now = new Date();
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay() + 1)); // Monday
  
  tasks.forEach(task => {
    if (task.createdAt && task.createdAt.toDate) {
      const taskDate = task.createdAt.toDate();
      const daysSinceWeekStart = Math.floor((taskDate - weekStart) / (1000 * 60 * 60 * 24));
      
      if (daysSinceWeekStart >= 0 && daysSinceWeekStart < 7) {
        weekData[daysSinceWeekStart].tasks += 1;
      }
    }
  });
  
  return weekData;
};

export default TaskChart;