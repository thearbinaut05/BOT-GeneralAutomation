import { useState } from 'react';

function AppTest() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '20px', background: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ color: '#f7931a' }}>Bitcoin Puzzle Solver - Test</h1>
      <p>If you can see this, React is working!</p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{ padding: '10px 20px', background: '#f7931a', color: 'black', border: 'none', cursor: 'pointer' }}
      >
        Count: {count}
      </button>
    </div>
  );
}

export default AppTest;
