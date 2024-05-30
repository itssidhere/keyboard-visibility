"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useKeyboardVisibility = function () {
    var _a = (0, react_1.useState)(false), isKeyboardVisible = _a[0], setIsKeyboardVisible = _a[1];
    var _b = (0, react_1.useState)(0), keyboardOffset = _b[0], setKeyboardOffset = _b[1];
    (0, react_1.useEffect)(function () {
        var handleResize = function () {
            if (window.visualViewport) {
                var _a = window.visualViewport, height = _a.height, offsetTop = _a.offsetTop;
                var windowHeight = window.innerHeight;
                if (height < windowHeight) {
                    setIsKeyboardVisible(true);
                    setKeyboardOffset(windowHeight - height - offsetTop);
                }
                else {
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
        return function () {
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', handleResize);
                window.visualViewport.removeEventListener('scroll', handleResize);
            }
        };
    }, []);
    return { isKeyboardVisible: isKeyboardVisible, keyboardOffset: keyboardOffset };
};
exports.default = useKeyboardVisibility;
