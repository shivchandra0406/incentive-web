import { useState } from 'react';

function TestApp() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Test App</h1>
      <p>This is a test app to check if React is rendering correctly.</p>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  );
}

export default TestApp;
