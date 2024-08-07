// import TypeAnimation from './TypeAnimation'
import { useRef, useEffect, useState } from 'react'; // Add useRef and useEffect
import { v4 as uuidv4 } from 'uuid';
import TypeAnimation from './TypeAnimation';
import { Command } from './lib/types'
import { calculateInputCommands } from './lib/calculateInputCommands';

// import useStore from './Session';


const checkForDirectoryChange = (cwd: string) => {
  console.log("current working directory")
  document.cookie = "cwd=" + cwd;
}


const checkForIpChange = (terminalOutput: string[]) => {
  const firstLine = terminalOutput[0];
  const firstLineSplit = firstLine.split(' ');

  if (terminalOutput.some(line => line.toLowerCase().includes('connection established'))) {
    const ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/;
    for (const line of terminalOutput) {
      const match = line.match(ipRegex);
      if (match) {
        const ip = match[0];
        console.log('New IP:', ip);
        document.cookie = "ip=" + ip;
        document.cookie = "cwd=/";
        break; // Stop after finding the first IP
      }
    }
  }

  // if the terminal output includes a line that says "connected to localhost" change the cookie to localhost
  if (terminalOutput.some(line => line.toLowerCase().includes('connected to localhost') || line.toLowerCase().includes('connecting to localhost'))) {
    document.cookie = "ip=localhost";
    document.cookie = "cwd=/";
  }

  if (firstLineSplit[0] === 'ssh') {
    const ip = firstLineSplit[1];
    console.log(ip);


    document.cookie = "ip=" + ip;
  }
}

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

function App() {


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
  const [allCommands, setAllCommands] = useState<Command[]>([
    {
      content: [
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
        "  \\______________________________/",
        "    ",
        "Welcome"
      ],
      ip: getCookie("ip") || "localhost",
      pwd: getCookie("cwd") || "/",
      isInput: false
    }]
  );

  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [spinner, setSpinner] = useState<string>('|');

  const [historyIterator, setHistoryIterator] = useState<number>(0);


  const commandsEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    commandsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allCommands, loading]);

  useEffect(() => {
    let intervalId: number;
    if (loading) {
      const spinnerChars = ['|', '/', '-', '\\'];
      let index = 0;
      intervalId = setInterval(() => {
        setSpinner(spinnerChars[index]);
        index = (index + 1) % spinnerChars.length;
      }, 100);
    }
    return () => clearInterval(intervalId);
  }, [loading]);


  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHistoryIterator(0);
    setLoading(true);

    if (input === 'clear') {
      console.log('clearing');
      setAllCommands([]);
      setInput('');
    } else {
      fetch(`${BACKEND_URL}/command`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: input, ip: getCookie("ip"), userId: getCookie("user"), cwd: getCookie("cwd"), }),
      }) // Added missing closing bracket here
        .then((res) => res.json())
        .then((data) => {
          checkForDirectoryChange(data.cwd);
          if (input.toLowerCase().includes("connect")) {
            checkForIpChange(data.terminalOutput);
          }
          setLoading(false);
          // setAllCommands([...allCommands, <span className="text-orange-500">{getCookie("ip") + data.cwd + ' $ ' + input}</span>, data.terminalOutput]);
          const newInputCommand: Command = { content: [input], ip: getCookie("ip") || "localhost", pwd: getCookie("cwd") || "/", isInput: true };
          const newOutputCommand: Command = { content: data.terminalOutput, ip: getCookie("ip") || "localhost", pwd: getCookie("cwd") || "/", isInput: false };
          setAllCommands([...allCommands, newInputCommand, newOutputCommand]);
          setInput('');
        });
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (allCommands.length > 0) {
        setHistoryIterator(historyIterator + 1);
        console.log("historyIterator", historyIterator);
        const inputCommands: Command[] = calculateInputCommands(allCommands);
        console.log("inputCommands", inputCommands);
        const iteratedCommand = inputCommands[inputCommands.length - 1 - historyIterator];
        console.log("iteratedCommand", iteratedCommand);
        setInput(iteratedCommand.content[0]);
      }
    }
  }


  // const handleBeep = () => {
  //   setAllCommands([...allCommands, 'beep']);
  // };

  return (
    <div className='text-lime-300 h-screen overflow-hidden w-screen relative bg-black p-10 flex flex-col' style={{ fontFamily: 'Courier New, monospace' }} >
      <h1 className='text-lime-300 text-4xl font-bold mb-2'>iyana.ai</h1>
      <TypeAnimation sequence={[
        "Free Iyana",
        "1000",

      ]} />

      <div className='flex flex-row justify-between'>
        {/* <Button text="Beep" onClick={handleBeep} /> */}

      </div>
      <div style={{ maxHeight: '500px', overflowY: 'auto', scrollbarColor: '#8CF349 black', scrollbarWidth: 'thin' }} className='flex flex-col'>
        {allCommands.map((command: Command, index: number) => {
          if (command.isInput) {
            return <span key={`${index}`} className='text-orange-500 w-screen'>{command.ip + command.pwd + ' $ ' + command.content}</span>
          }

          const commandsToDisplay = Array.isArray(command.content) ? command.content : [command.content];
          return commandsToDisplay.map((cmd, cmdIndex) => {
            return <span key={`${index}-${cmdIndex}`} className='text-lime-300 w-screen'>{cmd}</span>
          });

        })}
        {loading && <span className='text-lime-300 w-screen'>{spinner}</span>}

        <div ref={commandsEndRef} /> {/* This div will be used to scroll into view */}
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col justify-center md:flex-row text-orange-500 md:justify-start md:items-center">
        <div>

          {getCookie("ip")}{getCookie("cwd")}
        </div>
        <div className="flex flex-row pl-2 w-full items-center">
          $
          <input
            type="text"
            className='w-full bg-black text-lime-300 font-bold py-2 px-4 appearance-none focus:outline-none '
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
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