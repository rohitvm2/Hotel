// all global variables declarations
let allUserInfo = [];
let regForm = document.querySelector(".reg-form");
let loginForm = document.querySelector(".login-form");
let allInput = regForm.querySelectorAll("input");
let allLoginInput = loginForm.querySelectorAll("input");
let regBtn = regForm.querySelector("button");
let loginBtn = loginForm.querySelector("button");


// getting data from localstorage
if (localStorage.getItem("allUserInfo") != null) {
  allUserInfo = JSON.parse(localStorage.getItem("allUserInfo"));
}
console.log(allUserInfo);

// registration coding
regForm.onsubmit = (e) => {
  e.preventDefault();
  let checkEmail = allUserInfo.find((data) => {
    return data.email == allInput[4].value;
  });
  if (checkEmail == undefined) {
    let data = {};
    for (let el of allInput) {
      let key = el.name;
      data[key] = el.value;
    }
    regBtn.innerText = "Processing...";
    setTimeout(() => {
      regBtn.innerText = "Register";
      allUserInfo.push(data);
      localStorage.setItem("allUserInfo", JSON.stringify(allUserInfo));
      swal("Good Job !", "Registration Success", "success");
    }, 2000);
  } else {
    swal("Failed !", "Email already registered", "warning");
  }
};

//login coding
loginForm.onsubmit = (e) => {
  e.preventDefault();
  if(allLoginInput[0].value != "")
  {
    if(allLoginInput[1].value != "") 
    {
      // check email in your database
      let checkEmail = allUserInfo.find((data) => {
        return data.email == allLoginInput[0].value
      });
      if(checkEmail != undefined)
      {
        if(checkEmail.password == allLoginInput[1].value)
        {
          loginBtn.innerText = "Please wait...";
          setTimeout(() => {
            loginBtn.innerText = "Login";
            window.location = "profile/profile.html";
            checkEmail.password = null;
            sessionStorage.setItem("__au__", JSON.stringify(checkEmail));
          }, 2000)
        }
        else
        {
          swal("Warning", "Wrong Password !" , 'warning');
        }
      }
      else
      {
        swal("Warning", "Wrong Email !" , 'warning');
      }
    }
    else
    {
      swal("Warning", "Password is empty !" , 'warning');
    }
  }
  else
  {
    swal("Warning", "Email is empty !" , 'warning');
  }
}
