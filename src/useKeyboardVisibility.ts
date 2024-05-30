import { useState, useEffect } from 'react';

interface KeyboardVisibility {
    isKeyboardVisible: boolean;
    keyboardOffset: number;
}

const useKeyboardVisibility = (): KeyboardVisibility => {
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [keyboardOffset, setKeyboardOffset] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            if (window.visualViewport) {
                const { height, offsetTop } = window.visualViewport;
                const windowHeight = window.innerHeight;

                if (height < windowHeight) {
                    setIsKeyboardVisible(true);
                    setKeyboardOffset(windowHeight - height - offsetTop);
                } else {
                    setIsKeyboardVisible(false);
                    setKeyboardOffset(0);
                }
            }
        };

        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleResize);
            window.visualViewport.addEventListener('scroll', handleResize);
            handleResize(); // Initial check
        }

        return () => {
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', handleResize);
                window.visualViewport.removeEventListener('scroll', handleResize);
            }
        };
    }, []);

    return { isKeyboardVisible, keyboardOffset };
};

export default useKeyboardVisibility;
