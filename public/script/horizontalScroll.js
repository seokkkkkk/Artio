document.querySelectorAll(".artworks").forEach((artwork) => {
    artwork.addEventListener("wheel", (event) => {
        event.preventDefault(); // 기본 스크롤 방지
        artwork.scrollLeft += event.deltaY; // 수직 스크롤을 수평으로 전환
    });
});
