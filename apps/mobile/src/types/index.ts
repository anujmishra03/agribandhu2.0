export interface Farm {
  id: string;
  userId: string;
  name: string;
  farmType: string;
  area: number;
  unit: 'Acres' | 'Hectares';
  state: string;
  district: string;
  village: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  crop?: Crop | null;
  soil?: Soil | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Crop {
  id: string;
  farmId: string;
  name: string;
  variety?: string | null;
  sowingDate?: string | null;
  expectedHarvest?: string | null;
  growthStage?: string | null;
}

export interface Soil {
  id: string;
  farmId: string;
  soilType?: string | null;
  ph?: number | null;
  nitrogen?: number | null;
  phosphorus?: number | null;
  potassium?: number | null;
  organicCarbon?: number | null;
}

export interface DiseaseDetectionResult {
  id?: string;
  diseaseName: string;
  confidence: number;
  isHealthy: boolean;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'None';
  description: string;
  organicTreatment: string[];
  chemicalTreatment: string[];
  preventiveMeasures: string[];
  imageUrl?: string;
}

export interface CalendarEvent {
  id: string;
  farmId: string;
  title: string;
  description?: string | null;
  eventType: 'SEEDING' | 'IRRIGATION' | 'FERTILIZER' | 'PESTICIDE' | 'HERBICIDE' | 'PRUNING' | 'HARVEST' | 'LAND_PREP' | 'FIELD_CLEANING' | 'SOIL_TEST' | 'INSPECTION' | 'AI_RECOMMENDATION' | 'CUSTOM';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Upcoming' | 'Today' | 'Completed' | 'Missed' | 'Cancelled' | 'Delayed';
  startDate: string;
  startTime?: string;
  endDate?: string | null;
  endTime?: string;
  notes?: string | null;
}

export interface FarmerUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'FARMER' | 'ADMIN' | 'OFFICER';
  village?: string;
  district?: string;
  state?: string;
}
