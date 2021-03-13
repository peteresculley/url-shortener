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

  const requestShorten = async () => {
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

  const resultOrError = errorMessage
    ? <div style={styles.error.container}>{errorMessage}</div>
    : <div style={styles.result.container}>{resultMessage}</div>;

  return <div style={styles.container}>
    <div style={styles.url.container}>
      <label style={styles.url.label}>URL:</label>
      <input onChange={onInputChange} onSubmit={requestShorten} value={input} style={styles.url.input} />
      <button onClick={requestShorten}>Shorten!</button>
      <div style={styles.url.status}>{status}</div>
    </div>
    {resultOrError}
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
    input: {},
    status: {
      marginLeft: 15,
      color: 'gray',
    },
  },
  result: {
    container: {
      marginTop: '1rem',
      marginBottom: '1rem',
    },
  },
  error: {
    container: {
      marginTop: '1rem',
      marginBottom: '1rem',
      color: 'red',
    },
  },
} as const;

export default App;
