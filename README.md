# MyRepData Medical Sales CRM

A comprehensive, mobile-first Medical Sales CRM system with Firebase backend and TrayTracker integration for managing physicians, facilities, surgical cases, and tray tracking.

## 🏥 **Features**

### **📱 Mobile-First Design**
- Responsive interface optimized for smartphones and tablets
- Bottom navigation for easy mobile access
- Touch-friendly interface with professional medical design
- Offline capability with local data caching

### **👨‍⚕️ Physician Management**
- Complete physician profiles with NPI, specialty, and contact information
- Individual tray preferences per physician per procedure type
- Comprehensive case history tracking and analytics
- Performance metrics and success rate monitoring

### **🏥 Facility Management**
- Support for Hospitals, ASCs (Ambulatory Surgery Centers), and OBLs (Office-Based Labs)
- Detailed facility information with editing capabilities
- Territory management and geographic organization
- Bulk upload functionality for large datasets

### **📅 Cases Module**
- **Calendar View**: Visual scheduling interface with drag-and-drop
- **List View**: Comprehensive case management with advanced filtering
- **Case Scheduling**: Schedule case types with treating physicians at designated facilities
- **Real-time Status**: Live tracking of case preparation and tray availability
- **Patient Management**: Complete patient information and case notes

### **🧰 Enhanced TrayTracker Integration**
- **Case Type-Based Requirements**: Automatic tray assignment by procedure type
- **Real-time Availability**: Live tray status across all facilities
- **Physician Preferences**: Individual tray preferences override defaults
- **Reservation System**: Automatic tray reservation for scheduled cases
- **Utilization Analytics**: Comprehensive tray usage reporting

### **📊 Analytics & Reporting**
- Physician performance metrics and case statistics
- Facility utilization and case volume tracking
- Tray usage analytics and optimization insights
- Real-time dashboard with key performance indicators

## 🚀 **Technology Stack**

### **Frontend**
- **React 18** with Vite for fast development and building
- **Firebase SDK** for real-time database and authentication
- **Tailwind CSS** for responsive, mobile-first styling
- **Lucide React** for consistent iconography
- **React Query** for efficient data fetching and caching

### **Backend**
- **Firebase Firestore** for scalable NoSQL database
- **Firebase Authentication** for secure user management
- **Firebase Storage** for file uploads and document management
- **Firebase Functions** for serverless backend logic
- **Firebase Hosting** for fast, global content delivery

### **Integrations**
- **TrayTracker API** for real-time tray status and management
- **Calendar APIs** (Google, Apple, Outlook) for appointment scheduling
- **CSV/Excel Import** for bulk data uploads

## 📁 **Project Structure**

```
medical-crm-firebase/
├── src/
│   ├── components/           # React components
│   │   ├── CasesModule.jsx          # Complete case management
│   │   ├── PhysicianManagement.jsx  # Physician profiles and history
│   │   ├── FacilityManagement.jsx   # Facility database management
│   │   └── TrayTracker.jsx          # TrayTracker integration
│   ├── services/            # Firebase service layer
│   │   ├── firebaseService.js       # Core Firebase operations
│   │   ├── trayTrackerService.js    # TrayTracker API integration
│   │   └── authService.js           # Authentication management
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   └── firebase-config.js   # Firebase configuration
├── functions/               # Firebase Cloud Functions
├── firestore.rules         # Firestore security rules
├── storage.rules           # Storage security rules
├── firebase.json           # Firebase project configuration
└── package.json            # Dependencies and scripts
```

## 🛠 **Setup & Installation**

### **Prerequisites**
- Node.js 18+ and npm
- Firebase CLI (`npm install -g firebase-tools`)
- Git for version control

### **Local Development**

1. **Clone the repository**
   ```bash
   git clone https://github.com/MyRepData/medical-sales-crm.git
   cd medical-sales-crm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   ```bash
   firebase login
   firebase init
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Firebase configuration
   ```

5. **Start development server with emulators**
   ```bash
   npm run firebase:emulators
   npm run dev
   ```

### **Environment Variables**

Create a `.env.local` file with your Firebase configuration:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=myrepdata-crm.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=myrepdata-crm
REACT_APP_FIREBASE_STORAGE_BUCKET=myrepdata-crm.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# TrayTracker Integration
REACT_APP_TRAYTRACKER_API_URL=https://api.traytracker.com/v1
REACT_APP_TRAYTRACKER_API_KEY=your_traytracker_api_key
```

## 🚀 **Deployment**

### **Firebase Hosting**

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**
   ```bash
   npm run firebase:deploy
   ```

3. **Deploy specific services**
   ```bash
   npm run firebase:deploy:hosting    # Frontend only
   npm run firebase:deploy:firestore  # Database rules only
   npm run firebase:deploy:functions  # Cloud Functions only
   ```

### **Custom Domain**

Configure your custom domain in the Firebase Console:
1. Go to Hosting section
2. Add custom domain
3. Follow DNS configuration instructions

## 📊 **Database Schema**

### **Collections**

#### **physicians**
```javascript
{
  id: "physician_id",
  name: "Dr. John Smith",
  npi: "1234567890",
  specialty: "Ortho Spine",
  email: "john.smith@example.com",
  phone: "+1-555-0123",
  territory: "Milwaukee",
  account_owner: "Eric Swick",
  created_at: timestamp,
  updated_at: timestamp
}
```

#### **facilities**
```javascript
{
  id: "facility_id",
  name: "Advanced Spine Center",
  type: "ASC", // ASC, Hospital, OBL
  specialty: "Ortho Spine",
  address: "123 Medical Drive",
  city: "Milwaukee",
  state: "WI",
  zip: "53201",
  phone: "+1-555-0456",
  territory: "Milwaukee",
  created_at: timestamp,
  updated_at: timestamp
}
```

#### **surgical_cases**
```javascript
{
  id: "case_id",
  case_type: "L4-L5 Fusion",
  procedure_name: "L4-L5 Posterior Spinal Fusion",
  physician_id: "physician_id",
  facility_id: "facility_id",
  date: "2024-09-02",
  time: "08:00 AM",
  duration: 180,
  patient_name: "John Doe",
  patient_age: 45,
  status: "confirmed", // scheduled, confirmed, pending, cancelled, completed
  tray_requirements: [
    {
      tray_id: "SPINE-001",
      requirement_type: "required", // required, preferred, optional
      notes: "Primary tray for all L4-L5 cases"
    }
  ],
  tray_status: "ready", // ready, partial, missing
  created_at: timestamp,
  updated_at: timestamp
}
```

#### **physician_preferences**
```javascript
{
  id: "preference_id",
  physician_id: "physician_id",
  case_type: "L4-L5 Fusion",
  tray_id: "SPINE-001",
  requirement_type: "required",
  notes: "Physician preference override",
  created_at: timestamp,
  updated_at: timestamp
}
```

#### **tray_tracking**
```javascript
{
  id: "tray_id",
  tray_name: "SI Bone Fusion Tray A",
  facility_id: "facility_id",
  status: "available", // available, in_use, cleaning, maintenance, missing
  location: "OR 3",
  last_updated: timestamp,
  next_case_id: "case_id" // if reserved
}
```

## 🔧 **API Integration**

### **TrayTracker API**

The system integrates with TrayTracker for real-time tray management:

```javascript
// Example: Get tray availability
const availability = await trayTrackingService.getTrayAvailabilityForCase(caseId);

// Example: Update tray status
await trayTrackingService.updateTrayAvailability(facilityId, [
  { tray_id: "SPINE-001", status: "in_use", location: "OR 2" }
]);
```

### **Calendar Integration**

Multi-calendar support for appointment scheduling:

```javascript
// Example: Add case to calendar
const calendarEvent = {
  title: `${caseData.case_type} - ${caseData.patient_name}`,
  start: new Date(caseData.date + ' ' + caseData.time),
  duration: caseData.duration,
  location: caseData.facility_name
};

await calendarService.addEvent(calendarEvent, selectedCalendars);
```

## 🔒 **Security**

### **Authentication**
- Firebase Authentication with email/password and SSO options
- Role-based access control (Admin, Manager, Rep)
- Secure token-based API access

### **Data Protection**
- Firestore security rules for data access control
- HIPAA-compliant data handling practices
- Encrypted data transmission and storage
- Regular security audits and updates

### **Privacy**
- Patient data anonymization options
- Audit trails for all data access and modifications
- Compliance with healthcare data regulations

## 📱 **Mobile Features**

### **Progressive Web App (PWA)**
- Installable on mobile devices
- Offline functionality with data synchronization
- Push notifications for case updates
- Background sync for real-time updates

### **Mobile Optimizations**
- Touch-friendly interface with minimum 44px touch targets
- Bottom navigation for easy thumb access
- Swipe gestures for natural mobile interactions
- Responsive design for all screen sizes

## 🧪 **Testing**

### **Run Tests**
```bash
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Generate coverage report
```

### **Firebase Emulators**
```bash
npm run firebase:emulators  # Start all emulators
```

Access emulator UI at `http://localhost:4000`

## 📈 **Performance**

### **Optimization Features**
- Code splitting for faster initial load
- Image optimization and lazy loading
- Firebase caching for offline support
- Efficient data fetching with React Query
- Bundle size optimization with tree shaking

### **Monitoring**
- Firebase Performance Monitoring
- Real User Monitoring (RUM)
- Error tracking with Firebase Crashlytics
- Analytics with Firebase Analytics

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow React best practices and hooks patterns
- Use TypeScript for type safety
- Write tests for new features
- Follow the existing code style and formatting
- Update documentation for new features

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 **Support**

For support and questions:
- **Documentation**: [Wiki](https://github.com/MyRepData/medical-sales-crm/wiki)
- **Issues**: [GitHub Issues](https://github.com/MyRepData/medical-sales-crm/issues)
- **Discussions**: [GitHub Discussions](https://github.com/MyRepData/medical-sales-crm/discussions)

## 🎯 **Roadmap**

### **Upcoming Features**
- [ ] Advanced analytics dashboard
- [ ] Machine learning for case outcome prediction
- [ ] Integration with additional medical device APIs
- [ ] Enhanced reporting and export capabilities
- [ ] Multi-language support
- [ ] Advanced search with Elasticsearch integration

### **Version History**
- **v1.0.0** - Initial release with core CRM functionality
- **v1.1.0** - Enhanced TrayTracker integration
- **v1.2.0** - Cases module with calendar and list views
- **v1.3.0** - Firebase migration and real-time features

---

**Built with ❤️ by the MyRepData team for the medical device sales community.**

