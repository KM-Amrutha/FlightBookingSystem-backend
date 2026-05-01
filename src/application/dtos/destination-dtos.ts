export interface DestinationDTO {
  _id: string;
  name: string;
  iataCode: string;
  icaoCode?: string;
  municipality: string;
  isoCountry: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isActive: boolean;
}