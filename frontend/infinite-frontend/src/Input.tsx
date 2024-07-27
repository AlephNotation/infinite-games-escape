import React, { forwardRef } from 'react'; // Import forwardRef
import './input.css'


const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => { // Specify ref type
    return (
        <>
            <input
                ref={ref} // Attach the ref to the input
                type="text"
                className="bg-black text-lime-300 font-bold py-2 px-4 mb-4 mr-4 appearance-none focus:outline-none caret-lime-300 test" // Added caret class

                // className="bg-black text-lime-300 font-bold py-2 px-4 mb-4 mr-4 appearance-none focus:outline-none caret-lime-300 test" // Added caret class
                style={{ position: 'relative', zIndex: 1, fontFamily: 'monospace', height: '1.5em', width: '300px', paddingLeft: '10px' }} // Adjusted padding
            />
            <div className="custom-caret">            </div>
        </>

    );
});

export default Input;