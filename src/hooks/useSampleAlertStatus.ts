
import { differenceInHours, differenceInDays, parseISO } from 'date-fns';

export const useSampleAlertStatus = (createdAt?: string, enterobacteria?: string, yeastMold?: string) => {
  if (!createdAt) return null;
  
  try {
    const currentDate = new Date();
    const sampleDate = parseISO(createdAt);
    const hoursSince = differenceInHours(currentDate, sampleDate);
    const daysSince = differenceInDays(currentDate, sampleDate);
    
    // Alert for enterobacteria - if 24+ hours passed and no enterobacteria value
    if (hoursSince >= 24 && !enterobacteria) {
      return 'warning'; // yellow alert
    }
    
    // Alert for yeast/mold - if 5+ days passed and no yeast/mold value
    if (daysSince >= 5 && !yeastMold) {
      return 'urgent'; // red alert
    }
    
    return null;
  } catch (error) {
    console.error('Error calculating alert status:', error);
    return null;
  }
};
