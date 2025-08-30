export function avg(array) {
    return (
        array.reduce((sum, currentValue) => sum + currentValue, 0) /
        array.length
    );
}
