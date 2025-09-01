// Firebase Service Layer for Medical Sales CRM
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase-config';

// Collection names
const COLLECTIONS = {
  PHYSICIANS: 'physicians',
  FACILITIES: 'facilities',
  CONTACTS: 'contacts',
  SURGICAL_CASES: 'surgical_cases',
  TRAY_REQUIREMENTS: 'tray_requirements',
  PHYSICIAN_PREFERENCES: 'physician_preferences',
  ACTIVITIES: 'activities',
  APPOINTMENTS: 'appointments',
  TRAY_TRACKING: 'tray_tracking'
};

// Generic CRUD operations
class FirebaseService {
  // Create document
  async create(collectionName, data) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error);
      throw error;
    }
  }

  // Read document by ID
  async getById(collectionName, id) {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error getting document from ${collectionName}:`, error);
      throw error;
    }
  }

  // Read all documents
  async getAll(collectionName, orderByField = 'created_at') {
    try {
      const q = query(collection(db, collectionName), orderBy(orderByField, 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error getting documents from ${collectionName}:`, error);
      throw error;
    }
  }

  // Update document
  async update(collectionName, id, data) {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updated_at: serverTimestamp()
      });
      return { id, ...data };
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error);
      throw error;
    }
  }

  // Delete document
  async delete(collectionName, id) {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error);
      throw error;
    }
  }

  // Query with conditions
  async query(collectionName, conditions = [], orderByField = 'created_at', limitCount = null) {
    try {
      let q = collection(db, collectionName);
      
      // Add where conditions
      conditions.forEach(condition => {
        q = query(q, where(condition.field, condition.operator, condition.value));
      });
      
      // Add ordering
      q = query(q, orderBy(orderByField, 'desc'));
      
      // Add limit
      if (limitCount) {
        q = query(q, limit(limitCount));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error querying ${collectionName}:`, error);
      throw error;
    }
  }

  // Real-time listener
  onSnapshot(collectionName, callback, conditions = []) {
    try {
      let q = collection(db, collectionName);
      
      conditions.forEach(condition => {
        q = query(q, where(condition.field, condition.operator, condition.value));
      });
      
      return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(data);
      });
    } catch (error) {
      console.error(`Error setting up listener for ${collectionName}:`, error);
      throw error;
    }
  }

  // Batch operations
  async batchWrite(operations) {
    try {
      const batch = writeBatch(db);
      
      operations.forEach(operation => {
        const { type, collectionName, id, data } = operation;
        const docRef = id ? doc(db, collectionName, id) : doc(collection(db, collectionName));
        
        switch (type) {
          case 'create':
            batch.set(docRef, {
              ...data,
              created_at: serverTimestamp(),
              updated_at: serverTimestamp()
            });
            break;
          case 'update':
            batch.update(docRef, {
              ...data,
              updated_at: serverTimestamp()
            });
            break;
          case 'delete':
            batch.delete(docRef);
            break;
        }
      });
      
      await batch.commit();
      return true;
    } catch (error) {
      console.error('Error in batch operation:', error);
      throw error;
    }
  }
}

// Specific service classes for each entity
class PhysicianService extends FirebaseService {
  constructor() {
    super();
    this.collection = COLLECTIONS.PHYSICIANS;
  }

  async getPhysicianWithCases(physicianId) {
    try {
      const physician = await this.getById(this.collection, physicianId);
      if (!physician) return null;

      // Get physician's cases
      const cases = await this.query(COLLECTIONS.SURGICAL_CASES, [
        { field: 'physician_id', operator: '==', value: physicianId }
      ]);

      // Get physician's tray preferences
      const preferences = await this.query(COLLECTIONS.PHYSICIAN_PREFERENCES, [
        { field: 'physician_id', operator: '==', value: physicianId }
      ]);

      return {
        ...physician,
        cases,
        tray_preferences: preferences
      };
    } catch (error) {
      console.error('Error getting physician with cases:', error);
      throw error;
    }
  }

  async updateTrayPreferences(physicianId, preferences) {
    try {
      const operations = preferences.map(pref => ({
        type: 'create',
        collectionName: COLLECTIONS.PHYSICIAN_PREFERENCES,
        data: {
          physician_id: physicianId,
          ...pref
        }
      }));

      // Delete existing preferences first
      const existingPrefs = await this.query(COLLECTIONS.PHYSICIAN_PREFERENCES, [
        { field: 'physician_id', operator: '==', value: physicianId }
      ]);

      const deleteOps = existingPrefs.map(pref => ({
        type: 'delete',
        collectionName: COLLECTIONS.PHYSICIAN_PREFERENCES,
        id: pref.id
      }));

      await this.batchWrite([...deleteOps, ...operations]);
      return true;
    } catch (error) {
      console.error('Error updating tray preferences:', error);
      throw error;
    }
  }
}

class FacilityService extends FirebaseService {
  constructor() {
    super();
    this.collection = COLLECTIONS.FACILITIES;
  }

  async getFacilityWithCases(facilityId) {
    try {
      const facility = await this.getById(this.collection, facilityId);
      if (!facility) return null;

      const cases = await this.query(COLLECTIONS.SURGICAL_CASES, [
        { field: 'facility_id', operator: '==', value: facilityId }
      ]);

      return {
        ...facility,
        cases
      };
    } catch (error) {
      console.error('Error getting facility with cases:', error);
      throw error;
    }
  }

  async searchFacilities(searchTerm, filters = {}) {
    try {
      let conditions = [];
      
      if (filters.type) {
        conditions.push({ field: 'type', operator: '==', value: filters.type });
      }
      
      if (filters.specialty) {
        conditions.push({ field: 'specialty', operator: '==', value: filters.specialty });
      }
      
      if (filters.territory) {
        conditions.push({ field: 'territory', operator: '==', value: filters.territory });
      }

      const facilities = await this.query(this.collection, conditions);
      
      // Client-side text search (Firestore doesn't support full-text search)
      if (searchTerm) {
        return facilities.filter(facility => 
          facility.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          facility.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          facility.state?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      return facilities;
    } catch (error) {
      console.error('Error searching facilities:', error);
      throw error;
    }
  }
}

class SurgicalCaseService extends FirebaseService {
  constructor() {
    super();
    this.collection = COLLECTIONS.SURGICAL_CASES;
  }

  async scheduleCase(caseData) {
    try {
      // Get default tray requirements for case type
      const trayRequirements = await this.query(COLLECTIONS.TRAY_REQUIREMENTS, [
        { field: 'case_type', operator: '==', value: caseData.case_type }
      ]);

      // Get physician preferences
      const physicianPrefs = await this.query(COLLECTIONS.PHYSICIAN_PREFERENCES, [
        { field: 'physician_id', operator: '==', value: caseData.physician_id },
        { field: 'case_type', operator: '==', value: caseData.case_type }
      ]);

      // Merge requirements with preferences
      const finalTrayRequirements = this.mergeTrayRequirements(trayRequirements, physicianPrefs);

      const scheduledCase = await this.create(this.collection, {
        ...caseData,
        tray_requirements: finalTrayRequirements,
        status: 'scheduled',
        tray_status: 'pending'
      });

      // Create activity log
      await this.create(COLLECTIONS.ACTIVITIES, {
        type: 'case_scheduled',
        case_id: scheduledCase.id,
        physician_id: caseData.physician_id,
        facility_id: caseData.facility_id,
        description: `Case scheduled: ${caseData.case_type} at ${caseData.facility_name}`,
        user_id: caseData.user_id || 'system'
      });

      return scheduledCase;
    } catch (error) {
      console.error('Error scheduling case:', error);
      throw error;
    }
  }

  mergeTrayRequirements(defaults, preferences) {
    // Logic to merge default requirements with physician preferences
    const merged = [...defaults];
    
    preferences.forEach(pref => {
      const existingIndex = merged.findIndex(req => req.tray_id === pref.tray_id);
      if (existingIndex >= 0) {
        merged[existingIndex] = { ...merged[existingIndex], ...pref };
      } else {
        merged.push(pref);
      }
    });
    
    return merged;
  }

  async getCasesByDateRange(startDate, endDate, filters = {}) {
    try {
      let conditions = [
        { field: 'date', operator: '>=', value: startDate },
        { field: 'date', operator: '<=', value: endDate }
      ];

      if (filters.physician_id) {
        conditions.push({ field: 'physician_id', operator: '==', value: filters.physician_id });
      }

      if (filters.facility_id) {
        conditions.push({ field: 'facility_id', operator: '==', value: filters.facility_id });
      }

      if (filters.status) {
        conditions.push({ field: 'status', operator: '==', value: filters.status });
      }

      return await this.query(this.collection, conditions, 'date');
    } catch (error) {
      console.error('Error getting cases by date range:', error);
      throw error;
    }
  }

  async updateCaseStatus(caseId, status, notes = '') {
    try {
      await this.update(this.collection, caseId, { 
        status,
        status_notes: notes,
        status_updated_at: serverTimestamp()
      });

      // Log activity
      await this.create(COLLECTIONS.ACTIVITIES, {
        type: 'case_status_updated',
        case_id: caseId,
        description: `Case status updated to: ${status}`,
        notes
      });

      return true;
    } catch (error) {
      console.error('Error updating case status:', error);
      throw error;
    }
  }
}

class TrayTrackingService extends FirebaseService {
  constructor() {
    super();
    this.collection = COLLECTIONS.TRAY_TRACKING;
  }

  async updateTrayAvailability(facilityId, trayUpdates) {
    try {
      const operations = trayUpdates.map(update => ({
        type: 'update',
        collectionName: this.collection,
        id: update.tray_id,
        data: {
          facility_id: facilityId,
          status: update.status,
          location: update.location,
          last_updated: serverTimestamp()
        }
      }));

      await this.batchWrite(operations);
      return true;
    } catch (error) {
      console.error('Error updating tray availability:', error);
      throw error;
    }
  }

  async getTrayAvailabilityForCase(caseId) {
    try {
      const caseData = await this.getById(COLLECTIONS.SURGICAL_CASES, caseId);
      if (!caseData) return null;

      const requiredTrays = caseData.tray_requirements || [];
      const availability = [];

      for (const tray of requiredTrays) {
        const trayStatus = await this.query(this.collection, [
          { field: 'tray_id', operator: '==', value: tray.tray_id },
          { field: 'facility_id', operator: '==', value: caseData.facility_id }
        ]);

        availability.push({
          ...tray,
          availability: trayStatus[0] || { status: 'unknown' }
        });
      }

      return availability;
    } catch (error) {
      console.error('Error getting tray availability for case:', error);
      throw error;
    }
  }
}

// Export service instances
export const physicianService = new PhysicianService();
export const facilityService = new FacilityService();
export const surgicalCaseService = new SurgicalCaseService();
export const trayTrackingService = new TrayTrackingService();

// Export collections for direct access
export { COLLECTIONS };

// Export base service for custom operations
export default FirebaseService;

