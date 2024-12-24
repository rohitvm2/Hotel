// all global variable declaration
let userInfo;
let user;
let allBData = [];
let allInHData = [];
let allArchData = [];
let allCashData = [];
let allCashArchData = [];
let navBrand = document.querySelector(".navbar-brand");
let logoutBtn = document.querySelector(".logout-btn");
let bookingForm = document.querySelector(".booking-form");
let inHouseForm = document.querySelector(".inhouse-form");
let allBInput = bookingForm.querySelectorAll("input");
let allInHInput = inHouseForm.querySelectorAll("input");
let bTextarea = bookingForm.querySelector("textarea");
let inHTextarea = inHouseForm.querySelector("textarea");
let modalCBtn = document.querySelectorAll(".btn-close");
let bListTBody = document.querySelector(".booking-list");
let inHListTBody = document.querySelector(".inhouse-list");
let arcListTBody = document.querySelector(".archive-list");
let bRegBtn = document.querySelector(".b-register-btn");
let inHRegBtn = document.querySelector(".in-house-reg-button");
let allTabBtn = document.querySelectorAll(".tab-btn");
let searchEl = document.querySelector(".search-input");
let cashierBtn = document.querySelector(".cashier-tab");
let cashierTab = document.querySelector("#cashier");
let bookingTab = document.querySelector("#booking");
let cashierForm = document.querySelector(".cashier-form");
let allCInput = cashierForm.querySelectorAll("input");
let cashBtn = document.querySelector(".cash-btn");
let cashierTBody = document.querySelector(".cashier-list");
let cashTotal = document.querySelector(".total");
let closeCashierBtn = document.querySelector(".close-cashier-btn");
let cashierArchTBody = document.querySelector(".cashier-arch-list");
let archTotal = document.querySelector(".arch-total");
let allPrintBtn = document.querySelectorAll(".print-btn");
let archPrintBtn = document.querySelector(".arch-print-btn");
let cashierTabPan = document.querySelector(".cashier-tab-pan");
let allTotalBtn = document.querySelectorAll(".total-btn");
let showBRoomsEl = document.querySelector(".show-booking-rooms");
let showHRoomsEl = document.querySelector(".show-inhouse-rooms");

// check user is logged in or not
if (sessionStorage.getItem("__au__") == null) {
  window.location = "../index.html";
}
userInfo = JSON.parse(sessionStorage.getItem("__au__"));
console.log(userInfo);
navBrand.innerHTML = userInfo.hotelname;
user = userInfo.email.split("@")[0];

// print coding
for (let btn of allPrintBtn) {
  btn.onclick = () => {
    window.print();
  };
}
archPrintBtn.onclick = () => {
  cashierTabPan.classList.add("d-none");
  window.print();
};
modalCBtn[3].onclick = () => {
  cashierTabPan.classList.remove("d-none");
};

// check hotel rooms
const checkRooms = (element) => {
  console.log(userInfo.totalRoom);
  if (Number(userInfo.totalRoom) < Number(element.value)) {
    swal(
      "warning",
      `Total ${userInfo.totalRoom} rooms is available in the hotel`,
      "warning"
    );
    element.value = userInfo.totalRoom;
  }
};

allBInput[2].oninput = (e) => {
  checkRooms(e.target);
};
allInHInput[2].oninput = (e) => {
  checkRooms(e.target);
};

// getting data from storage
const fetchData = (key) => {
  if (localStorage.getItem(key) != null) {
    const data = JSON.parse(localStorage.getItem(key));
    return data;
  } else {
    return [];
  }
};

allBData = fetchData(user + "_allBData");
allInHData = fetchData(user + "_allInHData");
allArchData = fetchData(user + "_allArchData");
allCashData = fetchData(user + "_allCashData");
allCashArchData = fetchData(user + "_allCashArchData");

// format date function
const formatDate = (data, isTime) => {
  const date = new Date(data);
  let yy = date.getFullYear();
  let mm = date.getMonth() + 1;
  let dd = date.getDay() + 1;
  let time = date.toLocaleTimeString();
  dd = dd < 10 ? "0" + dd : dd;
  mm = mm < 10 ? "0" + mm : mm;
  return `${dd}-${mm}-${yy} ${isTime ? time : ""}`;
};

// registration coding
const registrationFunc = (textarea = null, inputs, array, key) => {
  let data = {
    notice: textarea && textarea.value,
    inHouse: false,
    createdAt: new Date(),
  };
  for (let el of inputs) {
    let key = el.name;
    let value = el.value;
    data[key] = value;
  }
  array.unshift(data);
  localStorage.setItem(key, JSON.stringify(array));
  swal("Good Job !", "Booking Success", "success");
};
// show data
const showData = (element, array, key) => {
  let tmp = key.split("_")[1];
  element.innerHTML = "";
  array.forEach((item, index) => {
    element.innerHTML += `
    <tr>
          <td class="no-print text-nowrap">${index + 1}</td>
          <td class="text-nowrap">${item.location}</td>
          <td class="text-nowrap">${item.roomNo}</td>
          <td class="text-nowrap">${item.fullname}</td>
          <td class="text-nowrap">${item.checkInDate}</td>
          <td class="text-nowrap">${item.checkOutDate}</td>
          <td class="text-nowrap">${item.totalPeople}</td>
          <td class="text-nowrap">${item.mobile}</td>
          <td class="text-nowrap">${item.price}</td>
          <td class="text-nowrap">${item.notice}</td>
          <td class="text-nowrap no-print">${item.createdAt}</td>
          <td class="text-nowrap no-print">
            <button class="${
              tmp == "allArchData" && "d-none"
            } btn edit-btn p-1 px-2 btn-primary">
              <i class="fa fa-edit"></i>
            </button>
            <button class="btn checkin-btn p-1 px-2 text-white btn-info">
              <i class="fa fa-check"></i>
            </button>
            <button class="btn del-btn p-1 px-2 btn-danger">
              <i class="fa fa-trash"></i>
            </button>
          </td>
          </tr>
    `;
  });
  deleteDataFunc(element, array, key);
  updateDataFunc(element, array, key);
  checkInAndCheckout(element, array, key);
};

// delete coding
function deleteDataFunc(element, array, key) {
  let allDelBtn = element.querySelectorAll(".del-btn");
  allDelBtn.forEach((btn, index) => {
    btn.onclick = () => {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this imaginary file ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          array.splice(index, 1);
          localStorage.setItem(key, JSON.stringify(array));
          showData(element, array, key);
          swal("Poof! Your imaginary file has been deleted", {
            icon: "success",
          });
        } else {
          swal("Your imaginary file is safe");
        }
      });
    };
  });
}

// update coding
const updateDataFunc = (element, array, key) => {
  let allEditBtn = element.querySelectorAll(".edit-btn");
  allEditBtn.forEach((btn, index) => {
    btn.onclick = () => {
      let tmp = key.split("_")[1];
      tmp == "allBData" ? bRegBtn.click() : inHRegBtn.click();
      let allBtn =
        tmp == "allBData"
          ? bookingForm.querySelectorAll("button")
          : inHouseForm.querySelectorAll("button");

      let allInput =
        tmp == "allBData"
          ? bookingForm.querySelectorAll("input")
          : inHouseForm.querySelectorAll("input");

      allBtn[0].classList.add("d-none");
      allBtn[1].classList.remove("d-none");
      let obj = array[index];
      allInput[0].value = obj.fullname;
      allInput[1].value = obj.location;
      allInput[2].value = obj.roomNo;
      allInput[3].value = obj.totalPeople;
      allInput[4].value = obj.checkInDate;
      allInput[5].value = obj.checkOutDate;
      allInput[6].value = obj.price;
      allInput[7].value = obj.mobile;
      bTextarea.value = obj.notice;
      allBtn[1].onclick = () => {
        let formData = { notice: bTextarea.value, createdAt: new Date() };

        for (let el of allBInput) {
          let key = el.name;
          let value = el.value;
          formData[key] = value;
        }
        console.log(formData);
        allBData[index] = formData;
        allBBtn[0].classList.remove("d-none");
        allBBtn[1].classList.add("d-none");
        bookingForm.reset("");
        modalCBtn[0].click();
        localStorage.setItem(user + "_allBData", JSON.stringify(allBData));
        showData(bListTBody, allBData);
      };
    };
  });
};

// checkin and checkout coding
const checkInAndCheckout = (element, array, key) => {
  let allCheckBtn = element.querySelectorAll(".checkin-btn");
  allCheckBtn.forEach((btn, index) => {
    btn.onclick = () => {
      let tmp = key.split("_")[1];
      let data = array[index];
      array.splice(index, 1);
      localStorage.setItem(key, JSON.stringify(array));
      if (tmp == "allBData") {
        allInHData.unshift(data);
        localStorage.setItem(user + "_allInHData", JSON.stringify(allInHData));
        showData(element, array, key);
        showBookingRooms();
        showInhouseRooms();
      } else if (tmp == "allArchData") {
        allBData.unshift(data);
        localStorage.setItem(user + "_allBData", JSON.stringify(allBData));
        showData(element, array, key);
        showBookingRooms();
        showInhouseRooms();
      } else {
        allArchData.unshift(data);
        localStorage.setItem(
          user + "_allArchData",
          JSON.stringify(allArchData)
        );
        showData(element, array, key);
        showInhouseRooms();
        showBookingRooms();
      }
    };
  });
};

// show booking rooms
const showBookingRooms = () => {
  showBRoomsEl.innerHTML = "";
  allBData.forEach((item, index) => {
    console.log(item);
    showBRoomsEl.innerHTML += `
    <div class="card text-center px-0 col-md-2">
      <div class="bg-danger text-white fw-bold card-header">
        ${item.roomNo}
      </div>
      <div class="bg-success text-white fw-bold card-body">
        <p>${item.checkInDate}</p>
        <p>To</p>
        <p>${item.checkOutDate}</p>
      </div>
    </div>
    `;
  });
};
showBookingRooms();

// show inhouse rooms
const showInhouseRooms = () => {
  showHRoomsEl.innerHTML = "";
  allInHData.forEach((item, index) => {
    showHRoomsEl.innerHTML += `
    <div class="card text-center px-0 col-md-2">
      <div class="bg-danger text-white fw-bold card-header">
        ${item.roomNo}
      </div>
      <div class="card-body">
        <img src="${
          item.inHouse ? "images/dummy.webp" : "images/lock.png"
        }" class="w-100" alt="">
      </div>
      <div class="card-footer">
      <button class="in-btn action-btn btn text-white">In</button>
      <button class="out-btn action-btn btn text-white">Out</button>
        </div>
    </div>
    `;
  });
  //in coding
  let allInBtn = showHRoomsEl.querySelectorAll(".in-btn");
  allInBtn.forEach((btn, index) => {
    btn.onclick = () => {
      let data = allInHData[index];
      data.inHouse = true;
      allInHData[index] = data;
      localStorage.setItem(user + "_allInHData", JSON.stringify(allInHData));
      showInhouseRooms();
    };
  });
  //out coding
  let allOutBtn = showHRoomsEl.querySelectorAll(".out-btn");
  allOutBtn.forEach((btn, index) => {
    btn.onclick = () => {
      let data = allInHData[index];
      data.inHouse = false;
      allInHData[index] = data;
      localStorage.setItem(user + "_allInHData", JSON.stringify(allInHData));
      showInhouseRooms();
    };
  });
};
showInhouseRooms();

// show total coding
const showTotal = () => {
  allTotalBtn[0].innerText = "Total Booking = " + allBData.length;
  allTotalBtn[1].innerText = "Total Inhouse = " + allInHData.length;
  allTotalBtn[2].innerText = "Total Archive = " + allArchData.length;
};
showTotal();

// logout coding
logoutBtn.onclick = () => {
  logoutBtn.innerText = "Please wait...";
  setTimeout(() => {
    logoutBtn.innerText = "Logout";
    sessionStorage.removeItem("__au__");
    window.location = "../index.html";
  }, 3000);
};

// start booking store coding
bookingForm.onsubmit = (e) => {
  e.preventDefault();
  registrationFunc(bTextarea, allBInput, allBData, user + "_allBData");
  bookingForm.reset("");
  modalCBtn[0].click();
  showData(bListTBody, allBData, user + "_allBData");
  showTotal();
  showBookingRooms();
};

// start cashier store coding
cashierForm.onsubmit = (e) => {
  e.preventDefault();
  registrationFunc(null, allCInput, allCashData, user + "_allCashData");
  cashierForm.reset("");
  modalCBtn[2].click();
  showCashierFunc();
};

//start inhouse booking coding
inHouseForm.onsubmit = (e) => {
  e.preventDefault();
  registrationFunc(inHTextarea, allInHInput, allInHData, user + "_allInHData");
  inHouseForm.reset("");
  modalCBtn[1].click();
  showData(inHListTBody, allInHData, user + "_allInHData");
  showTotal();
  showInhouseRooms();
};

const searchFunc = () => {
  let value = searchEl.value.toLowerCase();
  let tableEl = document.querySelector(".tab-content .search-pane.active");
  let tr = tableEl.querySelectorAll("tbody tr");
  for (let el of tr) {
    let srNo = el.querySelectorAll("td")[0].innerText;
    let location = el.querySelectorAll("td")[1].innerText;
    let roomNO = el.querySelectorAll("td")[2].innerText;
    let fullname = el.querySelectorAll("td")[3].innerText;
    let mobile = el.querySelectorAll("td")[7].innerText;
    let price = el.querySelectorAll("td")[8].innerText;
    if (srNo.indexOf(value) != -1) {
      el.classList.remove("d-none");
    } else if (location.toLowerCase().indexOf(value) != -1) {
      el.classList.remove("d-none");
    } else if (roomNO.toLowerCase().indexOf(value) != -1) {
      el.classList.remove("d-none");
    } else if (fullname.toLowerCase().indexOf(value) != -1) {
      el.classList.remove("d-none");
    } else if (mobile.toLowerCase().indexOf(value) != -1) {
      el.classList.remove("d-none");
    } else if (price.toLowerCase().indexOf(value) != -1) {
      el.classList.remove("d-none");
    } else {
      el.classList.add("d-none");
    }
  }
};

// search coding
searchEl.oninput = () => {
  searchFunc();
};

// refresh ui data coding
for (let btn of allTabBtn) {
  btn.onclick = () => {
    showData(bListTBody, allBData, user + "_allBData");
    showData(inHListTBody, allInHData, user + "_allInHData");
    // showData(cashierTBody, allCashData, user + "_allCashData");
    showData(arcListTBody, allArchData, user + "_allArchData");
  };
}

// show data

showData(bListTBody, allBData, user + "_allBData");
showData(inHListTBody, allInHData, user + "_allInHData");
showData(arcListTBody, allArchData, user + "_allArchData");

// cashier coding
const showCashierFunc = () => {
  totalAmount = 0;
  cashierTBody.innerHTML = "";
  allCashData.forEach((item, index) => {
    totalAmount += +item.amount;
    cashierTBody.innerHTML += `
    <tr>
        <td>${index + 1}</td>
        <td>${item.RoomNo}</td>
        <td>${item.cashierName}</td>
        <td>${item.createdAt}</td>
        <td>${item.amount}</td>
      </tr>
    `;
  });
  cashTotal.innerHTML = "<i class='fa fa-rupee'> </i>" + totalAmount;
};
showCashierFunc();

// all archive cash coding
const showCashArchFunc = () => {
  totalAmount = 0;
  cashierArchTBody.innerHTML = "";
  allCashArchData.forEach((item, index) => {
    totalAmount += +item.total;
    cashierArchTBody.innerHTML += `
    <tr>
        <td>${index + 1}</td>
        <td>${item.cashierName}</td>
        <td>${item.createdAt}</td>
        <td>${item.total}</td>
      </tr>
    `;
  });
  archTotal.innerHTML = "<i class='fa fa-rupee'></i>" + totalAmount;
};
showCashArchFunc();

cashBtn.onclick = () => {
  allCInput[2].value = sessionStorage.getItem("c_name");
};

cashierBtn.onclick = () => {
  if (sessionStorage.getItem("c_name") == null) {
    let name = window.prompt("Enter your name !");
    if (name) {
      sessionStorage.setItem("c_name", name);
    } else {
      allTabBtn[0].classList.add("active");
      cashierBtn.classList.remove("active");
      cashierTab.classList.remove("active");
      bookingTab.classList.add("active");
    }
  } else {
    allCInput[2].value = sessionStorage.getItem("c_name");
  }
};

// close cashier coding
closeCashierBtn.onclick = () => {
  if (allCashData.length > 0) {
    let data = {
      cashierName: sessionStorage.getItem("c_name"),
      total: cashTotal.innerText,
      createdAt: new Date(),
    };
    allCashArchData.push(data);
    allCashData = [];
    localStorage.removeItem(user + "_allCashData");
    localStorage.setItem(
      user + "_allCashArchData",
      JSON.stringify(allCashArchData)
    );
    sessionStorage.removeItem("c_name");
    showCashierFunc();
  } else {
    swal("warning", "There is no cash to close", "warning");
  }
};
