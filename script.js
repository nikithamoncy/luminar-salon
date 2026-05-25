/* ==========================================================================
   Luminar Beauty Studio - Client Functionality
   ========================================================================== */

// Configure n8n Webhook URL (Replace with your actual endpoint)
const N8N_WEBHOOK_URL = "YOUR_N8N_WEBHOOK_URL_HERE";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize general page setups
  initStickyHeader();
  initMobileMenu();
  initActiveNavLink();
  initScrollReveal();
  initTestimonials();
  
  // Conditionally initialize page-specific features
  if (document.querySelector(".tabs-container") && document.querySelector(".services-list")) {
    initServicesTabs();
  }
  
  if (document.querySelector(".gallery-grid")) {
    initGallery();
  }
  
  if (document.getElementById("booking-form")) {
    initBookingForm();
  }
  
  // Floating AI Chat Widget (Global)
  initAIChat();
});

/* ==========================================================================
   Sticky Header
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector("header");
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };
  
  window.addEventListener("scroll", handleScroll);
  // Run on load in case page is already scrolled
  handleScroll();
}

/* ==========================================================================
   Mobile Navigation Menu
   ========================================================================== */
function initMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector("nav");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!hamburger || !nav) return;

  const toggleMenu = () => {
    hamburger.classList.toggle("active");
    nav.classList.toggle("active");
    
    // Toggle scroll locking on body
    if (nav.classList.contains("active")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  };

  hamburger.addEventListener("click", toggleMenu);

  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (nav.classList.contains("active")) {
        toggleMenu();
      }
    });
  });
}

/* ==========================================================================
   Active Navigation Link Highlighting
   ========================================================================== */
function initActiveNavLink() {
  const navLinks = document.querySelectorAll(".nav-link");
  const currentPath = window.location.pathname;
  
  // Find current file name (e.g. index.html)
  const currentFile = currentPath.substring(currentPath.lastIndexOf("/") + 1) || "index.html";

  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentFile) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

/* ==========================================================================
   Scroll Reveal Animation (Intersection Observer)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");
  
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        // Stop observing once revealed
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px" // Reveal slightly before the element fully enters
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   Services Tab Switching
   ========================================================================== */
function initServicesTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const serviceLists = document.querySelectorAll(".services-list");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetCategory = btn.getAttribute("data-tab");

      // Set active button
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Show/Hide service list with transition
      serviceLists.forEach(list => {
        if (list.id === `${targetCategory}-services`) {
          list.style.display = "grid";
          setTimeout(() => {
            list.classList.add("active");
          }, 50);
        } else {
          list.classList.remove("active");
          list.style.display = "none";
        }
      });
    });
  });
}

/* ==========================================================================
   Gallery Page Functionality (Filters & Lightbox)
   ========================================================================== */
function initGallery() {
  const filterBtns = document.querySelectorAll(".tab-btn[data-filter]");
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.getElementById("lightbox-close");

  if (!galleryItems.length) return;

  // 1. Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const filterValue = btn.getAttribute("data-filter");
      
      // Update active filter button
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Filter grid items
      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute("data-category");
        
        if (filterValue === "all" || itemCategory === filterValue) {
          item.style.display = "block";
          // Quick tick to trigger CSS transitions if elements become visible
          setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = "scale(1)";
          }, 50);
        } else {
          item.style.opacity = "0";
          item.style.transform = "scale(0.95)";
          // Set display none after fade completes
          setTimeout(() => {
            item.style.display = "none";
          }, 300);
        }
      });
    });
  });

  // 2. Lightbox
  galleryItems.forEach(item => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      if (!img || !lightbox || !lightboxImg) return;
      
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      
      lightbox.style.display = "flex";
      setTimeout(() => {
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden"; // disable background scrolling
      }, 50);
    });
  });

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove("active");
    setTimeout(() => {
      lightbox.style.display = "none";
      document.body.style.overflow = ""; // restore scrolling
    }, 400);
  };

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target.classList.contains("lightbox-content")) {
        closeLightbox();
      }
    });
  }

  // Keyboard support (Escape key)
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox && lightbox.classList.contains("active")) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   Booking Form Handler
   ========================================================================== */
function initBookingForm() {
  const form = document.getElementById("booking-form");
  const feedback = document.getElementById("submit-feedback");

  if (!form || !feedback) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Perform simple visual validation
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const service = document.getElementById("service").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    if (!name || !email || !phone || !service || !date || !time) {
      feedback.textContent = "Please fill in all required fields.";
      feedback.className = "submit-feedback error";
      return;
    }

    // Simulate sending submission
    feedback.textContent = "Processing your request...";
    feedback.className = "submit-feedback success";
    feedback.style.display = "block";

    setTimeout(() => {
      feedback.textContent = `Thank you, ${name}! Your booking request for a ${service} on ${date} at ${time} has been submitted. We will contact you shortly to confirm.`;
      feedback.className = "submit-feedback success";
      form.reset();
    }, 1500);
  });
}

/* ==========================================================================
   Testimonial Carousel (Home Page)
   ========================================================================== */
function initTestimonials() {
  const slides = document.querySelectorAll(".testimonial-slide");
  const dots = document.querySelectorAll(".dot");
  
  if (!slides.length || !dots.length) return;
  
  let currentSlide = 0;
  let autoPlayInterval;

  const showSlide = (index) => {
    slides.forEach(slide => slide.classList.remove("active"));
    dots.forEach(dot => dot.classList.remove("active"));
    
    slides[index].classList.add("active");
    dots[index].classList.add("active");
    currentSlide = index;
  };

  const nextSlide = () => {
    let next = currentSlide + 1;
    if (next >= slides.length) next = 0;
    showSlide(next);
  };

  // Add click events to dots
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const targetIndex = parseInt(dot.getAttribute("data-slide"));
      showSlide(targetIndex);
      resetAutoPlay();
    });
  });

  // Autoplay
  const startAutoPlay = () => {
    autoPlayInterval = setInterval(nextSlide, 5000);
  };

  const resetAutoPlay = () => {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  };

  startAutoPlay();
}

/* ==========================================================================
   Floating AI Chat Widget
   ========================================================================== */
function initAIChat() {
  const trigger = document.getElementById("chat-trigger");
  const windowEl = document.getElementById("chat-window");
  const closeBtn = document.getElementById("chat-close-btn");
  const sendBtn = document.getElementById("chat-send-btn");
  const input = document.getElementById("chat-input");
  const body = document.getElementById("chat-body");
  const typingIndicator = document.getElementById("typing-indicator");

  if (!trigger || !windowEl || !closeBtn || !sendBtn || !input || !body || !typingIndicator) return;

  // Generate unique session ID per browser session or fetch existing
  let sessionId = sessionStorage.getItem("luminar_chat_session_id");
  if (!sessionId) {
    sessionId = "session-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem("luminar_chat_session_id", sessionId);
  }

  // Toggle chat window open/close
  trigger.addEventListener("click", () => {
    windowEl.classList.toggle("active");
    if (windowEl.classList.contains("active")) {
      input.focus();
      // Scroll body to bottom
      body.scrollTop = body.scrollHeight;
    }
  });

  closeBtn.addEventListener("click", () => {
    windowEl.classList.remove("active");
  });

  // Message submission handlers
  const handleSend = () => {
    const text = input.value.trim();
    if (!text) return;
    
    appendMessage(text, "user");
    input.value = "";
    
    // Show typing state
    showTyping(true);
    
    // Call webhook
    postMessageToWebhook(text, sessionId);
  };

  sendBtn.addEventListener("click", handleSend);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  });

  // Append a message to the chat layout
  const appendMessage = (text, sender) => {
    const bubble = document.createElement("div");
    bubble.classList.add("chat-message", sender);
    bubble.textContent = text;
    
    // Insert before typing indicator
    body.insertBefore(bubble, typingIndicator);
    
    // Auto-scroll to bottom
    body.scrollTop = body.scrollHeight;
  };

  // Toggle typing state
  const showTyping = (show) => {
    if (show) {
      typingIndicator.style.display = "flex";
      body.scrollTop = body.scrollHeight;
    } else {
      typingIndicator.style.display = "none";
    }
  };

  // POST Request to Webhook
  async function postMessageToWebhook(message, sessionId) {
    try {
      if (!N8N_WEBHOOK_URL || N8N_WEBHOOK_URL === "YOUR_N8N_WEBHOOK_URL_HERE") {
        // Fallback simulate local dummy response if webhook not configured
        setTimeout(() => {
          showTyping(false);
          appendMessage("Welcome to Luminar Beauty Studio! For bookings, please use our Booking form on the Contact page, or call us at +44 20 7946 0183. (Note: n8n webhook URL is not configured).", "bot");
        }, 1200);
        return;
      }

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: message,
          sessionId: sessionId
        })
      });

      if (!response.ok) {
        throw new Error("Network response error");
      }

      const data = await response.json();
      showTyping(false);

      // Parse reply from response body (check standard fields: reply, text, message)
      let botResponse = "I'm sorry, I couldn't process your request.";
      if (data) {
        botResponse = data.reply || data.text || data.message || (typeof data === "string" ? data : JSON.stringify(data));
      }
      
      appendMessage(botResponse, "bot");

    } catch (error) {
      console.error("AI Assistant Webhook Error:", error);
      showTyping(false);
      appendMessage("Sorry, I'm having trouble connecting. Please call us on +44 20 7946 0183", "bot");
    }
  }
}
