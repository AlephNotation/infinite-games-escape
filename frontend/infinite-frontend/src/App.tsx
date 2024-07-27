import Button from './Button'
// import TypeAnimation from './TypeAnimation'
import { useRef, useEffect, useState } from 'react'; // Add useRef and useEffect
import { v4 as uuidv4 } from 'uuid';

// import useStore from './Session';


const checkForDirectoryChange = (cwd: string) => {
  document.cookie = "cwd=" + cwd;
}


const checkForIpChange = (terminalOutput: string[]) => {
  const firstLine = terminalOutput[0];
  const firstLineSplit = firstLine.split(' ');

  if (terminalOutput.some(line => line.toLowerCase().includes('connection established.'))) {
    const sshLine = terminalOutput.find(line => line.startsWith('ssh'));
    if (sshLine) {
      const ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/;
      const match = sshLine.match(ipRegex);
      if (match) {
        const ip = match[0];
        console.log('New IP:', ip);
        document.cookie = "ip=" + ip;
      }
    }
  }

  if (firstLineSplit[0] === 'ssh') {
    const ip = firstLineSplit[1];
    console.log(ip);


    document.cookie = "ip=" + ip;
  }
}

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

  const cwd = getCookie("cwd");
  if (!cwd) {
    document.cookie = "cwd=/";
  }
  const ip = getCookie("ip");
  if (!ip) {
    document.cookie = "ip=localhost";
  }
  console.log("current ip", getCookie("ip"));

  useEffect(() => {
    const username = getCookie("user");
    if (!username) {
      const uuid = uuidv4();
      document.cookie = "user=" + uuid;
    }

  }, []);
  const [allCommands, setAllCommands] = useState<any>([
    [
      "     .__________________________.",
      "    | .___________________. |==|",
      "    | |     Hello ][      | |  |",
      "    | |                   | |  |",
      "    | |                   | |  |",
      "    | |                   | |  |",
      "    | |                  | | ,|",
      "    | !___________________! |(c|",
      "    !_______________________!__!",
      "    !_______________________!__!",
      "   /                            \\",
      "  /  [][][][][][][][][][][][][]  \\",
      " /  [][][][][][][][][][][][][][]  \\",
      "(  [][][][][____________][][][][]  )",
      " \\ ------------------------------ /",
      "  \\______________________________/"
    ],
    "Welcome"
  ]);

  const [input, setInput] = useState<string>('');
  const commandsEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    commandsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allCommands]);

  const BACKEND_URL = "https://infinite-games-escape.fly.dev";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('submitteddddd');
    if (input === 'clear') {
      console.log('clearing');
      setAllCommands([""]);
      setInput('');
    }
    else {
      fetch(`${BACKEND_URL}/command`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: input, ip: getCookie("ip"), userId: getCookie("user"), }),
      })
        .then((res) => res.json())
        .then((data) => {

          console.log("output", data.terminalOutput);
          if (input.toLowerCase().includes("connect")) {
            checkForIpChange(data.terminalOutput);
            checkForDirectoryChange(data.cwd);
          }

          setAllCommands([...allCommands, input, data.terminalOutput]);
          setInput('');
        })

    }


  }


  const handleBeep = () => {
    setAllCommands([...allCommands, 'beep']);
  };

  return (
    <div className='text-lime-300 h-screen overflow-hidden w-screen relative bg-black p-10 flex flex-col' style={{ fontFamily: 'Courier New, monospace' }} >
      <h1 className='text-lime-300 text-4xl font-bold mb-2'>Welcome to the Terminal</h1>
      <div className='flex flex-row justify-between'>
        <Button text="Beep" onClick={handleBeep} />

      </div>
      <div style={{ maxHeight: '500px', overflowY: 'auto', scrollbarColor: '#8CF349 black', scrollbarWidth: 'thin' }} className='flex flex-col'>
        {allCommands.map((command, index) => {
          // Check if command is an array
          const commandsToDisplay = Array.isArray(command) ? command : [command];
          return commandsToDisplay.map((cmd, cmdIndex) => (
            <span key={`${index}-${cmdIndex}`} className='text-lime-300 w-screen'>{cmd}</span>
          ));
        })}
        <div ref={commandsEndRef} /> {/* This div will be used to scroll into view */}
      </div>
      <form onSubmit={handleSubmit}>
        {getCookie("ip")}{getCookie("cwd")} $   <input
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



// check if the terminaloutput includes a new IP of the form
// 'ssh 127.0.0.1'
// and if so, update the cookie to the new IP 
// first i need to pull iyana's updates 
// and then i need to add logic to parse the output of the command
// add a function called checkForIpChange
// 

// or actually just hit the machine endpoint and check if the ip is different than 
// the ip in the cookie? but the machine endpoint is not the currrent ip 
// 

// logic on the frontend
// if ip is home

// display readme.txt

// add a prompt 

// type help
// scan 

// special commands that live on the backend
// setUser
// connect
// scan
// help - offers a hint
// 