# TaskFlow - Complete Task Management System

A modern, full-featured task management system built with React, Firebase, and AI integration. Features real-time updates, role-based access control, analytics dashboard, and intelligent chatbot assistance.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure login/signup with Firebase Auth
- **Role-Based Access**: Admin and Employee roles with different permissions
- **Real-Time Updates**: Live task updates using Firestore listeners
- **Task Management**: Create, assign, update, and delete tasks
- **Email Notifications**: Automated emails for task assignment and completion

### Admin Features
- **Task Creation & Assignment**: Assign tasks to employees
- **Analytics Dashboard**: Visual charts and statistics
- **Employee Management**: View all employees and their tasks
- **Task Overview**: Monitor all tasks across the organization

### Employee Features
- **Personal Dashboard**: View assigned tasks and progress
- **Task Completion**: Mark tasks as completed
- **Progress Tracking**: Personal completion rate and statistics
- **Due Date Alerts**: Highlights overdue and today's tasks

### AI Integration
- **Smart Chatbot**: Gemini AI-powered assistant
- **Task Context**: AI understands current task data
- **Quick Questions**: Pre-built queries for common requests
- **Real-Time Data**: Access to live task information

### Design & UX
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface
- **Accessibility**: WCAG compliant design

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Functions)
- **AI**: Google Gemini API
- **Charts**: Recharts
- **Icons**: Lucide React
- **Email**: Nodemailer with Gmail SMTP
- **Deployment**: Vercel (Frontend), Firebase (Backend)

## 📋 Prerequisites

- Node.js 18+ and npm
- Firebase account
- Google AI (Gemini) API key
- Gmail account with App Password

## 🔧 Installation & Setup

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd task-management-system
npm install
\`\`\`

### 2. Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Enable Functions (Blaze plan required for external API calls)

### 3. Environment Configuration
1. Copy \`.env.example\` to \`.env\`
2. Fill in your Firebase configuration:
   \`\`\`env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GEMINI_API_KEY=your_gemini_api_key
   \`\`\`

### 4. Gemini AI Setup
1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to your \`.env\` file

### 5. Gmail Setup for Notifications
1. Enable 2-Factor Authentication on Gmail
2. Generate App Password: Google Account > Security > App passwords
3. Configure in Firebase Functions:
   \`\`\`bash
   firebase functions:config:set gmail.user="your-email@gmail.com" gmail.password="your-app-password"
   \`\`\`

### 6. Deploy Firebase Services
\`\`\`bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Deploy Firestore rules and indexes
firebase deploy --only firestore

# Deploy Functions
cd functions
npm install
cd ..
firebase deploy --only functions
\`\`\`

### 7. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

## 🚀 Deployment

### Vercel Deployment (Frontend)
1. Install Vercel CLI: \`npm i -g vercel\`
2. Login: \`vercel login\`
3. Deploy: \`vercel\`
4. Add environment variables in Vercel dashboard
5. Set build command: \`npm run build\`
6. Set output directory: \`dist\`

### Firebase Deployment (Backend)
\`\`\`bash
# Deploy all Firebase services
firebase deploy

# Deploy specific services
firebase deploy --only firestore
firebase deploy --only functions
firebase deploy --only hosting
\`\`\`

## 📱 Usage

### First Setup
1. Create an admin account by signing up with role "Admin"
2. Create employee accounts or have employees sign up
3. Admin can start creating and assigning tasks

### Admin Workflow
1. **Dashboard**: View analytics and task overview
2. **Add Task**: Click "Add Task" button
3. **Assign**: Select employee and set details
4. **Monitor**: Track progress through charts
5. **Chat**: Use AI assistant for insights

### Employee Workflow
1. **Dashboard**: View assigned tasks
2. **Complete Tasks**: Mark tasks as done
3. **Progress**: Monitor completion rate
4. **Chat**: Ask AI about task status

## 🔒 Security

### Firebase Security Rules
- **Authentication Required**: All operations require login
- **Role-Based Access**: Admins and employees have different permissions
- **Data Isolation**: Employees only see their tasks
- **Input Validation**: Server-side data validation

### Best Practices
- Environment variables for sensitive data
- HTTPS enforcement
- Content Security Policy headers
- XSS protection

## 📧 Email Notifications

Automated emails are sent for:
- **Task Assignment**: Employee receives new task notification
- **Task Completion**: Admin receives completion notification
- **Task Deletion**: Employee receives closure notification

## 🤖 AI Chatbot Features

- **Contextual Responses**: Understands current task data
- **Quick Questions**: Pre-built queries for common requests
- **Real-Time Data**: Access to live task information
- **Role Awareness**: Different responses for admins vs employees

## 📊 Analytics & Charts

### Admin Dashboard
- Task status distribution (pie chart)
- Tasks per employee (bar chart)
- Priority distribution (pie chart)
- Weekly task creation trends

### Employee Dashboard
- Personal completion rate
- Tasks due today
- Progress tracking
- Performance metrics

## 🎨 Customization

### Themes
- Built-in light/dark mode toggle
- Tailwind CSS for easy styling
- CSS custom properties for theme variables

### Branding
- Update colors in \`tailwind.config.js\`
- Change app name in navigation
- Customize email templates in Functions

## 🐛 Troubleshooting

### Common Issues
1. **Firestore Permission Denied**: Check security rules
2. **Email Not Sending**: Verify Gmail app password
3. **AI Not Responding**: Check Gemini API key
4. **Build Errors**: Ensure all dependencies installed

### Development Tips
- Use Firebase emulators for local development
- Check browser console for errors
- Verify environment variables are loaded
- Test with different user roles

## 📚 API Documentation

### Task Object Structure
\`\`\`javascript
{
  id: string,
  title: string,
  description: string,
  assignedTo: string, // User UID
  assignedToName: string,
  priority: 'low' | 'medium' | 'high',
  status: 'pending' | 'in-progress' | 'completed',
  dueDate: string, // ISO date
  createdAt: Timestamp,
  updatedAt: Timestamp,
  completedAt?: Timestamp
}
\`\`\`

### User Object Structure
\`\`\`javascript
{
  uid: string,
  email: string,
  name: string,
  role: 'admin' | 'employee',
  createdAt: string
}
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: \`git checkout -b feature/new-feature\`
3. Commit changes: \`git commit -am 'Add new feature'\`
4. Push to branch: \`git push origin feature/new-feature\`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Gemini AI](https://ai.google.dev/)
- [Vercel Deployment](https://vercel.com/docs)

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review Firebase console for errors

---

**Built with ❤️ using modern web technologies**
