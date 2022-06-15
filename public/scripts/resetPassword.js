"use strict";

// import addAlert from "./addAlert.js";
// import { addSpinner, removeSpinner } from "./spinner.js";

// const currentPassword = document.getElementById('currentPassword');
const newPassword = document.getElementById("newPassword");
const confirmNewPassword = document.getElementById("confirmNewPassword");

export default document
  .querySelector(".reset")
  ?.addEventListener("submit", async function (e) {
    try {
      e.preventDefault();

      const obj = {
        // currentPassword: currentPassword.value,
        newPassword: newPassword.value,
        confirmNewPassword: confirmNewPassword.value,
      };
      console.log(obj);

      const res = await fetch(
        `/api/v1/users/reset-password/${e.target.dataset.reset}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/JSON",
          },
          body: JSON.stringify(obj),
        }
      );

      // removeSpinner(this);

      const data = await res.json();
      if (!res.ok) {
        // addAlert("error", data.error);
        setTimeout(() => {
          document.querySelector(".alert").style.display = "none";
        }, 3000);
      } else {
        // addAlert("success", "Password has been reset successfully ");
        setTimeout(() => {
          // document.querySelector(".alert").style.display = "none";
          window.location.replace("/");
        }, 3000);
      }

      // currentPassword.value = '';
      newPassword.value = "";
      confirmNewPassword.value = "";
    } catch (err) {
      console.log(err);
    }
  });
