const date = Date.now();

function hashCode(s) {
    // See: https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
    return s.split('')
        .reduce((a, b) => {
            // eslint-disable-next-line no-bitwise
            const x = ((a << 5) - a) + b.charCodeAt(0);
            // eslint-disable-next-line no-bitwise
            return x & x;
        }, 0);
}

export default function randomFieldId(s) {
    return hashCode(s) + date;
}
