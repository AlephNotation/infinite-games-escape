import Button from './Button'
// import TypeAnimation from './TypeAnimation'
import { useRef, useEffect, useState } from 'react'; // Add useRef and useEffect
import { v4 as uuidv4 } from 'uuid';

// import useStore from './Session';


function App() {
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const lastPart = parts.pop();
      if (lastPart) {
        return lastPart.split(';')[0];
      }
    }
    return undefined;
  };
  console.log(getCookie("user"));


  const ip = getCookie("ip");
  if (!ip) {
    document.cookie = "ip=127.0.0.1";
  }
  console.log("current ip", getCookie("ip"));



  useEffect(() => {
    const username = getCookie("user");
    if (!username) {
      const uuid = uuidv4();
      document.cookie = "user=" + uuid;
    }

  }, []);

  const [allCommands, setAllCommands] = useState<string[]>(['Welcome', 'Please enter your name']);
  const [input, setInput] = useState<string>('');
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log('submitteddddd');

    fetch('http://localhost:3000/command', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command: input, ip: getCookie("ip"), userId: getCookie("user"), }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setAllCommands([...allCommands, data.command]);
        setInput('');
      })

    e.preventDefault();
    setAllCommands([...allCommands, input]);
    setInput('');
  }
  console.log(allCommands);


  return (
    <div className='text-lime-300 h-full overflow-y-auto w-screen relative bg-black p-10 flex flex-col' style={{ fontFamily: 'Courier New, monospace' }} >
      <h1 className='text-lime-300 text-4xl font-bold mb-2'>Welcome to the Terminal</h1>
      <div className='flex flex-row justify-between'>
        <Button text="Root" />
        <Button text="Start" />
        <Button text="Hack" />
        <Button text="Help" />
        <Button text="Exit" />
      </div>
      <br></br>
      {allCommands.map((command, index) => {
        return <span className='text-lime-300 w-screen'>{command}
        </span>
      })}
      <form onSubmit={handleSubmit}>
        $   <input
          type="text"
          className='bg-black text-lime-300 font-bold py-2 px-4 mb-4 mr-4 appearance-none focus:outline-none '
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>

    </div>
  )
}

export default App
