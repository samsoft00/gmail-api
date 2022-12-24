import { Button } from 'react-bootstrap'
import { google, Auth } from 'googleapis'
import { useEffect, useState } from 'react'
import { Flight, searchFlights } from './api/hello';

export default function Home() {
  const [authMethod, setAuthMethod] = useState<'gmail' | 'gsuite' | null>(null)
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isFetching, setIsFetching] = useState<Boolean>(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setIsFetching(true)
    setError(null)

    let auth: Auth.OAuth2Client | Auth.GoogleAuth;

    if (['gmail'].includes(String(authMethod))) {
      auth = new google.auth.OAuth2({
        clientId: 'YOUR_CLIENT_ID',
        clientSecret: 'YOUR_CLIENT_SECRET',
        redirectUri: 'http://localhost:3000/auth/gmail/callback'        
      })
    } else {
      auth = new google.auth.GoogleAuth({
        keyFile: '../app-d5f723bab23f.json',
        scopes: ['https://www.googleapis.com/auth/gmail.readonly']
      });      
    }

    searchFlights(auth).then(flights => {
      setFlights(flights);
    });    

  }, [authMethod])

  // Handle the Gmail authentication button click
  const handleGmailAuthClick = () => { setAuthMethod('gmail') };

  // Handle the G Suite authentication button click
  const handleGSuiteAuthClick = () => { setAuthMethod('gsuite') };

  return (
    <div>
      {authMethod === null && (
        <>
          <h1>Choose an Authentication Method</h1>
          <Button onClick={handleGmailAuthClick}>Gmail</Button>
          <Button onClick={handleGSuiteAuthClick}>G Suite</Button>
        </>
      )}
      {authMethod === 'gmail' && <p>Authenticating with Gmail...</p>}
      {authMethod === 'gsuite' && <p>Authenticating with G Suite...</p>}
    </div>
  )
}
