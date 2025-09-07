// JavaScript for Mercurial Dashboard
document.addEventListener("DOMContentLoaded", () => {
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

  // Handle Verify Now button
  const verifyButton = document.querySelector("main .btn-primary")
  if (verifyButton) {
    verifyButton.addEventListener("click", () => {
      alert("Redirecting to KYC verification...")
    })
  }

  // Handle Get verified button
  const getVerifiedButton = document.querySelector(".kyc-card .btn-primary")
  if (getVerifiedButton) {
    getVerifiedButton.addEventListener("click", () => {
      alert("Starting KYC verification process...")
    })
  }

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
})
