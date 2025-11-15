export interface Project {
  // Primary Key
  id: number; 

  // Core Project Data
  title: string;
  designer: string | null; 
  location: string;
  beneficiary: string | null; 
  status: string; 
  category: string | null; 

  // Value and Duration
  total_value: number | null; 
  // 🌟 FIX: Use the full column name for realization duration
  realization_duration_months: number | null; 
  // 🌟 FIX: Use the full column name for execution duration
  execution_duration_months: number | null; 

  // Links and Changes
  latest_decision_url: string | null; 
  latest_change: string | null; 

  // Geospatial Data
  latitude: number | null; 
  longitude: number | null; 
  location_point: any; 

  // Timestamps
  created_at: string; 
  updated_at: string; 
}