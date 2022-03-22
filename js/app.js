// global variables
const url = "https://randomuser.me/api/1.3/?results=12&nat=us,au,gb&inc=name, picture, email, location, phone, dob, nat & noinfo";
const directory = document.querySelector("#directory");
let employees = [];
const modal = document.createElement("div");
const modalBox = document.createElement("article");
const innerBox = document.createElement("div");

/**
 * `getEmployees()` function
 */
function getEmployees() {
  fetch(url)
  .then(response => response.json())
  .then(data => {
    const results = data.results;
    generateEmployees(results);
    console.log(results);
  })
  .catch(error => console.log("Looks like there was a problem", error))
}

// add employees objects to the employees array
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

getEmployees();

// Overlay (Employees Details)
// const cards = document.querySelectorAll(".employee-card");
directory.addEventListener("click", e => {
  const currentCard = e.target.closest(".employee-card");
  const index = currentCard.getAttribute("data-index");
  createOverlay(index);
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
  
  // modalBox.setAttribute("data-index", index);
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
 * @param {node} parent 
 * @param {child} element 
 * creates arrow elements to switch back and forth
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
    let modalBoxIndex = element.parentNode.getAttribute("data-index");
    if(e.target.parentNode.id === "left" || e.target.id === "left") {
      // console.log(modalBoxIndex);
        if (modalBoxIndex < employees.length) {
          modalBoxIndex--;
          if (modalBoxIndex === 0) {
            element.children[0].style.display = "none";
          } else {
            modalBox.innerHTML = "";
            modal.removeChild(modalBox);
            modal.style.display = "none";
            createOverlay(modalBoxIndex);
            // console.log(modalBoxIndex);
          }
          // if (modalBoxIndex < 2) {
          //   element.style.display === "none";
          // }
      } 
      // const switchIndex = parent.getAttribute("data-index");
      // if(e.id === "left") {
      //   console.log(index);
      // }
    } else  {
      console.log(modalBoxIndex);
      if (modalBoxIndex >= 0) {
        modalBoxIndex++;
        if (modalBoxIndex === employees.length) {
          element.children[0].style.display = "none";
        } else {
          modalBox.innerHTML = "";
          modal.removeChild(modalBox);
          modal.style.display = "none";
          createOverlay(modalBoxIndex);
        console.log(modalBoxIndex);
        }
      }
    }
  });
  
  parent.appendChild(element);
}



