export const isPositiveInteger = (num) => {
    try {
        return Number.isSafeInteger(Number(num)) && Number(num) > 0;
    }catch (e) {
        return false;
    }
}