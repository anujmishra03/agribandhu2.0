import { Farm, CalendarEvent, DiseaseDetectionResult, FarmerUser } from '../types';

let API_BASE_URL = 'https://agribandhu-api.vercel.app/api'; // Live 24/7 Vercel API
let authToken: string | null = null;

export const setApiBaseUrl = (url: string) => {
  API_BASE_URL = url;
};

export const getApiBaseUrl = () => API_BASE_URL;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

export const apiService = {
  // Authentication
  async login(email: string, password: string): Promise<{ token: string; user: FarmerUser }> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to login. Please check credentials.');
    }

    if (data.token) {
      setAuthToken(data.token);
    }

    return {
      token: data.token,
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.profile?.phone || data.phone || '+91 98765 43210',
        role: data.role,
        village: data.profile?.village || 'Sahnewal',
        district: data.profile?.district || 'Ludhiana',
        state: data.profile?.state || 'Punjab',
      },
    };
  },

  async register(registerData: any): Promise<{ token: string; user: FarmerUser }> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed.');
    }

    if (data.token) {
      setAuthToken(data.token);
    }

    return {
      token: data.token,
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: registerData.phone || '+91 98765 43210',
        role: data.role,
        village: registerData.village || 'Sahnewal',
        district: registerData.district || 'Ludhiana',
        state: registerData.state || 'Punjab',
      },
    };
  },

  async getMe(): Promise<FarmerUser | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: getHeaders(),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.profile?.phone || data.phone,
        role: data.role,
        village: data.profile?.village,
        district: data.profile?.district,
        state: data.profile?.state,
      };
    } catch {
      return null;
    }
  },

  // Farms
  async getFarms(): Promise<Farm[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/farms`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  async createFarm(farmData: Partial<Farm>): Promise<Farm> {
    const res = await fetch(`${API_BASE_URL}/farms`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(farmData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create farm');
    }
    return await res.json();
  },

  // Calendar
  async getEvents(): Promise<CalendarEvent[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/calendar`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  async generateAISchedule(farmId: string): Promise<CalendarEvent[]> {
    const res = await fetch(`${API_BASE_URL}/calendar/generate-ai-schedule`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ farmId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'AI Schedule generation failed');
    }
    const data = await res.json();
    return Array.isArray(data.events) ? data.events : [];
  },

  // Disease Detection
  async analyzeDisease(cropName: string, imageUri?: string): Promise<DiseaseDetectionResult> {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      diseaseName: 'Yellow Rust (Puccinia striiformis)',
      confidence: 94.6,
      isHealthy: false,
      severity: 'Moderate',
      description:
        'Yellow-orange fungal pustules aligned in linear stripes on wheat foliage, causing chlorosis and impairing grain development.',
      organicTreatment: [
        'Neem oil foliar spray (5 ml/L water) at first sign of pustules',
        'Trichoderma viride organic bio-fungicide application',
        'Remove severely infected lower leaves to limit spore dispersion',
      ],
      chemicalTreatment: [
        'Propiconazole 25% EC @ 1 ml per liter of water',
        'Tebuconazole 25.9% EC @ 1.25 ml per liter using knapsack sprayer',
      ],
      preventiveMeasures: [
        'Plant rust-resistant cultivars like HD-3226 / DBW-187',
        'Avoid late excess nitrogen top-dressing',
        'Ensure proper row aeration',
      ],
    };
  },
};
