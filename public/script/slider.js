const sliderTrack = document.querySelector(".slider-track");
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");
const dots = document.querySelectorAll(".dot");

let currentIndex = 0;

function updateIndicator() {
    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
    });
}

nextButton.addEventListener("click", () => {
    if (currentIndex >= sliderTrack.children.length - 1) {
        return;
    }
    currentIndex++;
    sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateIndicator();
});

prevButton.addEventListener("click", () => {
    if (currentIndex <= 0) {
        return;
    }
    currentIndex--;
    sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateIndicator();
});

// 점 클릭으로 이미지 이동
dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        currentIndex = index;
        sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateIndicator();
    });
});
