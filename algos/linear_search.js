async function linearSearch(a, k, display) {
    for (let i = 0; i < a.length; i++) {
        glob_comp++;

        refresh(glob_comp, a[i]);

        display(a, i, i, a.length-1);
        await sleep(glob_sleep_time);

        if (a[i] == k)
            return new Promise(resolve => resolve(a[i]));
    }
}