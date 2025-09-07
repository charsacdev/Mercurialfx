document.addEventListener("DOMContentLoaded", () => {
  const otpInputs = document.querySelectorAll(".otp-input")
  const continueBtn = document.getElementById("continueBtn")
  const resendBtn = document.getElementById("resendBtn")
  const form = document.getElementById("otpForm")

  // Initialize OTP functionality
  initializeOTPInputs()

  // Form submission
  form.addEventListener("submit", handleFormSubmit)

  // Resend OTP
  resendBtn.addEventListener("click", handleResendOTP)

  function initializeOTPInputs() {
    otpInputs.forEach((input, index) => {
      // Input event for typing
      input.addEventListener("input", (e) => {
        handleOTPInput(e, index)
      })

      // Keydown event for navigation
      input.addEventListener("keydown", (e) => {
        handleKeyDown(e, index)
      })

      // Paste event
      input.addEventListener("paste", (e) => {
        handlePaste(e, index)
      })

      // Focus event
      input.addEventListener("focus", function () {
        this.select()
      })

      input.addEventListener("blur", function () {
        validateSingleInput(this, index)
      })
    })
  }

  function handleOTPInput(e, index) {
    const value = e.target.value

    // Only allow digits
    if (!/^\d*$/.test(value)) {
      e.target.value = ""
      e.target.classList.add("is-invalid")
      setTimeout(() => e.target.classList.remove("is-invalid"), 300)
      return
    }

    // Move to next input if value entered
    if (value && index < otpInputs.length - 1) {
      otpInputs[index + 1].focus()
    }

    updateContinueButton()
    validateOTP()
  }

  function handleKeyDown(e, index) {
    // Handle backspace navigation
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      otpInputs[index - 1].focus()
    }

    // Handle arrow key navigation
    if (e.key === "ArrowLeft" && index > 0) {
      otpInputs[index - 1].focus()
    }

    if (e.key === "ArrowRight" && index < otpInputs.length - 1) {
      otpInputs[index + 1].focus()
    }
  }

  function handlePaste(e, index) {
    e.preventDefault()

    // Get pasted data
    const pastedData = (e.clipboardData || window.clipboardData).getData("text")
    const digits = pastedData.replace(/\D/g, "").slice(0, 4) // Only digits, max 4

    if (digits.length === 0) {
      showValidationMessage("Please paste a valid OTP code", "error")
      return
    }

    // Fill inputs with pasted digits
    digits.split("").forEach((digit, i) => {
      if (index + i < otpInputs.length) {
        otpInputs[index + i].value = digit
      }
    })

    // Focus on the next empty input or last input
    const nextIndex = Math.min(index + digits.length, otpInputs.length - 1)
    otpInputs[nextIndex].focus()

    updateContinueButton()
    validateOTP()

    if (digits.length === 4) {
      showValidationMessage("OTP pasted successfully!", "success")
    }
  }

  function updateContinueButton() {
    const allFilled = Array.from(otpInputs).every((input) => input.value.trim() !== "")
    continueBtn.disabled = !allFilled
  }

  function validateOTP() {
    const allFilled = Array.from(otpInputs).every((input) => input.value.trim() !== "")
    const allValid = Array.from(otpInputs).every((input) => /^\d$/.test(input.value))

    otpInputs.forEach((input) => {
      input.classList.remove("is-valid", "is-invalid")

      if (input.value) {
        if (/^\d$/.test(input.value)) {
          input.classList.add("is-valid")
        } else {
          input.classList.add("is-invalid")
        }
      }
    })

    // Show/hide validation feedback
    const feedback = document.querySelector(".invalid-feedback")
    if (allFilled && !allValid) {
      feedback.style.display = "block"
      form.classList.add("was-validated")
    } else {
      feedback.style.display = "none"
      form.classList.remove("was-validated")
    }

    if (allFilled && allValid) {
      showValidationMessage("OTP is ready to submit!", "success")
    }
  }

  function validateSingleInput(input, index) {
    if (input.value && !/^\d$/.test(input.value)) {
      input.classList.add("is-invalid")
      input.classList.remove("is-valid")
    } else if (input.value) {
      input.classList.add("is-valid")
      input.classList.remove("is-invalid")
    }
  }

  function showValidationMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector(".validation-message")
    if (existingMessage) {
      existingMessage.remove()
    }

    // Create new message
    const messageDiv = document.createElement("div")
    messageDiv.className = `validation-message ${type === "success" ? "valid-feedback" : "invalid-feedback"}`
    messageDiv.textContent = message
    messageDiv.style.display = "block"
    messageDiv.style.textAlign = "center"

    // Insert after OTP inputs
    const container = document.querySelector(".otp-inputs-container")
    container.appendChild(messageDiv)

    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.remove()
      }
    }, 3000)
  }

  function handleFormSubmit(e) {
    e.preventDefault()

    const otp = Array.from(otpInputs)
      .map((input) => input.value)
      .join("")

    if (otp.length !== 4) {
      showValidationMessage("Please enter all 4 digits", "error")
      otpInputs[0].focus()
      return
    }

    if (!/^\d{4}$/.test(otp)) {
      showValidationMessage("OTP must contain only numbers", "error")
      validateOTP()
      return
    }

    // Simulate form submission
    continueBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Verifying...'
    continueBtn.disabled = true

    setTimeout(() => {
      alert(`OTP Submitted: ${otp}`)
      continueBtn.innerHTML = "Continue"
      updateContinueButton()
      showValidationMessage("OTP verified successfully!", "success")
    }, 2000)
  }

  function handleResendOTP() {
    // Clear all inputs
    otpInputs.forEach((input) => {
      input.value = ""
      input.classList.remove("is-valid", "is-invalid")
    })

    // Focus first input
    otpInputs[0].focus()

    // Update button state
    updateContinueButton()

    // Show feedback
    resendBtn.innerHTML = "Sending..."
    resendBtn.disabled = true

    setTimeout(() => {
      resendBtn.innerHTML = "Resend OTP"
      resendBtn.disabled = false
      alert("New OTP sent to your email!")
    }, 1500)
  }
})
