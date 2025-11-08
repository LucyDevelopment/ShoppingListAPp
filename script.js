import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://shoplistapp-b9c67-default-rtdb.europe-west1.firebasedatabase.app/",
  AppURI:
    "https://shoplistapp-b9c67-default-rtdb.europe-west1.firebasedatabase.app",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const itemsInDB = ref(database, "items");

const inputField = document.querySelector("#item");
const addBtn = document.querySelector("#add-btn");
const itemsBox = document.querySelector(".items");

fetch(`${appSettings.AppURI}/items.json`)
  .then((res) => res.json())
  .then((data) => {
    if (!data) return;
    Object.entries(data).map(([id, name]) => {
      itemsBox.innerHTML += `<button id="${id}" onclick="removeItem('${id}')" class='item'>${name}</button>`;
    });
  });

addBtn.addEventListener("click", async () => {
  const name = inputField.value;
  if (!name) return;

  await fetch(`${appSettings.AppURI}/items.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(name),
  });

  itemsBox.innerHTML = "";

  await fetch(`${appSettings.AppURI}/items.json`)
    .then((res) => res.json())
    .then((data) => {
      Object.entries(data).map(([id, name]) => {
        itemsBox.innerHTML += `<button id="${id}" onclick="removeItem('${id}')" class='item'>${name}</button>`;
      });
    });

  console.log(name + " added to database");
});

window.removeItem = async function (id) {
  await fetch(`${appSettings.AppURI}/items/${id}.json`, {
    method: "DELETE",
  });

  itemsBox.innerHTML = "";

  await fetch(`${appSettings.AppURI}/items.json`)
    .then((res) => res.json())
    .then((data) => {
      Object.entries(data).map(([id, name]) => {
        itemsBox.innerHTML += `<button id="${id}" onclick="removeItem('${id}')" class='item'>${name}</button>`;
      });
    });
};
