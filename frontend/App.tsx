import React, { useState } from 'react';

const App = () => {
  const [ input, setInput ] = useState('');
  const [ result, setResult ] = useState('');
  const [ error, setError ] = useState('');
  const [ status, setStatus ] = useState('');

  const resultMessage = result ? `Shortened URL: ${result}` : '';
  const errorMessage = error ? `Error: ${error}` : '';

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const requestShorten = async (event: React.FormEvent) => {
    event.preventDefault();
    setResult('');
    setError('');
    setStatus('In progress');
    const body = { url: input };
    const res = await fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    setStatus('');
    if(res.status === 200) {
      const { link } = await res.json();
      setResult(link);
      setError('');
    } else {
      setResult('');
      setError(await res.text());
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
  };

  const messageBox = status
    ? <div style={styles.status}>{status}</div>
    : errorMessage
    ? <div style={styles.error}>{errorMessage}</div>
    : resultMessage
    ? <div style={styles.result}>
        <label>{resultMessage}</label>
        <button onClick={copyResult} style={styles.copyButton}>Copy</button>
      </div>
    : null;

  return <div style={styles.container}>
    <div style={styles.url.container}>
      <form onSubmit={requestShorten}>
        <label style={styles.url.label}>URL:</label>
        <input type="text" onChange={onInputChange} value={input} style={styles.url.input} autoFocus={true} />
        <button type="submit" disabled={input === ''}>Shorten!</button>
      </form>
    </div>
    {messageBox}
  </div>;
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '10vh',
  },
  url: {
    container: {
      marginBottom: '1rem',
    },
    label: {
      marginRight: 5,
    },
    input: {
      minWidth: '50vw',
      marginRight: '0.5rem',
    },
  },
  status: {
    marginTop: '1rem',
    color: 'gray',
  },
  result: {
    marginTop: '1rem',
    marginBottom: '1rem',
    flexDirection: 'row',
  },
  error: {
    marginTop: '1rem',
    marginBottom: '1rem',
    color: 'red',
  },
  copyButton: {
    marginLeft: '0.5rem',
  },
} as const;

export default App;
