import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Flight } from './api/flight'
import { ListGroup } from 'react-bootstrap'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export function FlightList(props: {flights: Flight[]}) {
  return (
    <ListGroup>
      {props.flights.map(flight => (
        <ListGroup.Item key={flight.id}>
          <h5>Flight {flight.number}</h5>
          <p>Departs at {flight.departureTime}</p>
          <p>Arrives at {flight.arrivalTime}</p>
        </ListGroup.Item>
      ))}
    </ListGroup>
  )}
