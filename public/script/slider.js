const sliderTrack = document.querySelector(".slider-track");
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");
const indicator = document.querySelector(".indicator");

let currentIndex = 0;
let images = sliderTrack.children; // 이미지 리스트

// Dot 동적 생성
function createDots() {
    indicator.innerHTML = ""; // 기존 Dot 제거
    Array.from(images).forEach((_, index) => {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (index === currentIndex) {
            dot.classList.add("active");
        }
        dot.addEventListener("click", () => {
            currentIndex = index;
            updateSlider();
        });
        indicator.appendChild(dot);
    });
}

// Slider 업데이트 함수
function updateSlider() {
    sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateIndicator();
}

// Dot 활성화 업데이트
function updateIndicator() {
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
    });
}

// Next 버튼 이벤트
nextButton.addEventListener("click", () => {
    if (currentIndex >= images.length - 1) {
        return;
    }
    currentIndex++;
    updateSlider();
});

// Prev 버튼 이벤트
prevButton.addEventListener("click", () => {
    if (currentIndex <= 0) {
        return;
    }
    currentIndex--;
    updateSlider();
});

// 초기화
createDots();
