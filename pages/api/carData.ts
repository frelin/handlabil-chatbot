import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiUrl = 'https://api.bytbil.com/vehicles/dealergroups/lindgrensmaskin2017.json';
  const apiToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS5ieXRiaWwuY29tIiwic3ViIjoiYXBpLmJ5dGJpbC5jb20vdXNlcnMvbGluZGdyZW5zbWFza2luMjAxNyIsImF1ZCI6WyJodHRwczovL2FkbWluLmJ5dGJpbC5jb20iXSwibmJmIjoxNjgxMzgzNDYyLCJpYXQiOjE2ODEzODM0NjIsImV4cCI6bnVsbCwianRpIjoiMzdlNDkwZmEtYWMzNC00Y2UxLWE4ZGEtOWZlY2Q2MGI0OWJiIiwibGltaXQiOi0xLCJzY29wZXMiOnsiZ2V0LnZlaGljbGVzIjoibGluZGdyZW5zbWFza2luMjAxNyJ9fQ.YYWdZr6lnw6mGoL3A3qv_ZUZQEluT8-SuSVemy7q3gQ';

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-Auth-Token': apiToken
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: error });
  }
}