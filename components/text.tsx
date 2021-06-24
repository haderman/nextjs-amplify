import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Text() {
  const [message, setMessage] = useState('');
  const [loginMsg, setLoginMsg] = useState('idle');
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

  function login() {
    setLoginMsg('login...');
    axios
      .post('/api/login')
      .then(res => {
        setLoginMsg(res.data);
      })
      .catch(err => {
        setLoginMsg('error ' + err);
        console.error('error ', err);
      });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%' }}>
      <div style={{ padding: 10, backgroundColor: 'blanchedalmond', width: '100%', marginBottom: 20 }}>
        <button type="button" onClick={updateMessage} style={{ padding: 20, width: 100, marginRight: 10 }}>
          Update
        </button>
        <span style={{ marginRight: 20 }}>TEXT: {message}</span>
      </div>
      <div style={{ padding: 10, backgroundColor: 'blanchedalmond', width: '100%', marginBottom: 20 }}>
        <button type="button" onClick={login} style={{ padding: 20, width: 100, marginRight: 10  }}>
          Login
        </button>
        <span style={{ marginRight: 20 }}>LOGIN TEXT: {loginMsg}</span>
      </div>
    </div>
  )
}
