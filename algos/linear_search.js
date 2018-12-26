async function linearSearch(a, k, l, r, display) {
    for (let i = l; i <= r; i++) {
        glob_comp++;

        refresh(glob_comp, a[i]);

        display(a, i, i, r);
        await sleep(glob_sleep_time);

        if (a[i] == k)
            return new Promise(resolve => resolve(a[i]));
    }

    return new Promise(resolve => resolve(-1));
}