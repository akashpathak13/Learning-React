import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const initializeGemini = () => {
  return genAI.getGenerativeModel({ model: 'gemini-pro' });
};

export const generateResponse = async (prompt, context = '') => {
  try {
    const model = initializeGemini();
    
    const systemPrompt = `You are a helpful task management assistant. You help both employees and administrators with their task-related queries. 
    
    Context: ${context}
    
    You can help with:
    - Providing information about tasks (pending, completed, assigned)
    - Explaining task management features
    - General assistance with the task management system
    - Answering questions about task status and progress
    
    Keep responses concise and helpful. If you need specific data that isn't provided in the context, mention that the user should check their dashboard for real-time information.`;
    
    const fullPrompt = `${systemPrompt}\n\nUser Question: ${prompt}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error('Failed to generate response. Please try again.');
  }
};

export const generateTaskContext = (tasks, userRole) => {
  if (!tasks || tasks.length === 0) {
    return 'No tasks available.';
  }
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;
  
  let context = `Current task summary:
  - Total tasks: ${totalTasks}
  - Completed tasks: ${completedTasks}
  - Pending tasks: ${pendingTasks}`;
  
  if (userRole === 'admin') {
    const tasksByEmployee = tasks.reduce((acc, task) => {
      const employee = task.assignedToName || 'Unassigned';
      acc[employee] = (acc[employee] || 0) + 1;
      return acc;
    }, {});
    
    context += `\n  - Tasks by employee: ${Object.entries(tasksByEmployee)
      .map(([employee, count]) => `${employee} (${count})`)
      .join(', ')}`;
  }
  
  return context;
};