import { useState, useEffect } from 'react';

export interface KeyboardVisibility {
    isKeyboardVisible: boolean;
    keyboardOffset: number;
}

const useKeyboardVisibility = (): KeyboardVisibility => {
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [keyboardOffset, setKeyboardOffset] = useState(0);

    useEffect(() => {
        if (typeof window === 'undefined' || !window.visualViewport) return;

        const handleResize = () => {
            const { height, offsetTop } = window.visualViewport!;
            const windowHeight = window.innerHeight;

            if (height < windowHeight) {
                setIsKeyboardVisible(true);
                setKeyboardOffset(windowHeight - height - offsetTop);
            } else {
                setIsKeyboardVisible(false);
                setKeyboardOffset(0);
            }
        };

        window.visualViewport.addEventListener('resize', handleResize);
        window.visualViewport.addEventListener('scroll', handleResize);
        handleResize();

        return () => {
            window.visualViewport!.removeEventListener('resize', handleResize);
            window.visualViewport!.removeEventListener('scroll', handleResize);
        };
    }, []);

    return { isKeyboardVisible, keyboardOffset };
};

export default useKeyboardVisibility;
