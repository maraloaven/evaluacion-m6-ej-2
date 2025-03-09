import Dexie from 'dexie';

const db = new Dexie('HospitalHospitalDB');

db.version(1).stores({
  doctors: '++id, name, specialty, email, phone',
  appointments: '++id, patientName, doctorId, date, reason, status',
  patients: '++id, name, email, phone, address, history'
});

const indexedDBService = {
  getAllDoctors: async () => {
    return await db.doctors.toArray();
  },
  
  getDoctorById: async (id) => {
    return await db.doctors.get(id);
  },
  
  addDoctor: async (doctor) => {
    return await db.doctors.add(doctor);
  },
  
  updateDoctor: async (id, doctorData) => {
    return await db.doctors.update(id, doctorData);
  },
  
  deleteDoctor: async (id) => {
    return await db.doctors.delete(id);
  },
  
  getAllAppointments: async () => {
    return await db.appointments.toArray();
  },
  
  getAppointmentById: async (id) => {
    return await db.appointments.get(id);
  },
  
  addAppointment: async (appointment) => {
    return await db.appointments.add(appointment);
  },
  
  updateAppointment: async (id, appointmentData) => {
    return await db.appointments.update(id, appointmentData);
  },
  
  deleteAppointment: async (id) => {
    return await db.appointments.delete(id);
  },
  
  getAppointmentsByDoctor: async (doctorId) => {
    return await db.appointments
      .where('doctorId')
      .equals(doctorId)
      .toArray();
  },
  
  getAllPatients: async () => {
    return await db.patients.toArray();
  },
  
  getPatientById: async (id) => {
    return await db.patients.get(id);
  },
  
  addPatient: async (patient) => {
    return await db.patients.add(patient);
  },
  
  updatePatient: async (id, patientData) => {
    return await db.patients.update(id, patientData);
  },
  
  deletePatient: async (id) => {
    return await db.patients.delete(id);
  },
  
  initSampleData: async () => {
    try {
      await db.doctors.clear();
      await db.appointments.clear();
      await db.patients.clear();
      
      console.log('Base de datos limpiada para evitar duplicados');
      
      const doctorCount = await db.doctors.count();
      
      if (doctorCount === 0) {
        const doctors = [
          { name: 'Dr. Mario', specialty: 'Cardiología', email: 'dr.mario@hospital.com', phone: '569-1234' },
          { name: 'Dr. Nick Riviera', specialty: 'Neurología', email: 'nick.riviera@hospital.com', phone: '569-5678' },
          { name: 'Dra. Ana Polo', specialty: 'Pediatría', email: 'ana.polo@hospital.com', phone: '569-9012' },
          { name: 'Dr. Simi', specialty: 'Dermatología', email: 'dr.simi@hospital.com', phone: '569-3456' }
        ];
        
        await db.doctors.bulkAdd(doctors);
        
        const appointments = [
          { patientName: 'Bodoque', doctorId: 1, date: new Date('2025-03-10T10:00:00'), reason: 'Chequeo rutinario', status: 'pendiente' },
          { patientName: 'Guaripolo', doctorId: 2, date: new Date('2025-03-11T11:30:00'), reason: 'Dolor de cabeza', status: 'confirmada' },
          { patientName: 'Juanin', doctorId: 3, date: new Date('2025-03-12T09:15:00'), reason: 'Vacunación', status: 'pendiente' }
        ];
        
        await db.appointments.bulkAdd(appointments);
        
        console.log('Datos inicializados en IndexedDB');
      } else {
        console.log('La base de datos ya contiene datos');
      }
    } catch (error) {
      console.error('Error al inicializar datos:', error);
    }
  }
};

export default indexedDBService;