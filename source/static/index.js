
/***************
 * HTML ELEMENTS FOR JAVA SCRIPT 
 ***************/
// 
const addBtn = document.getElementById("ID_addBtn");
const saveBtn = document.getElementById("ID_saveBtn");
const productBox = document.getElementById("ID_productName");
const statusSign = document.getElementById("ID_netStatus");
const buyDialog = document.getElementById("ID_buyDialog");
const buyForm = document.getElementById("ID_buyForm");
const buyDialogCancelBtn = document.getElementById("ID_cancelBtn");

let data;
let statusInterval = setInterval(onlineCheck,3000);
let modifiID;

/***************
 * EVENTS HANDLING
 ***************/
window.addEventListener('load', (event) => {
    // LOAD DATA FROM API WHEN WINDOWS LOAD
    getData("/api")
    .then(responseJson => {
        render(responseJson);
    })
    
});

saveBtn.addEventListener('click', (event) => {
    postData('/api/cmd', { "cmd": "save" })
    .then(responseJson => {
        console.log(responseJson);
    })
});

addBtn.addEventListener('click', (event) => {
    addProduct(productBox.value);
});

productBox.addEventListener('keypress',(event)=>{
    if (event.code == "Enter" || event.keyCode == 13) {
        addProduct(productBox.value);
    }
});


buyDialogCancelBtn.addEventListener("click", (event =>{
    event.preventDefault();
    buyDialog.close();
}))
/****************
 *  OTHER FUNCTIONS
 ****************/

function showMsgDialog(msg) {
    //SHOW DIALOG MESSAGE
    const dialog = document.getElementById("ID_msgDialog");
    dialog.querySelector("p").innerText = msg;
    dialog.showModal();
}


async function getData(url) {
    const response = await fetch(url);
    return response.json();
}


function productBuy(elem) {
    //apin keresztöl elküldjük külön az adatokat
    console.log("buy");
    modifiID = elem.parentElement.dataset.id;
    console.log();
    document.querySelectorAll(".clearable").forEach(item => {
        item.value = "";
    });
    buyDialog.showModal();
}

buyForm.addEventListener('submit', (event)=>{
    event.preventDefault();
    
    let formData = new FormData(buyForm);
    let formDataObj = {};
    formData.forEach((value,key) => (formDataObj[key] = value));
    formDataObj["id"] = Number(modifiID);
    let date = new Date()
    dateString = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
    formDataObj["buyDate"] = dateString;
    
    

    putData("/api/tobasket", formDataObj)
    .then(responseJson => {
        console.log(responseJson);
        render(responseJson);
    });

    buyDialog.close();
    
});

function getSum(data) {
    let sumPrice = 0;
    data["ready"].forEach(product=>{
        sumPrice += Number(product.buyCost.match(/\d+(\.\d+)?/g))
    })
    document.getElementById("ID_sum").innerText = sumPrice;
}


function productEdit(elem) {
    console.log("edit");
    console.log(elem.parentElement.dataset);
}

document.getElementById("ID_clearBtn").addEventListener("click",(event)=>{
    console.log("Clear pressed");
    if (confirm("Biztos törlöd?")) {
    postData('/api/cmd', { "cmd": "clear" })
    .then(responseJson => {
        render(responseJson)
    });
}
});

function productDelete(elem) {
    console.log("delete");
    console.log("/api/delete/"+elem.parentElement.dataset.id);
    fetch("/api/delete/"+elem.parentElement.dataset.id,{
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/JSON; charset=utf-8",
        }
    })
    .then(response => response.json())
    .then(responseJson => {
        data = responseJson;
        render(data);
    });
}

async function putData(url, data={}) {
    const response = await fetch(url, {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/JSON; charset=utf-8",
        },
        body: JSON.stringify(data),
    });
    return response.json();
}


async function postData(url, data = {}) {
    const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/JSON; charset=utf-8",
        },
        body: JSON.stringify(data),
    });
    return response.json();
}

function timestampToDate(ts) {
    let date =new Date(ts*1000);
    return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
    
}

function render(data) {
    let htmlTemp_pending = "";
    data["pending"].forEach(product => {
        //console.log(element);
        htmlTemp_pending += `<p data-id="${product.id}">
                    ${product.name}
                    <img class="image_icons" src="/img/to_basket.svg" alt="buy" onclick="productBuy(this)">
                    <img class="image_icons" src="/img/edit.svg" alt="edit" onclick="productEdit(this)">
                    <img class="image_icons" src="/img/delete.svg" alt="edit" onclick="productDelete(this)">
                    <p>`;
    });
    /* let htmlTemp_ready =""
    data["ready"].forEach(element => {
        htmlTemp_ready += `<p data-id="${element.id}">
                    ${element.name}
                    <img class="image_icons" src="/img/edit.svg" alt="edit" onclick="productEdit">
                    <img class="image_icons" src="/img/delete.svg" alt="edit" onclick="productDelete">
                    <p>`;
    }); */
    let htmlTemp_ready ="<table><thead><th>Dátum</th><th>Bolt</th><th>Termék</th><th>Mennyiség</th><th>Ár</th></thead>";
    data["ready"].forEach(product => {
        htmlTemp_ready += `<tr data-id="${product.id}">
        <td>${product.buyDate}</td>
        <td>${product.shop}</td>
        <td>${product.name}</td>
        <td>${product.buyAmount}</td>
        <td>${product.buyCost}</td>`
        htmlTemp_ready += `</tr>`
    });
    htmlTemp_ready += "</table>";

    document.getElementById("pending").innerHTML = htmlTemp_pending;
    document.getElementById("ready").innerHTML = htmlTemp_ready;
    getSum(data);
}

function addProduct(product) {
    if (product) {
        console.info("INFO: addProduct",product)
        postData('/api', { name: product })
            .then((responseJson) => {
                productBox.value = "";
                render(responseJson);
                productBox.focus();
            })
            .catch((error) => {
                console.error(error);
            })
    } else {
        showMsgDialog("Hiba! Üres a termék mező!");
    }
}

function onlineCheck() {
    //console.log("check");
    if (navigator.onLine) {
        statusSign.innerText = "Online";
        statusSign.style.color = "yellowgreen";
    } else {
        statusSign.innerText = "Offline";
        statusSign.style.color = "red";
    }
}