var tableData;


function RenderTable (data, hids){
    console.log(data)
    var table = document.getElementById('maintable');
    table.innerHTML = `<thead class="table-head">
            <tr>
                <th>Свернуть/развернуть</th>
                <th>Наименование</th>
                <th>Адрес</th>
                <th>Телефон</th>
                <th>Действия</th>
            </tr>
        </thead>`
    data.LPU.map(item => {
        table.innerHTML += `
        <tbody id="${item.id}" >
            <tr>
                <td>+</td>
                <td>${item.full_name ? item.full_name : ''}</td>
                <td>${item.address ? item.address : ''}</td>
                <td>${item.phone ? item.phone : ''}</td>
                <td>
                    <button type="button"  class="edit btn btn-secondary btn-sm"
                    onclick="EditRow(${item.id})">Изменить</button>
                    <button type="button" class="delete btn btn-secondary btn-sm" 
                    onclick="DeleteRow(${item.id})">Удалить</button>
                </td>
            </tr>
        </tbody>`
    })
}


//запросы
function GetTable() {
    $.ajax({
        type: 'GET',
        url: '/api/get',
        success: function(res) {
            tableData=res;
            var hids = HIDshandler(res);
            RenderTable(res,hids);
        },
        error: function(err) {
            return console.log(err);
        }
    })
}

function HIDshandler(data) {
    var hids={}
    data.LPU.forEach(item=>{
        var k= item.hid;
        hids[k]=true;
    })
    return Object.keys(hids)
}

//добавление записи в таблицу
document.getElementById('add-submit').addEventListener('click', function(){
    let element = {
        full_name:document.getElementById('add-name').value,
        address:document.getElementById('add-address').value,
        phone:document.getElementById('add-phone').value,
        hid:document.getElementById('add-hid').value
    }
    console.log(element);
    $.ajax({
        url: '/api/post/',
        type: 'POST',
        data: element,
        success: function(res) {
            RenderTable(res)
        },
        error: function(err) {
            return console.log(err);
        }
    })
});


function DeleteRow(id) {
    console.log(id);
    $.ajax({
        url: '/api/delete/'+id,
        type: 'DELETE',
        success: function(res) {
            if (res.status == "OK"){
                console.log(document.getElementById(id))
                document.getElementById(id).remove();
            }
        },
        error: function(err) {
            return console.log(err);
        }
    })
}

function EditRow(id) {

    let element = tableData.LPU.filter(function (item) {
        if (item.id == id) return item;
    })

    console.log(element[0])
    let hid = prompt("HID",element[0].hid);
    let name = prompt("Наименование",element[0].full_name);
    let address = prompt("Адресс",element[0].address);
    let phone = prompt("Номер",element[0].phone);

    $.ajax({
        url: '/api/put/'+element[0].id,
        type: 'PUT',
        data: {hid: hid, name: name, address:address, phone:phone},
        success: function(res) {
            if (res.status == "OK"){
                document.getElementById(id).innerHTML = `
                <tr>
                    <td>${hid}</td>
                    <td>${name}</td>
                    <td>${address}</td>
                    <td>${phone}</td>
                    <td>
                        <button type="button"  class="edit btn btn-secondary btn-sm"
                        onclick="EditRow(${element[0].id})">Изменить</button>
                        <button type="button" class="delete btn btn-secondary btn-sm" 
                        onclick="DeleteRow(${element[0].id})">Удалить</button>
                    </td>
                </tr>
                `
            }
        },
        error: function(err) {
            return console.log(err);
        }
    })
}

GetTable();
