import fs from 'fs';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import DestinationModel from '../infrastructure/databases/models/destination.model';
import { find } from 'geo-tz';
import * as dotenv from 'dotenv';

dotenv.config();

const BATCH_SIZE = 1000;

async function seedAirports() {
  try {
    if (!process.env.ATLAS_DATABASE_CONFIG) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    await mongoose.connect(process.env.ATLAS_DATABASE_CONFIG);
    await DestinationModel.deleteMany({});
    const airports: any[] = [];
    let totalCount = 0;
    let importedCount = 0;

    fs.createReadStream('./data/airports.csv')
      .pipe(csv())
      .on('data', (row) => {
        totalCount++;

        const isCommercialAirport = 
          row.iata_code && 
          row.scheduled_service === 'yes' && 
          (row.type === 'large_airport' || row.type === 'medium_airport');

        if (isCommercialAirport && row.latitude_deg && row.longitude_deg) {
          const lat = parseFloat(row.latitude_deg);
          const lon = parseFloat(row.longitude_deg);
          
          const timezones = find(lat, lon);
          
          airports.push({
            name: row.name,
            iataCode: row.iata_code,
            icaoCode: row.icao_code || undefined,
            municipality: row.municipality,
            isoCountry: row.iso_country,
            latitude: lat,
            longitude: lon,
            timezone: timezones[0] || 'UTC',
            isActive: true
          });

          importedCount++;
        }
      })
      .on('end', async () => {
        for (let i = 0; i < airports.length; i += BATCH_SIZE) {
          const batch = airports.slice(i, i + BATCH_SIZE);
          await DestinationModel.insertMany(batch, { ordered: false });
          console.log(`   Inserted ${Math.min(i + BATCH_SIZE, airports.length)}/${airports.length}`);
        }
        await mongoose.disconnect();
        process.exit(0);
      })
      .on('error', (error) => {
        process.exit(1);
      });
  } catch (error) {
    process.exit(1);
  }
}

seedAirports();
