
const sbmtBtn = document.getElementById("submit");
const saveBtn = document.getElementById("save_btn");


async function postData(url, data={}){
    const response = await fetch(url,{
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

window.addEventListener('load',(event)=>{
    const status = document.getElementById("net_status");
    status.innerText = navigator.onLine ? "Online" : "Offline";
});

saveBtn.addEventListener('click', (event)=>{
    postData('/api/cmd',{cmd:"save"})
});

sbmtBtn.addEventListener('click',(event)=>{
    event.preventDefault();

    const formData = new FormData(document.getElementById("mainform"));
    const product = formData.get("product");
    
    postData('/api', {name:product})
    .then((responseJson)=>{
         let htmlTemp = "";
        responseJson.forEach(element => {
            console.log(element);
            htmlTemp += `<p data-id="${element.id}">${element.name}<p>`;
        });
        document.getElementById("kell").innerHTML = htmlTemp;
    })
    .catch((error)=>{
        console.error(error);
    })
});