// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {google, Auth, gmail_v1} from 'googleapis';

type Data = {
  name: string
}

type GAuth = Auth.OAuth2Client | Auth.GoogleAuth;

export interface Flight {
  id: string;
  number: string;
  departureTime: string;
  arrivalTime: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'John Doe' })
}

export const searchFlights = async (gAuth: GAuth): Promise<Flight[]> => {
  // Set up the Gmail API client
  const gmail = google.gmail({
    version: 'v1',
    auth: gAuth
  }) as gmail_v1.Gmail;

  // Search for emails that contain the word "flight"
  const res = await gmail.users.messages.list({
    userId: 'me',
    q: 'subject:flight'
  });
  const messages = res.data.messages as gmail_v1.Schema$Message[];

  // Iterate through the messages and extract the relevant information
  const flights: Flight[] = [];
  for (const message of messages) {
    const msg = await gmail.users.messages.get({
      userId: 'me',
      id: String(message.id)
    });
    
    const data = msg.data;

    if(typeof data.payload === 'undefined') continue
    const headers = data.payload.headers as gmail_v1.Schema$MessagePartHeader[]

    // Extract the flight number, departure and arrival times, and so on
    // from the email headers
    const flightNumber = getData(headers, 'Flight').value;
    const departureTime = getData(headers, 'Departure-Time').value;
    const arrivalTime = getData(headers, 'Arrival-Time').value;

    flights.push({
      id: String(message.id),
      number: flightNumber,
      departureTime,
      arrivalTime
    });
  }

  return flights;
};

const getData = (item: any[], query: string) => {
  return item.find(h => query === h.name);
}