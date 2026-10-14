import React, { createContext, useContext, useState, useEffect } from 'react';
import { Farm, CalendarEvent, FarmerUser } from '../types';
import { apiService, DEMO_FARMS, DEMO_EVENTS, setAuthToken } from '../services/api';

interface AppContextType {
  isAuthenticated: boolean;
  user: FarmerUser | null;
  farms: Farm[];
  selectedFarm: Farm | null;
  setSelectedFarm: (f: Farm) => void;
  events: CalendarEvent[];
  language: 'en' | 'hi' | 'pa';
  setLanguage: (l: 'en' | 'hi' | 'pa') => void;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (regData: any) => Promise<void>;
  logout: () => void;
  refreshData: () => Promise<void>;
  addFarm: (farm: Partial<Farm>) => Promise<void>;
  completeEvent: (eventId: string) => void;
  generateAISchedule: (farmId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<FarmerUser | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [language, setLanguage] = useState<'en' | 'hi' | 'pa'>('en');
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const fetchedFarms = await apiService.getFarms();
      const actualFarms = fetchedFarms.length > 0 ? fetchedFarms : DEMO_FARMS;
      setFarms(actualFarms);
      if (actualFarms.length > 0 && !selectedFarm) {
        setSelectedFarm(actualFarms[0]);
      }
      const fetchedEvents = await apiService.getEvents();
      setEvents(fetchedEvents.length > 0 ? fetchedEvents : DEMO_EVENTS);
    } catch {
      setFarms(DEMO_FARMS);
      setSelectedFarm(DEMO_FARMS[0]);
      setEvents(DEMO_EVENTS);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await apiService.login(email, pass);
      setUser(res.user);
      setIsAuthenticated(true);
      await refreshData();
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (regData: any) => {
    setIsLoading(true);
    try {
      const res = await apiService.register(regData);
      setUser(res.user);
      setIsAuthenticated(true);
      await refreshData();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setFarms([]);
    setSelectedFarm(null);
    setEvents([]);
  };

  const addFarm = async (farmData: Partial<Farm>) => {
    setIsLoading(true);
    try {
      const created = await apiService.createFarm(farmData);
      setFarms((prev) => [created, ...prev]);
      setSelectedFarm(created);
    } finally {
      setIsLoading(false);
    }
  };

  const completeEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === eventId ? { ...ev, status: 'Completed' } : ev))
    );
  };

  const generateAISchedule = async (farmId: string) => {
    setIsLoading(true);
    try {
      const newEvents = await apiService.generateAISchedule(farmId);
      if (newEvents.length > 0) {
        setEvents(newEvents);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        user,
        farms,
        selectedFarm,
        setSelectedFarm,
        events,
        language,
        setLanguage,
        isLoading,
        login,
        register,
        logout,
        refreshData,
        addFarm,
        completeEvent,
        generateAISchedule,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
