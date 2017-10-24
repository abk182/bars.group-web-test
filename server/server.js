var express = require('express'),
    app = express(),
    path = require('path'),
    fs = require('fs'),
    bodyParser = require('body-parser');

const file = fs.readFileSync(path.join(__dirname, './lpu.json'))
const table = JSON.parse(file)


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', express.static(path.join(__dirname,'../public/')));

app.get('/api/get', function(req, res) {
    table.LPU.sort(function (a) {
        if (a.hid) {
            return 1;
        } else return -1
    });
    res.send(table)
});

app.delete('/api/delete/:id', function(req, res) {
    console.log(req.params['id'])
    table.LPU = table.LPU.filter(function (obj) {
        if (obj.id != req.params.id){return obj}
    });
    fs.writeFileSync(path.join(__dirname,'./lpu.json'), JSON.stringify(table));
    res.send({status:"OK"});
});

app.put('/api/put/:id', function(req, res) {
    console.log(req.body);
    table.LPU.map(function (item) {
        if( item['id']==req.params['id']){
            item.hid = req.body.hid;
            item.full_name = req.body.name;
            item.address = req.body.address;
            item.phone = req.body.phone;
        }
    })
    fs.writeFileSync(path.join(__dirname,'./lpu.json'), JSON.stringify(table));
    res.send({status:"OK"})
});

app.post('/api/post/', function (req,res) {
    let element = req.body;
    element.id = +new Date();

    if (element.hid== "") {element.hid=null}
    table.LPU.push(element);
    fs.writeFileSync(path.join(__dirname,'./lpu.json'), JSON.stringify(table));
    res.send(table)
});


app.listen(3000,console.log('Server on 3000'));