// Wait for window load
document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lottie Animation
    lottie.loadAnimation({
        container: document.getElementById('lottie-loader'), // the dom element that will contain the animation
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'img/Sandy Loading.json' // the path to the animation json
    });
});

window.addEventListener("load", () => {
    const loadingScreen = document.getElementById("loading-screen");
    // Fade out the loading screen
    loadingScreen.style.opacity = "0";
    // Make it non-interactive
    loadingScreen.style.pointerEvents = "none";
    // Hide it completely after the transition
    setTimeout(() => {
        loadingScreen.style.visibility = "hidden";
    }, 750); // Match the transition duration in CSS
});

const parallax_el = document.querySelectorAll(".parallax");
const main = document.querySelector("main");

// --- DEBUG LOGS FOR INITIAL LOAD ---
console.log("=== PARALLAX DEBUG INFO ===");
console.log(`Viewport Dimensions: Width=${window.innerWidth}, Height=${window.innerHeight}`);
console.log(`Device Pixel Ratio (Zoom Level): ${window.devicePixelRatio}`);

parallax_el.forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    console.group(`Image ${i + 1}: ${el.className}`);
    console.log("Visible Position (Rect):", {
        x: rect.x, y: rect.y,
        width: rect.width, height: rect.height,
        right: rect.right, bottom: rect.bottom
    });
    console.log("Computed Style:", {
        left: style.left,
        top: style.top
    });
    console.log("Parallax Config:", {
        speedx: el.dataset.speedx,
        speedy: el.dataset.speedy,
        speedz: el.dataset.speedz,
        distance: el.dataset.distance
    });
    console.groupEnd();
});
console.log("===========================");
// -----------------------------------

let xValue = 0, yValue = 0;
let rotateDegree = 0;

function update(cursorPosition) {
    parallax_el.forEach((el) => {
        let speedx = el.dataset.speedx;
        let speedy = el.dataset.speedy;
        let speedz = el.dataset.speedz;
        let rotationSpeed = el.dataset.rotation;

        let isInLeft = parseFloat(getComputedStyle(el).left) < window.innerWidth / 2 ? 1 : -1;
        let zValue = (cursorPosition - parseFloat(getComputedStyle(el).left)) * isInLeft * 0.1;


        el.style.transform = `translateX(calc(-50% + ${-xValue * speedx}px)) translateY(calc(-50% + ${yValue * speedy}px)) perspective(2300px) translateZ(${zValue * speedz}px) rotateY(${rotateDegree * rotationSpeed}deg)`;
    });
}
update(0)
window.addEventListener("mousemove", (e) => {
    if(timeline.isActive()) return;
    xValue = e.clientX - window.innerWidth / 2;
    yValue = e.clientY - window.innerHeight / 2;
    rotateDegree = xValue / (window.innerWidth / 2) * 20;
    console.log(xValue, yValue);
    update(e.clientX);

});

window.addEventListener("touchmove", (e) => {
    if(timeline.isActive()) return;
    let touch = e.touches[0];
    xValue = touch.clientX - window.innerWidth / 2;
    yValue = touch.clientY - window.innerHeight / 2;
    rotateDegree = xValue / (window.innerWidth / 2) * 20;
    update(touch.clientX);
}, { passive: false });
if (window.innerWidth >= 768) {
    main.style.maxHeight = `${window.innerWidth * 0.6}px`;
} else {
    main.style.maxHeight = `${window.innerWidth * 0.9}px`;
}

let timeline = gsap.timeline();
setTimeout(() => {
    parallax_el.forEach((el) => {
        el.style.transition = "0.45s cubic-bezier(0.2, 0.49, 0.32, 0.99)";
    });
}, timeline.endTime() * 1000);

Array.from(parallax_el).filter(el =>!el.classList.contains("text")).forEach(el => {


    timeline.from(el, {
        top: `${el.offsetHeight / 2 + +el.dataset.distance}px`,
        duration: 3.5,
        ease: "power3.out",

    },
        "1");
})
timeline.from(".text h1",{
    y: window.innerHeight - document.querySelector(".text h1").getBoundingClientRect().top +200,
    duration:2,
},
"2.5").from(".text h2",{
    y: -150,
    opacity: 0,
    duration:1.5,
},"3").from(".hide",{
    opacity: 0,
    duratio: 2.5,
},"3");
/* gsap library for timeline */
