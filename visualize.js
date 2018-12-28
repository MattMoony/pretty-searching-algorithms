function sleep(ms) {
    return new Promise(resolve => window.setTimeout(resolve, ms));
}
function refresh(comp, cu_el) {
    document.getElementById('current_element').innerHTML = cu_el !== undefined ? cu_el : '-';

    document.getElementById('comparisons').innerHTML = comp;
    document.getElementById('runtime').innerHTML = ((new Date()).getTime() - glob_stime) / 1000.0;
}
function changeTheme(theme) {
    var xhtp = new XMLHttpRequest();
    xhtp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementsByTagName('style')[0].innerHTML = this.responseText;
        }
    }

    var avThemes = ["dark", "light"];
    if (!avThemes.includes(theme))
        return -1;

    glob_theme = theme;
    if (document.getElementById('theme_in')!==null)
        document.getElementById('theme_in').value = theme;

    window.history.pushState(`${theme.toUpperCase()}-THEME`, 'Changed theme ... ', `${theme}`);

    xhtp.open("GET", "themes/" + theme + ".css");
    xhtp.send();
}

function create_array_random(amount, upper, lower) {
    arr = [];

    lower = lower || glob_lower;
    upper = upper || glob_upper;

    for (let i = 0; i < amount; i++)
        arr.push(lower + Math.floor(Math.random() * (upper - lower)));

    return arr;
}

function create_array_semi_random(amount, upper, lower) {
    arr = [...Array(upper).keys()].splice(lower);

    for (let i = 0; i < arr.length; i++) {
        let temp = arr[i],
            rindex = Math.floor(Math.random() * arr.length);

        arr[i] = arr[rindex];
        arr[rindex] = temp;
    }

    return arr;
}

function display_array_pillars(arr) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let scale = canvas.height / Math.max(...arr);

    for (let i = canvas.width / (arr.length - 1); i < canvas.width; i += canvas.width / (arr.length - 1)) {
        ctx.beginPath();
        ctx.strokeStyle = glob_themes[glob_theme]["color"];
        ctx.lineWidth = 4;

        ctx.moveTo(i, canvas.height);
        ctx.lineTo(i, canvas.height - (arr[Math.floor(i / (canvas.width / (arr.length - 1)))] * scale));
        ctx.stroke();
    }
}
function display_array_pillar_spiral(arr) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 360/(arr.length-1), c = 0; i < 360; i+=360/(arr.length-1), c++) {
        ctx.beginPath();
        ctx.strokeStyle = glob_themes[glob_theme]["color"];
        ctx.lineWidth = 4;

        ctx.moveTo(canvas.width/2, canvas.height/2);
        ctx.lineTo((canvas.width/2) + arr[c] *Math.cos(Math.PI*i/180.0), (canvas.height/2) + arr[c] *Math.sin(Math.PI*i/180.0));
        ctx.stroke();
    }
}

function draw_pillar(x1, y1, x2, y2, color, thickness) {
    color = color || glob_themes[glob_theme]["color"];
    thickness = thickness || 4;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.stroke();
}
function display_pillars(arr, cu_el_i, l, r, cu_el_color, f_area_color) {
    cu_el_color = cu_el_color || "tomato";
    f_area_color = f_area_color || "#ffcccc";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let scale = canvas.height / Math.max(...arr);

    // -- DRAW NOT FOCUSED -- //
    for (let i = canvas.width / (arr.length+1); i <= (l+1) * (canvas.width/(arr.length+1)); i += canvas.width / (arr.length+1)) {
        draw_pillar(i, canvas.height, i, canvas.height - (arr[Math.floor(i / (canvas.width / (arr.length+1)))-1] * scale));
    }
    for (let i = (r + 2) * (canvas.width / (arr.length+1)); i <= canvas.width; i += canvas.width / (arr.length+1)) {
        draw_pillar(i, canvas.height, i, canvas.height - (arr[Math.floor(i / (canvas.width / (arr.length+1)))-1] * scale));
    }

    // -- DRAW FOCUSED -- //
    for (let i = (l + 1) * (canvas.width / (arr.length+1)); i <= (r + 2) * (canvas.width / (arr.length+1)); i += canvas.width / (arr.length+1)) {
        draw_pillar(i, canvas.height, i, canvas.height - (arr[Math.floor(i / (canvas.width / (arr.length+1)))-1] * scale), f_area_color);
    }

    // -- DRAW CURRENT ELEMENT(S) -- //
    if (cu_el_i) {
        if (typeof cu_el_i == "number") {
            cu_x = (cu_el_i + 1) * (canvas.width / (arr.length+1));
            draw_pillar(cu_x, canvas.height, cu_x, canvas.height - (arr[cu_el_i] * scale), cu_el_color, 4);
        } else {
            cu_el_i.forEach(v => {
                cu_x = (v + 1) * (canvas.width / (arr.length+1));
                draw_pillar(cu_x, canvas.height, cu_x, canvas.height - (arr[v] * scale), cu_el_color, 4);
            });
        }
    }
}
// function display_pillar_spiral(arr, cu_el_i, l, r, cu_el_color, f_area_color) {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     for (let i = 360/(arr.length-1), c = 0; i < 360; i+=360/(arr.length-1), c++) {
//         ctx.beginPath();
//         ctx.strokeStyle = "black";
//         ctx.moveTo(canvas.width/2, canvas.height/2);
//         ctx.lineTo((canvas.width/2) + arr[c] *Math.cos(Math.PI*i/180.0), (canvas.height/2) + arr[c] *Math.sin(Math.PI*i/180.0));
//         ctx.stroke();
//     }
// }


async function doSearchingAlgo(f) {
    document.getElementById('algorithm_settings').style.display = "none";
    glob_comp = 0;

    refresh(0);
    rarr = glob_random_func(glob_amount, glob_upper, glob_lower, glob_display_func);
    key = rarr[Math.floor(Math.random() * rarr.length)];

    document.getElementById('searched_element').innerHTML = key;

    glob_display_func(rarr);
    await sleep(Math.floor(glob_sleep_time / 2));

    await f(rarr, key);

    glob_comp = 0;
    document.getElementById('algorithm_settings').style.display = "block";
}

async function doBinarySearch(rarr, key) {
    // -- QUICK SORT -- //
    document.getElementById('algorithm_div').innerHTML = "QuickSort";
    if (glob_show_sorting)
        await qSort(rarr, 0, rarr.length - 1, glob_display_func);
    else
        await qSort_noDisplay(rarr, 0, rarr.length - 1);

    // -- BINARY SEARCH -- //
    document.getElementById('algorithm_div').innerHTML = "BinarySearch";
    await binarySearch(rarr, key, 0, rarr.length - 1, glob_search_display_func);
}
async function doInterpolationSearch(rarr, key) {
    // -- QUICK SORT -- //
    document.getElementById('algorithm_div').innerHTML = "QuickSort";
    if (glob_show_sorting)
        await qSort(rarr, 0, rarr.length - 1, glob_display_func);
    else
        await qSort_noDisplay(rarr, 0, rarr.length - 1);

    // -- INTERPOLATION SEARCH -- //
    document.getElementById('algorithm_div').innerHTML = "InterpolationSearch";
    await interpolationSearch(rarr, key, 0, rarr.length - 1, glob_search_display_func);
}
async function doLinearSearch(rarr, key) {
    // -- LINEAR SEARCH -- //
    document.getElementById('algorithm_div').innerHTML = "LinearSearch";
    await linearSearch(rarr, key, 0, rarr.length - 1, glob_search_display_func);
}
async function doJumpSearch(rarr, key) {
    // -- QUICK SORT -- //
    document.getElementById('algorithm_div').innerHTML = "QuickSort";
    if (glob_show_sorting)
        await qSort(rarr, 0, rarr.length - 1, glob_display_func);
    else
        await qSort_noDisplay(rarr, 0, rarr.length - 1);

    // -- JUMP SEARCH -- //
    document.getElementById('algorithm_div').innerHTML = "JumpSearch";
    await jumpSearch(rarr, key, undefined, glob_search_display_func);
}
async function doExponentialSearch(rarr, key) {
    // -- QUICK SORT -- //
    document.getElementById('algorithm_div').innerHTML = "QuickSort";
    if (glob_show_sorting)
        await qSort(rarr, 0, rarr.length - 1, glob_display_func);
    else
        await qSort_noDisplay(rarr, 0, rarr.length - 1);

    // -- EXPONENTIAL SEARCH -- //
    document.getElementById('algorithm_div').innerHTML = "ExponentialSearch";
    await exponentialSearch(rarr, key, glob_search_display_func);
}
async function doFibonacciSearch(rarr, key) {
    // -- QUICK SORT -- //
    document.getElementById('algorithm_div').innerHTML = "QuickSort";
    if (glob_show_sorting)
        await qSort(rarr, 0, rarr.length - 1, glob_display_func);
    else
        await qSort_noDisplay(rarr, 0, rarr.length - 1);

    // -- FIBONACCI SEARCH -- //
    document.getElementById('algorithm_div').innerHTML = "FibonacciSearch";
    await fibonacciSearch(rarr, key, 0, rarr.length - 1, glob_search_display_func);
}
async function doDoubleLinearSearch(rarr, key) {
    // -- DOUBLE LINEAR SEARCH -- //
    document.getElementById('algorithm_div').innerHTML = "DoubleLinearSearch";
    await doubleLinearSearch(rarr, key, 0, rarr.length - 1, glob_search_display_func);
}


// ------------------------------ GLOBALS ------------------------------------------------------------- //

var glob_amount = 128,
    glob_lower = 0,
    glob_upper = 150,
    glob_sorting_sleep_time = 1,
    glob_sleep_time = 250,
    glob_sleep_between = 1000,
    glob_display_func = display_array_pillars,
    glob_search_display_func = display_pillars,
    glob_random_func = create_array_random,
    glob_stime = (new Date()).getTime(),
    glob_show_sorting = true,
    glob_theme = "light",
    glob_themes = {
        "light" : {
            "color": "dimgray"
        },
        "dark" : {
            "color": "whitesmoke"
        }
    };

var glob_comp = 0;

// ---------------------------------------------------------------------------------------------------- //

function visualize_init() {
    document.getElementById('pause_input').innerHTML = glob_sleep_time;
    doSearchingAlgo(doInterpolationSearch);
}