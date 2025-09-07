export const UseDebounce = (fn, delay) => {
    let timer;
    return function (...param) {
        clearTimeout(timer);
        timer = setTimeout(() =>fn.apply(this, param), delay);
    };
}