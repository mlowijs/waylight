const ipc = require('electron').ipcRenderer;

const MAX_BINS = 10;

var binaries = [];
var filteredList = [];
var selectedItem = 0;

const searchInput = document.getElementById("searchText");
searchInput.focus();

searchInput.addEventListener("keyup", (e) => {
    console.log(e);

    if (e.key === "ArrowUp" || e.key === "ArrowDown")
        handleArrowKeys(e.key);
    else if (e.key === "Enter")
        handleEnter();
    else
        handleKeys(e);
});

function handleKeys(e) {
    var value = e.target.value;
    filteredList = binaries.filter(b => b[1].startsWith(value)).slice(0, MAX_BINS);
    selectedItem = 0;

    if (value.length > 0 && filteredList.length > 0) {
        renderList();
    } else {
        resultsDiv.style.display = "none";
    }
}

function renderList() {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = null;

    for (var i = 0; i < MAX_BINS; i++) {
        const bin = filteredList[i];
        const div = document.createElement("div");
        div.classList.add("result");
        div.innerText = bin[1];

        if (i === selectedItem)
            div.classList.add("selected");

        resultsDiv.appendChild(div);
    }

    resultsDiv.style.display = "block";
}

function handleEnter() {
    if (filteredList.length === 0)
        return;

    ipc.send("exec", filteredList[selectedItem]);
}

function handleArrowKeys(key) {
    if (key == "ArrowUp" && selectedItem > 0)
        selectedItem--;
    else if (key === "ArrowDown" && selectedItem < MAX_BINS - 1)
        selectedItem++;

    renderList();
}

ipc.on("binaries", (ev, arg) => {
    binaries = arg;
});

document.addEventListener("keydown", e => {
    if (e.key === "Escape")
        ipc.send("exit");
});