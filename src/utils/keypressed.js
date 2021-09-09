
export function handleKeyboard(funcs = {
    space: () => { },
    1: () => { },
    2: () => { },
    3: () => { },
    s: () => { },
}) {
    document.addEventListener("keydown", function (event) {
        var key = event.code || event.keyCode;
        switch (key) {
            case 'Space':
            case 32:
                funcs['space']();
                break;
            case 'Digit1':
            case 'Numpad1':
            case 49:
            case 97:
                funcs[1]();
                break;
            case 'Digit2':
            case 'Numpad2':
            case 50:
            case 98:
                funcs[2]();
                break;
            case 'Digit3':
            case 'Numpad3':
            case 51:
            case 99:
                funcs[3]();
                break;
            case 'KeyS':
            case 83:
                funcs['s']();
                break;
        }
    });
}
