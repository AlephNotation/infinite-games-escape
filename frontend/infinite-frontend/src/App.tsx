import Button from './Button'
import Input from './Input'
import TypeAnimation from './TypeAnimation'
import { useRef, useEffect } from 'react'; // Add useRef and useEffect
import useStore from './Session';


function App() {
  const inputRef = useRef(null); // Create a ref for the input
  const { setCookie, getCookie } = useStore();
  setCookie("username", "john_doe", 7);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Focus the input on load
    }
  }, []);
  const typeAnimationSequence = ['Time to take over the world', 1000, 'it might be to take over the world', 1000]
  return (
    <div className='text-lime-300 h-full h-screen w-screen relative bg-black p-10 flex flex-col' style={{ fontFamily: 'Courier New, monospace' }} >
      <h1 className='text-lime-300 text-4xl font-bold mb-2'>Welcome to the Terminal</h1>
      <div className='flex flex-row justify-between'>
        <Button text="Root" />
        <Button text="Start" />
        <Button text="Hack" />
        <Button text="Help" />
        <Button text="Exit" />
      </div>

      <br></br>
      <TypeAnimation sequence={typeAnimationSequence} />
      <span className='text-lime-300 w-screen'>
        $
        <Input ref={inputRef} />
      </span>

    </div>
  )
}

export default App
