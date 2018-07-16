export default function isWeakInteger(x) {
    return !isNaN(x)
        // eslint-disable-next-line
        && parseInt(x, 10) == x;
}
