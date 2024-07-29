interface ButtonProps {
    text: string;
    onClick: () => void; // Accept onClick prop
}

const Button: React.FC<ButtonProps> = ({ text, onClick }) => {
    return (
        <button onClick={onClick} className="bg-black text-lime-300 font-bold py-0 px-4 rounded border border-1 border-lime-300 mb-4 mr-4 hover:bg-lime-300 hover:text-black shadow-lg hover:shadow-xl transition-shadow duration-300">
            {text}
        </button>
    );
};


export default Button
