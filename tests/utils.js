export function arrayEquals(a, b) {
    if (a === b) return true;
    if (a.length !==  b.length) return false;

    a.sort();
    b.sort();

    return a.every((val, i) => val === b[i]);
}

export function coordEquals(a, b) {
    if (a === b) return true;
    if (a.length !==  b.length) return false;

    a.sort();
    b.sort();
    
    for (let i = 0; i < a.length; i++) {
        if (a[i][0] !== b[i][0] || a[i][1] !== b[i][1])
            return false;
    }
    return true;
}