const USER_PREFERENCES_KEY = 'hospital_user_preferences';
const SESSION_DATA_KEY = 'hospital_session_data';

const localStorageService = {
  getUserPreferences: () => {
    try {
      const preferences = localStorage.getItem(USER_PREFERENCES_KEY);
      return preferences ? JSON.parse(preferences) : {
        theme: 'light',
        fontSize: 'medium',
        notifications: true,
        language: 'es'
      };
    } catch (error) {
      console.error('Error al obtener preferencias de usuario:', error);
      return {
        theme: 'light',
        fontSize: 'medium',
        notifications: true,
        language: 'es'
      };
    }
  },
  
  saveUserPreferences: (preferences) => {
    try {
      localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences));
      return true;
    } catch (error) {
      console.error('Error al guardar preferencias de usuario:', error);
      return false;
    }
  },
  
  updateUserPreference: (key, value) => {
    try {
      const preferences = localStorageService.getUserPreferences();
      preferences[key] = value;
      localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences));
      return true;
    } catch (error) {
      console.error(`Error al actualizar preferencia ${key}:`, error);
      return false;
    }
  },
  
  getSessionData: () => {
    try {
      const sessionData = sessionStorage.getItem(SESSION_DATA_KEY);
      return sessionData ? JSON.parse(sessionData) : {
        lastVisitedPage: '/',
        searchHistory: [],
        temporaryData: {}
      };
    } catch (error) {
      console.error('Error al obtener datos de sesión:', error);
      return {
        lastVisitedPage: '/',
        searchHistory: [],
        temporaryData: {}
      };
    }
  },
  
  saveSessionData: (data) => {
    try {
      sessionStorage.setItem(SESSION_DATA_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error al guardar datos de sesión:', error);
      return false;
    }
  },
  
  updateSessionData: (key, value) => {
    try {
      const sessionData = localStorageService.getSessionData();
      sessionData[key] = value;
      sessionStorage.setItem(SESSION_DATA_KEY, JSON.stringify(sessionData));
      return true;
    } catch (error) {
      console.error(`Error al actualizar dato de sesión ${key}:`, error);
      return false;
    }
  },
  
  updateLastVisitedPage: (page) => {
    try {
      const sessionData = localStorageService.getSessionData();
      sessionData.lastVisitedPage = page;
      sessionStorage.setItem(SESSION_DATA_KEY, JSON.stringify(sessionData));
      return true;
    } catch (error) {
      console.error('Error al actualizar última página visitada:', error);
      return false;
    }
  },
  
  addToSearchHistory: (searchTerm) => {
    try {
      const sessionData = localStorageService.getSessionData();
      if (!sessionData.searchHistory) {
        sessionData.searchHistory = [];
      }
      if (!sessionData.searchHistory.includes(searchTerm)) {
        sessionData.searchHistory.unshift(searchTerm);
        sessionData.searchHistory = sessionData.searchHistory.slice(0, 10);
      }
      sessionStorage.setItem(SESSION_DATA_KEY, JSON.stringify(sessionData));
      return true;
    } catch (error) {
      console.error('Error al añadir al historial de búsqueda:', error);
      return false;
    }
  },
  
  clearSearchHistory: () => {
    try {
      const sessionData = localStorageService.getSessionData();
      sessionData.searchHistory = [];
      sessionStorage.setItem(SESSION_DATA_KEY, JSON.stringify(sessionData));
      return true;
    } catch (error) {
      console.error('Error al limpiar historial de búsqueda:', error);
      return false;
    }
  }
};

export default localStorageService;