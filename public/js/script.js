// Function to validate the registration form 
function validateForm() {
    let password = document.getElementById("regNumber").value;
  
    if (password.length !== 12) {
      alert("Register Number must be exactly 12 digits.");
      return false;
    }
  
    return true;
  }
  
  // Run script only after HTML is fully loaded
  document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
  
    if (loginForm) {
      loginForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent page refresh
  
        const formData = new FormData(this);
        const response = await fetch("/login", {
          method: "POST",
          body: new URLSearchParams(formData),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        });
  
        const data = await response.json();
        if (data.success) {
          // ✅ Redirect to correct page (make sure server matches this route)
          window.location.href = data.redirect;
        } else {
          alert(data.message);
        }
      });
    }
  
    // ✅ Add voting buttons event listeners after DOM loads
    const voteButtons = document.querySelectorAll(".btn");
  
    voteButtons.forEach(button => {
      button.addEventListener("click", async () => {
        const candidateName = button.getAttribute("data-candidate");
        if (!candidateName) return;
  
        try {
          const response = await fetch("/vote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ candidate: candidateName })
          });
  
          const data = await response.json();
          alert(data.message);
  
          // Redirect to signup page after voting
          window.location.href = "/signin.html";
        } catch (error) {
          alert("Something went wrong while voting.");
        }
      });
    });
  });
  