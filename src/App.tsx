import { Button } from '@/components/ui/button';
import { useState } from 'react';
import './index.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-4xl font-bold'>Hello World</h1>
      <div>{count}</div>
      <Button onClick={() => setCount(count + 1)}>Click me</Button>
    </div>
  );
}

export default App;
