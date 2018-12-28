const express = require('express'),
    app = express(),
    path = require('path'),
    fs = require('fs'),
    config = require('./config.json');

app.get('/index.css', (req, res) => {
    res.sendFile(path.join(__dirname, "index.css"));
});
app.get('/visualize.js', (req, res) => {
    res.sendFile(path.join(__dirname, "visualize.js"));
});

app.use("/themes", express.static(path.join(__dirname, "themes/")));
app.use("/algos", express.static(path.join(__dirname, "algos/")));
app.use("/sorting_algos", express.static(path.join(__dirname, "sorting_algos/")));

app.get('/:theme', (req, res) => {
    switch (req.params.theme) {
        case 'dark':
            {
                fs.readFile(path.join(__dirname, "index.html"), (err, data) => {
                    if (err) throw err;
                    
                    let script = "changeTheme(\"dark\");";
                    res.send(data.toString().substring(0, data.toString().lastIndexOf('</script>')) + script + 
                        data.toString().substring(data.toString().lastIndexOf('</script>')));
                });
            }
            break;
        default:
            res.sendFile(path.join(__dirname, "index.html"));
            break;
    }
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(config.port, () => console.log(` [WEBSERVER]: Listening on :${config.port} ... `));