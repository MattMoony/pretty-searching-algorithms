async function doubleLinearSearch(a, k, l, r, display) {
    display(a, l, l, r);
    await sleep(glob_sleep_time);

    if (l > r) {
        glob_comp++;
        refresh(glob_comp);

        return new Promise(resolve => resolve(-1));
    } else if (a[l] == k) {
        glob_comp += 2;
        refresh(glob_comp, a[l]);

        return new Promise(resolve => resolve(l));
    } else if (a[r] == k) {
        glob_comp += 3;
        refresh(glob_comp, a[r]);

        return new Promise(resolve => resolve(r));
    }

    display(a, r, l, r);
    await sleep(glob_sleep_time);

    glob_comp += 3;
    refresh(glob_comp, a[r]);

    return doubleLinearSearch(a, k, l + 1, r - 1, display);
}