const { validatePassword } = require('./register_case.js');

test('Canary Test', () => {
  expect(true).toBe(true);
});


describe('register test', () => {
    let passwordElement;

    beforeEach(() => {
        passwordElement = document.createElement('input');
        passwordElement.type = 'password';
        global.passwordElement = passwordElement
    });

    afterEach(() => {
        delete global.passwordElement;
    });

    test('Validate Password In Registration Form', () =>{
        passwordElement.value = '';
        const result = validatePassword(passwordElement)
        expect(result).toBe(false);
        expect(passwordElement.classList.value).toBe('');
    })


})