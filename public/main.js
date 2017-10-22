function RenderTable (data){
    var table = document.getElementById('maintable');
    table.innerHTML = `<thead class="table-head">
            <tr>
                <th>HID</th>
                <th>Наименование</th>
                <th>Адрес</th>
                <th>Телефон</th>
                <th>Действия</th>
            </tr>
        </thead>`
    console.log(data)
    data.LPU.map(item => {
        table.innerHTML += `
        <tbody >
            <tr id="${item.id}">
                <td>${item.hid}</td>
                <td>${item.full_name}</td>
                <td>${item.address}</td>
                <td>${item.phone}</td>
                <td>
                    <button type="button"  class="edit btn btn-secondary btn-sm" data-id=${item.id}>Изменить</button>
                    <button type="button" class="delete btn btn-secondary btn-sm" data-id=${item.id}>Удалить</button>
                </td>
            </tr>
        </tbody>`
    })

    //обработчика кнопок
    for(var i=0; i<data.LPU.length; i++){
        document.getElementsByClassName('edit')[i].addEventListener('click',function(e){
            var editable = data.LPU.filter(function (obj) {
                if(obj.id == e.target.dataset.id){return obj}
            })
            EditRow(editable[0]);
        })
        document.getElementsByClassName('delete')[i].addEventListener('click',function(e){
            DeleteRow(e.target.dataset.id);
        })
    }

    //фильтрция по HID
    checkbox = document.getElementById('checkbox')

    checkbox.addEventListener('change', function () {
        if(checkbox.checked){
            for (var i = 1; i< table.rows.length; i++){
                if (table.rows[i].children[0].innerHTML == 'null'){
                    console.log(table.rows[i].children[0].innerHTML);
                    table.rows[i].style.display= 'none';
                }
            }
        }else{
            for (var i = 1; i< table.rows.length; i++){
                if (table.rows[i].children[0].innerHTML == 'null'){
                    console.log(table.rows[i].children[0].innerHTML);
                    table.rows[i].style.display= '';
                }
            }
        }
    })
}


//запросы
function GetTable() {
    $.ajax({
        type: 'GET',
        url: '/api/get',
        success: function(res) {
            RenderTable(res)
        },
        error: function(err) {
            return console.log(err);
        }
    })
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
    $.ajax({
        url: '/api/delete/'+id,
        type: 'DELETE',
        success: function(res) {
            RenderTable(res)
        },
        error: function(err) {
            return console.log(err);
        }
    })
}

function EditRow(element) {
    let name = prompt("Наименование",element.full_name);
    let address = prompt("Возраст",element.address);
    let phone = prompt("Номер",element.phone);

    $.ajax({
        url: '/api/put/'+element.id,
        type: 'PUT',
        data: {name: name, address:address, phone:phone},
        success: function(res) {
            RenderTable(res)
        },
        error: function(err) {
            return console.log(err);
        }
    })
}

GetTable()
