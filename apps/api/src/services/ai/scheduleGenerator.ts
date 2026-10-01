export interface GeneratedTaskItem {
  title: string;
  eventType: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Upcoming' | 'Today';
  offsetDays: number; // Offset from today in days
  startTime: string;
  endTime: string;
  recurrence: string;
  notes: string;
}

export class ScheduleGeneratorService {
  public static generateSchedule(
    cropName?: string,
    growthStage?: string,
    soilType?: string
  ): GeneratedTaskItem[] {
    const crop = cropName || 'General Crop';
    const stage = growthStage || 'Vegetative';

    const tasks: GeneratedTaskItem[] = [
      {
        title: `Inspect ${crop} Leaf Health`,
        eventType: 'INSPECTION',
        description: `Perform visual scouting on ${stage} stage leaves for early fungal or insect patholeisons.`,
        priority: 'High',
        status: 'Today',
        offsetDays: 0,
        startTime: '08:00',
        endTime: '09:00',
        recurrence: 'WEEKLY',
        notes: 'Pay close attention to leaf undersides where humidity accumulates.',
      },
      {
        title: `Primary Drip Irrigation Cycle`,
        eventType: 'IRRIGATION',
        description: `Apply 2.5 hours of root-level drip irrigation based on ${soilType || 'Soil'} moisture retention.`,
        priority: 'Medium',
        status: 'Upcoming',
        offsetDays: 1,
        startTime: '06:00',
        endTime: '08:30',
        recurrence: 'EVERY_15_DAYS',
        notes: 'Irrigate during morning hours to prevent excessive evaporation.',
      },
      {
        title: `NPK Foliar Fertilizer Dose`,
        eventType: 'FERTILIZER',
        description: `Apply 19-19-19 water-soluble NPK foliar spray to promote vigorous ${stage} canopy growth.`,
        priority: 'High',
        status: 'Upcoming',
        offsetDays: 3,
        startTime: '07:30',
        endTime: '09:30',
        recurrence: 'NONE',
        notes: 'Ensure soil is moist prior to foliar spray application.',
      },
      {
        title: `AI Disease Risk Check`,
        eventType: 'AI_RECOMMENDATION',
        description: `Upload leaf photo using AgriBandhu AI Scanner to evaluate pathogen risks.`,
        priority: 'High',
        status: 'Upcoming',
        offsetDays: 7,
        startTime: '10:00',
        endTime: '11:00',
        recurrence: 'WEEKLY',
        notes: 'Recommended prior to upcoming monsoon humidity spike.',
      },
      {
        title: `Bio-Pesticide Neem Oil Spray`,
        eventType: 'PESTICIDE',
        description: `Spray 0.5% cold-pressed Neem oil emulsion as a preventive measure against whiteflies and aphids.`,
        priority: 'Medium',
        status: 'Upcoming',
        offsetDays: 12,
        startTime: '16:30',
        endTime: '18:00',
        recurrence: 'NONE',
        notes: 'Spray late in the afternoon to avoid harming beneficial pollinating bees.',
      },
      {
        title: `Harvest Readiness Assessment`,
        eventType: 'HARVEST',
        description: `Evaluate grain/fruit maturity, moisture percentage, and sorting equipment readiness.`,
        priority: 'Critical',
        status: 'Upcoming',
        offsetDays: 25,
        startTime: '07:00',
        endTime: '12:00',
        recurrence: 'NONE',
        notes: 'Check local wholesale mandi prices prior to harvesting.',
      },
    ];

    return tasks;
  }
}
