// JavaScript for Mercurial Dashboard

//Datatables 
$(document).ready(function () {

    // Handle navigation item clicks
    const navButtons = document.querySelectorAll(".btn-nav")

    navButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Remove active class from all buttons
        navButtons.forEach((btn) => btn.classList.remove("active"))

        // Add active class to clicked button (except logout)
        if (!this.textContent.trim().includes("Logout")) {
          this.classList.add("active")
        }

        // Handle logout
        if (this.textContent.trim().includes("Logout")) {
          if (confirm("Are you sure you want to logout?")) {
            // Handle logout logic here
            console.log("Logging out...")
          }
        }

        if (window.innerWidth < 992) {
          closeMobileSidebar()
        }
      })
    })

  //Side Bar
  const sidebar = document.querySelector("#sidebar")
  const mobileOverlay = document.querySelector("#mobileOverlay")
  const toggleSidebarBtn = document.querySelector("#toggleSidebar")
  const closeSidebarBtn = document.querySelector("#closeSidebar")

  function openMobileSidebar() {
    sidebar.classList.add("show")
    mobileOverlay.classList.add("show")
    document.body.style.overflow = "hidden" // Prevent background scrolling
  }

  function closeMobileSidebar() {
    sidebar.classList.remove("show")
    mobileOverlay.classList.remove("show")
    document.body.style.overflow = "" // Restore scrolling
  }



    // Toggle sidebar on mobile menu button click
    if (toggleSidebarBtn) {
      toggleSidebarBtn.addEventListener("click", openMobileSidebar)
    }

    // Close sidebar on close button click
    if (closeSidebarBtn) {
      closeSidebarBtn.addEventListener("click", closeMobileSidebar)
    }

    // Close sidebar when clicking on overlay
    if (mobileOverlay) {
      mobileOverlay.addEventListener("click", closeMobileSidebar)
    }

    // Close sidebar on escape key press
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && sidebar.classList.contains("show")) {
        closeMobileSidebar()
      }
    })

    // Handle window resize - close sidebar if window becomes large
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 992 && sidebar.classList.contains("show")) {
        closeMobileSidebar()
      }
    })

    // Copy Wallet Address (works for multiple)
    document.querySelectorAll(".copyBtn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const walletInput = this.closest(".d-flex").querySelector(".walletAddress");

        walletInput.select();
        walletInput.setSelectionRange(0, 99999); // For mobile
        navigator.clipboard.writeText(walletInput.value);

        // Change button text/icon
        this.innerHTML = '<i class="bi bi-check2"></i> Copied!';
        setTimeout(() => {
          this.innerHTML = '<i class="bi bi-clipboard"></i> Copy';
        }, 2000);
      });
    });




    
 // KYC
document.querySelectorAll(".upload-card").forEach(card => {
  let inputId = card.getAttribute("data-input");
  let inputEl = document.getElementById(inputId);

  if (!inputEl) return; // skip if input doesn't exist

  // Click card → open camera
  card.addEventListener("click", () => inputEl.click());

  // Show preview after capture
  inputEl.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function(ev) {
        card.innerHTML = `
          <img src="${ev.target.result}" class="img-fluid rounded" style="max-height:200px; object-fit:cover;">
        `;
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  });
});

// Profile Pics
const imageUpload = document.getElementById("imageUpload");
const profileImage = document.getElementById("profileImage");

if (imageUpload && profileImage) {
  imageUpload.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profileImage.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
}


   //Datatable Js
    $('#myTable').DataTable({
        dom: '<"top"f>rt<"bottom"p><"clear">', // keep only search + pagination
        pageLength: 10,
        pagingType: "simple_numbers", // clean pagination
        ordering: false,
        language: {
            search: "_INPUT_",
            searchPlaceholder: "Search records..."
        }
    });

    // Make search box full width
    $('#myTable_filter input').addClass('form-control w-100 shadow-none');
});
