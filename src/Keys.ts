export const characters = [
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
    '!@#$%^&*()`~-_=+[{]}\\|;:\'",<.>/?',
].join('').split('');

export const all = characters.concat(
    'space enter tab backspace delete escape'
        .split(' '),

    'enter'
        .split(' ').map(key => `shift+${key}`),

    'bw'
        .split('').map(key => `alt+${key}`),

    'cruw'
        .split('').map(key => `ctrl+${key}`)
);
