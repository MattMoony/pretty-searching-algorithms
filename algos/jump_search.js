async function jumpSearch(a, k, block, display) {
    block = block || Math.floor(Math.sqrt(a.length));
    let pe = 0;

    for (let i = block; i < a.length; i += block) {
        glob_comp += 2;
        refresh(glob_comp);

        display(a, undefined, pe, i);
        await sleep(glob_sleep_time);

        if (a[pe] <= k && k <= a[i]) {
            let re = await linearSearch(a, k, pe, i, display);
            return new Promise(resolve => resolve(re));
        }

        pe = i;
    }

    let re = await linearSearch(a, k, pe, a.length-1, display);
    return new Promise(resolve => resolve(re));
}