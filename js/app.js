// global variables
const url = "https://randomuser.me/api/1.3/?results=12&nat=us,au,gb&inc=name, picture, email, location, phone, dob, nat & noinfo";
const directory = document.querySelector("#directory");
let employees = [];
const modal = document.createElement("div");
const modalBox = document.createElement("article");
const innerBox = document.createElement("div");
const header = document.querySelector("header");
const searchField = document.createElement("input");

/**
 * `getEmployees()` function
 * fetches 12 random users from randomusers.me 
 * calls the `generateEmployees()` function to create:
 * 1. the employees array of objects
 * 2. the display of employees inside the directory 
 */
function getEmployees() {
  fetch(url)
  .then(response => response.json())
  .then(data => {
    const results = data.results;
    generateEmployees(results);
  })
  .catch(error => console.log("Looks like there was a problem", error))
}

// add employees objects to the employees array
/**
 * `generateEmployees()` function
 * @param {array} data - the array of objects fetched by the `getEmployees()` function
 * creates the array of objects from the fetch functions result
 * populates the directory with the users from the array
 */
function generateEmployees(data) {
  let html = [];
  let index = 0;
  data.map(result => {
    let name = `${result.name.first} ${result.name.last}`;
    let city = result.location.city;
    const thumbnail = `
      <article class="employee-card" data-index=${index}><div class="thumbnail"><img class="employee-img" src=${result.picture.large}></div>
      <div class="card">
      <h2>${name}</h2>
      <p>${result.email.toLowerCase()}</p>
      <p>${city}</p>
      </div>
      </article>`;
    html += thumbnail;

    // generate employee objects
    const employee = {
      index,
      name,
      city,
      phone: result.phone,
      email: result.email.toLowerCase(),
      street: `${result.location.street.number} ${result.location.street.name}`,
      nationality: result.nat.toUpperCase(),
      zipCode: result.location.postcode,
      image: result.picture.large,
      birthday: new Date(result.dob.date)
    }
    index += 1;
    // add employee object to the employees array
    employees.push(employee);
  });
  directory.innerHTML = html;
}

// Call the get Employees function
getEmployees();

/**
 * Calls the `createOverlay()` function on click to create
 * the overlay with the detailed informations from the clicked employees card 
 * inside the directory
 */
directory.addEventListener("click", e => {
  if (e.target !== directory) {
    const currentCard = e.target.closest(".employee-card");
    const index = currentCard.getAttribute("data-index");
    createOverlay(index);
  }
});

/**
 * function createOverlay()
 * @param {number} index - index of the employees card clicked
 * Creates the detailed content to display inside the overlay
 * Adds a button to close the overlay and arrows to switch through employees
 */
function createOverlay(index) {
  // Detailed informations to be displayed from the chosen employee
  const {name, city, phone, email, street, nationality, zipCode, image, birthday} = employees[index];
  // creates the HTML to display inside the overlay
  innerBox.innerHTML = `
      <div class="modal-image">
        <img src="${image}" alt="${name}'s profile image"> 
      </div>
      <h2>${name}</h2>
      <p>${email}</p>
      <p>${city}</p>
      <hr>
      <p>${phone}</p>
      <p>${street}, ${nationality} ${zipCode}</p>
      <p>Birthday: ${birthday.getMonth()}/${birthday.getDate()}/${birthday.getFullYear()}</p>
      `;
  innerBox.classList.add("inner-box");   
  createCloseBtn(innerBox); 
  
  modalBox.classList.add("modal-details");
  createSwitch(modalBox, "arrowLeft");
  modalBox.setAttribute("data-index", index)
  modalBox.appendChild(innerBox);
  createSwitch(modalBox, "arrowRight");
  
  modal.setAttribute("id", "overlay");
  modal.appendChild(modalBox);
  
  modal.style.display = "flex";
  document.body.appendChild(modal);
}

/**
 * function createCloseBtn()
 * @param {node} parent 
 * creates a close button inside the parent element
 */
const createCloseBtn = (parent) => {
  const closeBtn = document.createElement("button");
    closeBtn.textContent = "Close Modal";
    closeBtn.addEventListener("click", e => {
      if (e.target.tagName === "BUTTON") {
        modalBox.innerHTML = "";
        modal.removeChild(modalBox);
        modal.style.display = "none";
      }
    });
    parent.appendChild(closeBtn);
}

/**
 * function createSwitch()
 * @param {element} parent 
 * @param {child} element 
 * creates arrow elements to switch back and forth between displayed employees
 */
const createSwitch = (parent, element) => {
  if (element === "arrowLeft") {
    element = document.createElement("div");
    element.setAttribute("id", "left");
    element.innerHTML = `<p><</p>`;
  } else {
    element = document.createElement("div");
    element.innerHTML = `<p>></p>`;
    element.setAttribute("id", "right");
  }

  element.addEventListener("click", e => {
    // fetches all indexes of employees currently displayed
    const allCards = document.querySelectorAll(".employee-card");
    let activeCards = [];
    for (let i = 0; i < allCards.length; i++) {
      if (!allCards[i].classList.contains("hidden")) {
        let currIndex = allCards[i].getAttribute("data-index");       
        activeCards.push(currIndex);
      }
    }

    // first Item and last item's index inside the activeCards 
    // array to display when switching between employees
    const firstItem = 0;
    const lastItem = activeCards.length - 1;
    // index of currently displayed employee
    const currDisplItm = element.parentNode.getAttribute("data-index");
    // counter to get the correct employees index inside the activeCards array
    let counter = activeCards.indexOf(currDisplItm);

    // if the counter reaches the last item of the activeCards array, 
    // get the with first/last item, depending if right or left arrow was clicked
    // if it's not last or first item, display the next/previous employee
    if(e.target.parentNode.id === "left" || e.target.id === "left") {
      counter > firstItem ? counter-- : counter = lastItem;
    } else {  
      counter < lastItem ? counter++ : counter = firstItem;
    }
    // delete previous content of overlay
    modalBox.innerHTML = "";
    // create new overlay with next/previous or last/first displayed employee
    createOverlay(activeCards[counter]); 
  });
  parent.appendChild(element);
}

// Insert input field into the DOM
searchField.setAttribute("type", "text");
searchField.setAttribute("name", "search");
searchField.setAttribute("id", "search");
searchField.setAttribute("placeholder", "Search for an employee");
searchField.setAttribute("autocomplete", "off");
header.lastElementChild.after(searchField);

// string from search input field
/**
 * get the string from user input, used for displaying the found employees
 * @param {string} input 
 */
const search = (string) => {
  for (let i = 0; i < employees.length; i++) {
    const employee = employees[i].name.toLowerCase();
    const card = document.querySelectorAll(".employee-card")[i];
    // add the class hidden with the property "display" set to "none" to filter them out 
    // from "active" (displayed) card. Only the displayed cards should be accessed
    // by the switch buttons inside the overlay (only loop through active cards)
    if (employee.search(string.toLowerCase()) === -1) {
      card.classList.add("hidden");
    } else {
      card.classList.remove("hidden");
    }
  }
}

// calls the search function when user types into the search field
searchField.addEventListener("keyup", (e) => {
  const input = searchField.value;
  search(input);
});

