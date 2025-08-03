const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configure email transporter
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: functions.config().gmail?.user || process.env.GMAIL_USER,
    pass: functions.config().gmail?.password || process.env.GMAIL_APP_PASSWORD,
  },
});

// Function to send email notifications when a task is created
exports.sendTaskAssignmentEmail = functions.firestore
  .document('tasks/{taskId}')
  .onCreate(async (snap, context) => {
    const taskData = snap.data();
    const taskId = context.params.taskId;

    try {
      // Get employee details
      const employeeDoc = await admin.firestore()
        .collection('users')
        .doc(taskData.assignedTo)
        .get();

      if (!employeeDoc.exists) {
        console.error('Employee not found:', taskData.assignedTo);
        return;
      }

      const employee = employeeDoc.data();
      
      // Get admin details (task creator)
      const adminQuery = await admin.firestore()
        .collection('users')
        .where('role', '==', 'admin')
        .limit(1)
        .get();

      if (adminQuery.empty) {
        console.error('No admin found');
        return;
      }

      const adminData = adminQuery.docs[0].data();

      // Email content
      const mailOptions = {
        from: `"TaskFlow Admin" <${functions.config().gmail?.user || process.env.GMAIL_USER}>`,
        to: employee.email,
        subject: `New Task Assigned: ${taskData.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #3b82f6; color: white; padding: 20px; text-align: center;">
              <h1>TaskFlow</h1>
              <h2>New Task Assigned</h2>
            </div>
            
            <div style="padding: 20px; background-color: #f9fafb;">
              <h3>Hello ${employee.name},</h3>
              <p>You have been assigned a new task:</p>
              
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #3b82f6; margin-top: 0;">${taskData.title}</h4>
                ${taskData.description ? `<p><strong>Description:</strong> ${taskData.description}</p>` : ''}
                <p><strong>Priority:</strong> <span style="color: ${
                  taskData.priority === 'high' ? '#ef4444' : 
                  taskData.priority === 'medium' ? '#f59e0b' : '#10b981'
                }; text-transform: capitalize;">${taskData.priority}</span></p>
                ${taskData.dueDate ? `<p><strong>Due Date:</strong> ${new Date(taskData.dueDate).toLocaleDateString()}</p>` : ''}
                <p><strong>Status:</strong> ${taskData.status}</p>
              </div>
              
              <p>Please log in to your TaskFlow dashboard to view and manage this task.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${functions.config().app?.url || 'https://your-app-url.vercel.app'}/dashboard" 
                   style="background-color: #3b82f6; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 6px; display: inline-block;">
                  View Dashboard
                </a>
              </div>
              
              <p>Best regards,<br>TaskFlow Team</p>
            </div>
            
            <div style="background-color: #374151; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px;">
              <p>This is an automated message from TaskFlow. Please do not reply to this email.</p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log('Task assignment email sent successfully to:', employee.email);
      
    } catch (error) {
      console.error('Error sending task assignment email:', error);
    }
  });

// Function to send email notifications when a task is completed or closed
exports.sendTaskCompletionEmail = functions.firestore
  .document('tasks/{taskId}')
  .onUpdate(async (change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();
    const taskId = context.params.taskId;

    // Check if task status changed to completed
    if (beforeData.status !== 'completed' && afterData.status === 'completed') {
      try {
        // Get employee details
        const employeeDoc = await admin.firestore()
          .collection('users')
          .doc(afterData.assignedTo)
          .get();

        // Get admin details
        const adminQuery = await admin.firestore()
          .collection('users')
          .where('role', '==', 'admin')
          .limit(1)
          .get();

        if (employeeDoc.exists && !adminQuery.empty) {
          const employee = employeeDoc.data();
          const adminData = adminQuery.docs[0].data();

          // Send completion notification to admin
          const adminMailOptions = {
            from: `"TaskFlow System" <${functions.config().gmail?.user || process.env.GMAIL_USER}>`,
            to: adminData.email,
            subject: `Task Completed: ${afterData.title}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #10b981; color: white; padding: 20px; text-align: center;">
                  <h1>TaskFlow</h1>
                  <h2>Task Completed</h2>
                </div>
                
                <div style="padding: 20px; background-color: #f9fafb;">
                  <h3>Hello ${adminData.name},</h3>
                  <p><strong>${employee.name}</strong> has completed the following task:</p>
                  
                  <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h4 style="color: #10b981; margin-top: 0;">${afterData.title}</h4>
                    ${afterData.description ? `<p><strong>Description:</strong> ${afterData.description}</p>` : ''}
                    <p><strong>Assigned to:</strong> ${employee.name}</p>
                    <p><strong>Completed on:</strong> ${new Date().toLocaleDateString()}</p>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${functions.config().app?.url || 'https://your-app-url.vercel.app'}/dashboard" 
                       style="background-color: #10b981; color: white; padding: 12px 24px; 
                              text-decoration: none; border-radius: 6px; display: inline-block;">
                      View Dashboard
                    </a>
                  </div>
                  
                  <p>Best regards,<br>TaskFlow System</p>
                </div>
              </div>
            `,
          };

          await transporter.sendMail(adminMailOptions);
          console.log('Task completion email sent to admin:', adminData.email);
        }
        
      } catch (error) {
        console.error('Error sending task completion email:', error);
      }
    }
  });

// Function to send email notifications when a task is deleted
exports.sendTaskDeletionEmail = functions.firestore
  .document('tasks/{taskId}')
  .onDelete(async (snap, context) => {
    const taskData = snap.data();
    const taskId = context.params.taskId;

    try {
      // Get employee details
      const employeeDoc = await admin.firestore()
        .collection('users')
        .doc(taskData.assignedTo)
        .get();

      if (!employeeDoc.exists) {
        console.error('Employee not found:', taskData.assignedTo);
        return;
      }

      const employee = employeeDoc.data();

      // Email content
      const mailOptions = {
        from: `"TaskFlow Admin" <${functions.config().gmail?.user || process.env.GMAIL_USER}>`,
        to: employee.email,
        subject: `Task Closed: ${taskData.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #ef4444; color: white; padding: 20px; text-align: center;">
              <h1>TaskFlow</h1>
              <h2>Task Closed</h2>
            </div>
            
            <div style="padding: 20px; background-color: #f9fafb;">
              <h3>Hello ${employee.name},</h3>
              <p>The following task has been closed:</p>
              
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #ef4444; margin-top: 0;">${taskData.title}</h4>
                ${taskData.description ? `<p><strong>Description:</strong> ${taskData.description}</p>` : ''}
                <p><strong>Status:</strong> Closed</p>
                <p><strong>Closed on:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              
              <p>If you have any questions about this task closure, please contact your administrator.</p>
              
              <p>Best regards,<br>TaskFlow Team</p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log('Task deletion email sent successfully to:', employee.email);
      
    } catch (error) {
      console.error('Error sending task deletion email:', error);
    }
  });