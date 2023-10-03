
/***************
 * HTML ELEMENTS FOR JAVA SCRIPT 
 ***************/
// 
const addBtn = document.getElementById("submit");
const saveBtn = document.getElementById("save_btn");
const productBox = document.getElementById("product");
const statusSign = document.getElementById("net_status");
let data = [];
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

function render(data = []) {
    let htmlTemp = "";
    data.forEach(element => {
        //console.log(element);
        htmlTemp += `<p data-id="${element.id}">${element.name}<p>`;
    });
    document.getElementById("kell").innerHTML = htmlTemp;
}

function addProduct(product) {

    console.info("product add: ", product);
    if (product) {
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
        showDialog("Hiba!");
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