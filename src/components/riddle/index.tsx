import { useState, useEffect } from 'react';
import styled from 'styled-components';
import colors from '../../assets/colors';
import { RiCloseLargeFill } from "react-icons/ri";
import { Button } from '../main-button/components';
import { useAuth } from '../../auth/useAuth';

const Highlight = styled.span`
    transition: background-color 0.3s ease;
    cursor: pointer;

    &:hover {
        background-color: yellow;
    }
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: transparent;
    color: ${colors.primary};

    &:hover {
        background-color: transparent;
        color: ${colors.primary};
        opacity: 0.6;
        scale: 1.1;
    }
`;

const EasterEggRiddle = ({ closeRiddle, successEasterEggMessage }: { closeRiddle?: () => void, successEasterEggMessage?: () => void}) => {
    const [isRevealed, setIsRevealed] = useState(false);
    const { updateUser} = useAuth();

    const handleReveal = () => {
        setIsRevealed(true);
    };

    useEffect(() => {
        const handleKeyCombination = async (event: KeyboardEvent) => {
            if (event.ctrlKey && event.shiftKey && event.key === 'E') {
                successEasterEggMessage?.();
                updateUser({hasFoundEasterEgg: true})
            }
        };
        window.addEventListener('keyup', handleKeyCombination);
        
        return () => {
            window.removeEventListener('keyup', handleKeyCombination);
        };
    }, [successEasterEggMessage, updateUser]);

    return (
        <>
        <div tabIndex={0}>
            {!isRevealed ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ fontWeight: '500', fontSize: '20px' }}>You found the secret!</p>
                    <Button secondary onClick={handleReveal}>Discover the Riddle</Button> 
                </div>
            ) : (
                <CloseButton onClick={closeRiddle}><RiCloseLargeFill /></CloseButton>
            )}
            {isRevealed && (
                <div>
                    <h3>Riddle:</h3>
                    <p>
                        In a world where every choice matters, three keys will guide your journey. <br />
                        1. The first is found in <Highlight>con</Highlight>versations, where opinions can <Highlight>trol</Highlight>erate to create harmony. <br />
                        2. The second awaits in <Highlight>alt</Highlight>ernative paths, reminding you that there’s more than one way to reach your goal. <br />
                        3. The third is a simple yet vital letter, often overlooked but essential for clarity and understanding. <br />
                        <strong>Put them together, and you will unlock the secret door. What are they?</strong>
                    </p>
                </div>
            )}
        </div>
        </>
    );
};

export default EasterEggRiddle;
