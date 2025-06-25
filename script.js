// Script for Star Effect
const starsContainer = document.getElementById('stars-container');
for (let i = 0; i < 80; i++) {
    const star = document.createElement('div');  // Create a <div>
    star.className = 'star';                     // Give it the class "star"
    star.style.top = Math.random() * 100 + '%';  // Random vertical position
    star.style.left = Math.random() * 100 + '%'; // Random horizontal position
    star.style.animationDuration = (1.5 + Math.random() * 2) + 's'; // Random twinkle speed
    starsContainer.appendChild(star);            // Add it to the container
}
document.addEventListener('mousemove', (e) => {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        const speed = Math.random() * 0.5 + 0.5; // Random movement speed
        star.style.transform = `translate(${(e.clientX - window.innerWidth / 2) * speed}px, ${(e.clientY - window.innerHeight / 2) * speed}px)`;
    });
});
document.addEventListener('click', (e) => {
    const star = document.createElement('div');   // New star on click
    star.className = 'star';
    star.style.left = e.clientX + 'px';           // Place it exactly where you clicked
    star.style.top = e.clientY + 'px';
    starsContainer.appendChild(star);             // Add to screen
    setTimeout(() => {
        starsContainer.removeChild(star);         // Remove it after 5 seconds
    }, 5000);
});


// Skills Slider Script
const track = document.getElementById("sliderTrack");
const cardWidth = 320; // 300px card + 20px margin-right
const animationDuration = 7000; // match 14s from CSS

setInterval(() => {
    // Pause animation
    track.style.animation = "none";

    // Shift by -1 card width
    track.style.transform = `translateX(-${cardWidth}px)`;

    // After a short delay, move the first card to the end and reset transform
    setTimeout(() => {
        const firstCard = track.children[0];
        track.appendChild(firstCard);

        track.style.transition = "none";
        track.style.transform = "translateX(0)";
        void track.offsetWidth; // force reflow

        // Resume animation
        track.style.animation = "scroll 7s linear infinite";
    }, 0); // Short delay after shifting
}, animationDuration);

// Form Validation Script
const form = document.getElementById("contactForm");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
    }

    const formData = new FormData(form);

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Reset the form and show the success modal
            form.reset();
            form.classList.remove("was-validated");
            const successModal = new bootstrap.Modal(document.getElementById('successModal'));
            successModal.show();
        } else {
            alert("There was a problem submitting your form.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("There was an error. Please try again later.");
    }
});