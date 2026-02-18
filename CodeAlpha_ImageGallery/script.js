let currentIndex = 0;
let visibleImages = [];

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

function updateVisibleImages() {
    visibleImages = Array.from(document.querySelectorAll(".image-box"))
        .filter(box => box.style.display !== "none")
        .map(box => box.querySelector("img"));
}

function openLightbox(src) {
    updateVisibleImages();

    lightbox.style.display = "flex";
    lightboxImg.src = src;

    visibleImages.forEach((img, index) => {
        if (img.src === src) {
            currentIndex = index;
        }
    });
}

function closeLightbox() {
    lightbox.style.display = "none";
}

function changeImage(step) {
    updateVisibleImages();

    currentIndex += step;

    if (currentIndex < 0) {
        currentIndex = visibleImages.length - 1;
    }

    if (currentIndex >= visibleImages.length) {
        currentIndex = 0;
    }

    lightboxImg.src = visibleImages[currentIndex].src;
}

document.addEventListener("keydown", function(e) {
    if (lightbox.style.display === "flex") {
        if (e.key === "ArrowRight") changeImage(1);
        if (e.key === "ArrowLeft") changeImage(-1);
        if (e.key === "Escape") closeLightbox();
    }
});

function filterImages(category, buttonElement) {
    const images = document.querySelectorAll(".image-box");
    const buttons = document.querySelectorAll(".filter-btn");


    buttons.forEach(btn => btn.classList.remove("active"));

    buttonElement.classList.add("active");

    images.forEach(img => {
        if (category === "all") {
            img.style.display = "block";
        } else {
            img.style.display = img.classList.contains(category) ? "block" : "none";
        }
    });
}
