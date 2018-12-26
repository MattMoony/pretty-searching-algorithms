async function qSort(a, l, r, display) {
    var p = r,
        old_l = l;

    while (l < r) {
        while (l < r && a[l] <= a[p]) {
            l++;
            glob_comp++;
        }
        while (r > l && a[r] >= a[p]) {
            r--;
            glob_comp++;
        }

        var t = a[l];
        a[l] = a[r];
        a[r] = t;

        refresh(glob_comp);
        display(a);
        await sleep(glob_sorting_sleep_time);
    }

    t = a[l];
    a[l] = a[p];
    a[p] = t;

    refresh(glob_comp);
    await sleep(glob_sorting_sleep_time);

    if (l - 1 - old_l >= 1) {
        await qSort(a, old_l, l - 1, display);
    }
    if (p - (l + 1) >= 1) {
        await qSort(a, l + 1, p, display);
    }
}
async function qSort_noDisplay(a, l, r) {
    var p = r,
        old_l = l;

    while (l < r) {
        while (l < r && a[l] <= a[p]) {
            l++;
            glob_comp++;
        }
        while (r > l && a[r] >= a[p]) {
            r--;
            glob_comp++;
        }

        var t = a[l];
        a[l] = a[r];
        a[r] = t;

        refresh(glob_comp);
    }

    t = a[l];
    a[l] = a[p];
    a[p] = t;

    refresh(glob_comp);

    if (l - 1 - old_l >= 1) {
        await qSort_noDisplay(a, old_l, l - 1);
    }
    if (p - (l + 1) >= 1) {
        await qSort_noDisplay(a, l + 1, p);
    }
}