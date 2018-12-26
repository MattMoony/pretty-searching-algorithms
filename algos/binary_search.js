async function binarySearch(a, k, l, r, display) {
    if (l>r || k<a[l] || k>a[r])
        return new Promise(resolve => resolve(-1));

    var pos = Math.floor((l+r)/2);

    refresh(glob_comp, a[pos]);

    display(a, pos, l, r);
    await sleep(glob_sleep_time);

    if (k>a[pos]) {
        glob_comp += 1;
        return await binarySearch(a, k, pos+1, r, display);
    }
    else if (k<a[pos]) {
        glob_comp += 2;
        return await binarySearch(a, k, l, pos-1, display);
    }
    else {
        glob_comp += 2;
        return new Promise(resolve => resolve(pos));
    }
} 