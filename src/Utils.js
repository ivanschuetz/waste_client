export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const groupBy = function (arr, criteria) {
    return arr.reduce(function (obj, item) {
        const key = item[criteria];
        if (!obj.hasOwnProperty(key)) {
            obj[key] = [];
        }
        obj[key].push(item);
        return obj;

    }, {});
};
