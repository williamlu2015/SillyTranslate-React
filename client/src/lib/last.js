export default function last(array) {
    if (array.length === 0) {
        throw Error();
    }

    return array[array.length - 1];
}
