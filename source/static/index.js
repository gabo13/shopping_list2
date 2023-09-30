
const sbmtBtn = document.getElementById("submit");
const saveBtn = document.getElementById("save_btn");


function showDialog(msg) {
    const dialog = document.getElementById("dialog");
    dialog.querySelector("p").innerText=msg;
    dialog.showModal();
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
        console.log(element);
        htmlTemp += `<p data-id="${element.id}">${element.name}<p>`;
    });
    document.getElementById("kell").innerHTML = htmlTemp;
}

let data = [];

window.addEventListener('load', (event) => {
    const status = document.getElementById("net_status");
    status.innerText = navigator.onLine ? "Online" : "Offline";
    fetch("/api")
        .then(response => response.json())
        .then(responseJson => {
            data = responseJson;
            render(responseJson);
        })
        .catch(error => {
            console.error(error);
        })
});

saveBtn.addEventListener('click', (event) => {
    postData('/api/cmd', { "cmd": "save" })
});

function addProduct(event) {
    event.preventDefault();
    
    const formData = new FormData(document.getElementById("mainform"));
    const product = formData.get("product");

    if (product) {
        postData('/api', { name: product })
            .then((responseJson) => {
                render(responseJson);
            })
            .catch((error) => {
                console.error(error);
            })
    } else {
        showDialog("Hiba");
    }
}

sbmtBtn.addEventListener('click', addProduct);