
/***************
 * HTML ELEMENTS FOR JAVA SCRIPT 
 ***************/
// 
const addBtn = document.getElementById("add_btn");
const saveBtn = document.getElementById("save_btn");
const productBox = document.getElementById("product");
const statusSign = document.getElementById("net_status");
let data;
let statusInterval = setInterval(onlineCheck,3000);


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
/****************
 *  OTHER FUNCTIONS
 ****************/

function showDialog(msg) {
    //SHOW DIALOG MESSAGE
    const dialog = document.getElementById("dialog");
    dialog.querySelector("p").innerText = msg;
    dialog.showModal();
}

async function getData(url) {
    const response = await fetch(url);
    return response.json();
}

function productBuy(elem) {
    console.log("buy");
    console.log(elem.parentElement.dataset);
}

function productEdit(elem) {
    console.log("edit");
    console.log(elem.parentElement.dataset);
}

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
    })
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

function render(data) {
    let htmlTemp_pending = "";
    data["pending"].forEach(element => {
        //console.log(element);
        htmlTemp_pending += `<p data-id="${element.id}">
                    ${element.name}
                    <img class="image_icons" src="/img/to_basket.svg" alt="buy" onclick="productBuy(this)">
                    <img class="image_icons" src="/img/edit.svg" alt="edit" onclick="productEdit(this)">
                    <img class="image_icons" src="/img/delete.svg" alt="edit" onclick="productDelete(this)">
                    <p>`;
    });
    let htmlTemp_ready =""
    data["ready"].forEach(element => {
        //console.log(element);
        htmlTemp_ready += `<p data-id="${element.id}">
                    ${element.name}
                    <img class="image_icons" src="/img/edit.svg" alt="edit" onclick="productEdit">
                    <img class="image_icons" src="/img/delete.svg" alt="edit" onclick="productDelete">
                    <p>`;
    });
    document.getElementById("pending").innerHTML = htmlTemp_pending;
    document.getElementById("ready").innerHTML = htmlTemp_ready;
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
        showDialog("Hiba! Üres a termék mező!");
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