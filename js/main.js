const handle_search_phone = document.getElementById("handle_search_phone");
let search_phone_Element = document.getElementById("search_phone");
let total_phone_number = document.getElementById("total_phone_number");
let phone_details_Element = document.getElementById("phone_details");
let loading = document.getElementById("loading");
let loadMorePhone = document.getElementById("loadMorePhone");
let msg = document.getElementById("msg");
let btn_close = document.getElementById("btn_close");
let body = document.body;
const phone_name = document.getElementById("phone_name");
let phone_name_input;
let totalPhone;
let count;
let total_phone_element = document.getElementById("total_phone_element");

/*==========
* Modal remove when is clicked  body area
============
*/
body.addEventListener("click", function () {
  removeModal();
});

/*===========
* Display not showing load more button and total phones number
============
*/
loadMorePhone.style.display = "none";
total_phone_element.style.display = "none";

/*===========
* Remove modal
=============
*/
const removeModal = () => {
  phone_details_Element.innerHTML = "";
  phone_details_Element.classList.add("phone_modal_remove");
  phone_details_Element.classList.remove("phone_modal_add");
};

/*===========
* Search button handler
=============
*/
handle_search_phone.addEventListener("click", function () {
  phone_name_input = phone_name.value.trim();
  if (phone_name_input == " " || phone_name_input == null) {
    msg.innerHTML = ` <div class="alert alert-danger fw-bold" role="alert">
    Please enter a search value!
  </div>`;
    search_phone_Element.innerHTML = "";
  } else {
    count = 20;
    msg.innerHTML = "";
    search_phone_Element.innerHTML = "";
    loading.innerHTML = `
    <div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>`;
    loadPhone();
  }
});

/*===========
* Load more button when click increments 20 phones
=============
*/
const loadMorePhoneShow = () => {
  count = count + 20;
  loadPhone();
};

/*===========
*Load search phones from api
============
*/
const loadPhone = () => {
  const URL = `https://openapi.programming-hero.com/api/phones?search=${phone_name_input}`;
  fetch(URL)
    .then((response) => response.json())
    .then((data) => displaySearchPhone(data));
};

/*===========
* Render display phones
=============
*/
const displaySearchPhone = (response) => {
  const { status, data } = response;
  totalPhone = data.length;
  total_phone_number.innerText = totalPhone;
  if (count >= totalPhone) {
    loadMorePhone.style.display = "none";
  } else {
    loadMorePhone.style.display = "block";
  }
  search_phone_Element.innerHTML = "";
  if (status) {
    loading.innerHTML = ` `;
    total_phone_element.style.display = "block";
    data.slice(0, count).map((phone) => {
      const div = document.createElement("div");
      div.classList.add("col-lg-4", "col-md-4", "mb-4");
      div.innerHTML = `
              <div class="card text-center border-0 shadow pt-3 pb-3">
                              <img src="${phone.image}" class="card-img-top img-fluid w-50 m-auto" alt="${phone.phone_name}">
                              <div class="card-body">
                                <h5 class="card-title"> ${phone.phone_name}</h5>
                                <p><span class="fw-bold">Brand:</span> ${phone.brand}</p>
                                <button type="button" class="btn btn-primary phone_from_btn" onClick="phoneDetails('${phone.slug}')"> Details</button>
                              </div>
                            </div>
              `;
      search_phone_Element.appendChild(div);
    });
  } else {
    loading.innerHTML = ` `;
    total_phone_element.style.display = "none";
    msg.innerHTML = ` <div class="alert alert-danger fw-bold" role="alert">
    Search result not found!
  </div>`;
  }
};

/*============
* Fetch phone details from api
==============
*/
const phoneDetails = (slug) => {
  phone_details_Element.innerHTML = "";
  const URL = `https://openapi.programming-hero.com/api/phone/${slug}`;
  fetch(URL)
    .then((response) => response.json())
    .then((data) => displayPhoneDetails(data));
};

/*============
* Render display phone details
==============
*/
const displayPhoneDetails = (response) => {
  // modal class add and remove
  phone_details_Element.classList.add("phone_modal_add");
  phone_details_Element.classList.remove("phone_modal_remove");

  const { data } = response;
  let othersHtml = "";
  if (data.others) {
    for (const other in data.others) {
      othersHtml += `<li class="list-group-item"> <span class="fw-bold">${other}:</span> ${data.others[other]}</li>`;
    }
  } else {
    othersHtml = `<h3 class="fw-bold phone_color mb-4">No Others details</h3>`;
  }

  let html = "";
  if (data.mainFeatures.sensors) {
    for (const sensor of data.mainFeatures.sensors) {
      html += `<li class="list-group-item">${sensor}</li>`;
    }
  } else {
    html = `<h3 class="fw-bold phone_color mb-4">No sensor details</h3>`;
  }

  /*============
* Modal area
=============
*/
  const modal = document.createElement("div");
  modal.innerHTML = `
    <div class="phone_modal" id="${data.slug}">
    <div class="modal-dialog  modal-xl p-4">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">${data.name}</h5>
          <button type="button" id="btn_close" class="btn btn-primary phone_from_btn"onClick="removeModal()"> <i class="fa fa-trash"></i></button>
        </div>
        <div class="modal-body">
          <div class="row">
          <div class="col-lg-4">
          <div class="card border-0 shadow mb-4 p-3">
          <img src="${
            data.image
          }" class="card-img-top img-fluid   m-auto" alt="${data.name}">
          <div class="card-body">
            <h5 class="card-title">${data.name}</h5>
            <p><span class="fw-bold">Brand:</span>${data.brand}</p>
            <p><span class="fw-bold">Release: </span>${
              data.releaseDate ? data.releaseDate : "No Release Date"
            }</p>
          </div>
        </div>
          </div>
          <div class="col-lg-8">
         <div class="row">
         <div class="col-lg-6 ">
             <h3 class="fw-bold">Others Information:</h3>
             <ul class="list-group" id="sensors"> ${othersHtml} </ul>
         </div>
         <div class="${data.others ? "col-lg-6" : "col-lg-12"}">
            <h3 class="fw-bold">Sensors Information:</h3>
             <ul class="list-group" id="sensors"> ${html} </ul>
         </div>
         <div class="col-lg-12 mt-4">
          <ul class="list-group mb-4"> 
              <li class="list-group-item"> <span class="fw-bold">Chip Set:</span> : ${
                data.mainFeatures.chipSet
              } </li>
              <li class="list-group-item"> <span class="fw-bold">Display Size:</span> : ${
                data.mainFeatures.displaySize
              } </li>
              <li class="list-group-item"> <span class="fw-bold">Memory:</span> : ${
                data.mainFeatures.memory
              } </li>
              <li class="list-group-item"> <span class="fw-bold">Storage:</span> : ${
                data.mainFeatures.storage
              } </li>
              </ul>
         </div>
        </div>
        </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary phone_from_btn" onClick="removeModal()" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
    `;
  phone_details_Element.appendChild(modal);
};
