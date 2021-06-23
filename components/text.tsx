import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Text() {
  const [message, setMessage] = useState('');
  useEffect(() => {
    updateMessage();
  }, []);

  function updateMessage() {
    setMessage('updatin...');
    axios
      .get('/api/hello')
      .then(res => {
        setMessage(res.data.name);
      })
      .catch(err => {
        setMessage('error ' + err);
        console.error('error ', err);
      });
  }

  return (
    <div style={{ padding: 10, backgroundColor: 'blanchedalmond', width: '100%', marginBottom: 20 }}>
      <span style={{ marginRight: 20 }}>TEXT: {message}</span>
      <button type="button" onClick={updateMessage} style={{ padding: 20 }}>
        Update
      </button>
    </div>
  )
}
