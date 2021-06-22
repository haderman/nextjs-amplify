import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Text() {
  const [message, setMessage] = useState('');
  useEffect(() => {
    const url = '/api/hello'
    axios
      .get(url)
      .then(res => {
        setMessage(res.data.name);
      })
      .catch(err => {
        console.error('error ', err);
      });
  }, []);

  return (
    <div style={{ padding: 10, backgroundColor: 'blanchedalmond', width: '100%', marginBottom: 20 }}>
      TEXT: {message}
    </div>
  )
}
