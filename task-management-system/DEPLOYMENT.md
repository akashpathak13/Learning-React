# TaskFlow Deployment Guide

This guide will help you deploy the TaskFlow application to production.

## 🚀 Quick Deployment Checklist

### Prerequisites
- [x] Firebase account
- [x] Gemini API key
- [x] Gmail account with App Password
- [x] Vercel account (for frontend)

## 1. Firebase Setup

### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `taskflow-production`
4. Enable Google Analytics (optional)

### Configure Authentication
1. Go to Authentication > Sign-in method
2. Enable "Email/Password"
3. Add authorized domains if needed

### Setup Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" (we'll deploy rules later)
4. Select location closest to your users

### Enable Functions
1. Go to Functions
2. Upgrade to Blaze plan (required for external APIs)

## 2. Get API Keys

### Firebase Configuration
1. Go to Project Settings > General
2. Scroll to "Your apps" section
3. Click "Add app" > Web
4. Register app and copy configuration

### Gemini AI Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create new API key
3. Copy the key for later use

### Gmail App Password
1. Enable 2-Factor Authentication on Gmail
2. Go to Google Account > Security > App passwords
3. Generate password for "Mail"
4. Copy the 16-character password

## 3. Environment Configuration

### Frontend (.env)
Create `.env` file in project root:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Firebase Functions
Configure email settings:
```bash
firebase functions:config:set gmail.user="admin@yourdomain.com"
firebase functions:config:set gmail.password="your_app_password"
firebase functions:config:set app.url="https://your-app.vercel.app"
```

## 4. Deploy Firebase Services

### Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Login and Initialize
```bash
firebase login
firebase init
```

Select:
- Firestore: Configure rules and indexes
- Functions: Configure Firebase Functions
- Hosting: Configure hosting (optional)

### Deploy Services
```bash
# Deploy Firestore rules and indexes
firebase deploy --only firestore

# Install function dependencies
cd functions
npm install
cd ..

# Deploy functions
firebase deploy --only functions
```

## 5. Deploy Frontend to Vercel

### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Deploy to production
vercel --prod
```

### Option B: GitHub Integration
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Vercel Environment Variables
Add these in Vercel dashboard:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_GEMINI_API_KEY`

## 6. Post-Deployment Setup

### Create Admin Account
1. Visit your deployed app
2. Sign up with admin role
3. Verify email works correctly

### Test Email Notifications
1. Create a test employee account
2. Assign a task as admin
3. Verify email notification is sent
4. Complete task as employee
5. Verify completion email to admin

### Security Configuration
1. Update Firebase Auth authorized domains
2. Configure CORS if needed
3. Review Firestore security rules

## 7. Domain Configuration (Optional)

### Custom Domain on Vercel
1. Go to Vercel dashboard > Domains
2. Add your custom domain
3. Configure DNS settings
4. Update Firebase authorized domains

### Update Function Configuration
```bash
firebase functions:config:set app.url="https://yourdomain.com"
firebase deploy --only functions
```

## 🔧 Environment-Specific Configurations

### Development
```bash
# Use Firebase emulators
firebase emulators:start

# Run dev server
npm run dev
```

### Staging
```bash
# Deploy to staging environment
vercel --env staging
```

### Production
```bash
# Deploy to production
vercel --prod
```

## 📊 Monitoring & Maintenance

### Firebase Console Monitoring
- Check function logs for errors
- Monitor Firestore usage
- Review authentication metrics

### Vercel Analytics
- Monitor deployment status
- Check performance metrics
- Review error logs

### Regular Maintenance
- Update dependencies monthly
- Monitor API usage limits
- Review security rules quarterly
- Backup Firestore data regularly

## 🚨 Troubleshooting

### Common Issues

#### Email Not Sending
- Verify Gmail app password
- Check Firebase function logs
- Ensure Blaze plan is active

#### Firestore Permission Denied
- Review security rules
- Check user authentication
- Verify role assignments

#### Build Failures
- Clear node_modules and reinstall
- Check environment variables
- Review dependency versions

#### Function Deployment Issues
- Ensure Node.js 18+ in functions
- Check function configuration
- Review IAM permissions

### Getting Help
- Check Firebase console logs
- Review Vercel deployment logs
- Search GitHub issues
- Contact support channels

## 📋 Deployment Checklist

- [ ] Firebase project created
- [ ] Authentication enabled
- [ ] Firestore database created
- [ ] Functions enabled (Blaze plan)
- [ ] API keys obtained
- [ ] Environment variables configured
- [ ] Firebase services deployed
- [ ] Frontend deployed to Vercel
- [ ] Domain configured (if applicable)
- [ ] Admin account created
- [ ] Email notifications tested
- [ ] Security rules reviewed
- [ ] Monitoring configured

## 🎉 Success!

Your TaskFlow application is now live and ready for use! 

**Next Steps:**
1. Create user accounts for your team
2. Start creating and assigning tasks
3. Monitor system performance
4. Gather user feedback for improvements

---

**Support:** If you encounter issues, refer to the main README.md or create an issue in the repository.