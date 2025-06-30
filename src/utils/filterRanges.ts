import { addDays, subDays, addWeeks, subWeeks, addMonths, subMonths, startOfDay, format } from 'date-fns';
import { point, buffer } from '@turf/turf';
import { bbox } from '@turf/bbox';

// Utility functions for calculating date and geo ranges

export const calculateDateRanges = (baseDate: string) => {
  const date = startOfDay(new Date(baseDate)); // Flatten to day level
  
  const formatDate = (d: Date) => format(d, 'yyyy-MM-dd');
  
  const ranges = {
    day: {
      start: formatDate(subDays(date, 1)),
      end: formatDate(addDays(date, 1))
    },
    week: {
      start: formatDate(subWeeks(date, 1)),
      end: formatDate(addWeeks(date, 1))
    },
    month: {
      start: formatDate(subMonths(date, 1)),
      end: formatDate(addMonths(date, 1))
    }
  };
  
  return ranges;
};

export const calculateGeoRanges = (baseLatlng: string) => {
  const [lat, lng] = baseLatlng.split(',').map(coord => parseFloat(coord.trim()));
  
  if (isNaN(lat) || isNaN(lng)) {
    throw new Error('Invalid latlng format');
  }
  
  const basePoint = point([lng, lat]); // GeoJSON uses [lng, lat] order
  
  const createRange = (meters: number) => {
    // Create a buffer around the point
    const buffered = buffer(basePoint, meters, { units: 'meters' });
    
    // Get bounding box [minX, minY, maxX, maxY]
    const boundingBox = bbox(buffered);
    
    return {
      start: `${boundingBox[1].toFixed(8)}, ${boundingBox[0].toFixed(8)}`, // minLat, minLng
      end: `${boundingBox[3].toFixed(8)}, ${boundingBox[2].toFixed(8)}`     // maxLat, maxLng
    };
  };
  
  const ranges = {
    '10m': createRange(10),
    '100m': createRange(100),
    '1km': createRange(1000),
    '10km': createRange(10000)
  };
  
  return ranges;
};