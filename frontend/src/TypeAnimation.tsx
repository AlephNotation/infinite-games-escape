import { TypeAnimation } from 'react-type-animation';

const ExampleComponent = (props: { sequence: string[] }) => {
    return (
        <TypeAnimation
            sequence={props.sequence}
            wrapper="span"
            speed={50}
            style={{ fontSize: '1.5em', display: 'inline-block', marginBottom: '10px', marginTop: '10px' }}
            repeat={Infinity}
            omitDeletionAnimation={true}
        />
    );
};
export default ExampleComponent;