
import { differenceInHours, differenceInDays, parseISO } from 'date-fns';

export const useSampleAlertStatus = (createdAt?: string) => {
  if (!createdAt) return null;
  
  try {
    const currentDate = new Date();
    const sampleDate = parseISO(createdAt);
    const hoursSince = differenceInHours(currentDate, sampleDate);
    const daysSince = differenceInDays(currentDate, sampleDate);
    
    // Alert for enterobacteria
    if (hoursSince >= 24 && !createdAt) {
      return 'warning'; // yellow alert
    }
    
    // Alert for yeast/mold
    if (daysSince >= 5 && !createdAt) {
      return 'urgent'; // red alert
    }
    
    return null;
  } catch (error) {
    console.error('Error calculating alert status:', error);
    return null;
  }
};
