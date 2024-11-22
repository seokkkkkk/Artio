document.addEventListener("DOMContentLoaded", async () => {
    // API URL 설정
    const apiBase = "/api/artworks";
    const endpoints = {
        hotWorks: `${apiBase}/views`, // 조회수 순
        favoriteWorks: `${apiBase}/likes`, // 좋아요 순
        newWorks: `${apiBase}/last-month`, // 최신 순
    };

    // 각 섹션의 데이터를 가져오고 렌더링하는 함수
    const fetchAndRenderArtworks = async (endpoint, containerSelector) => {
        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error(`API 요청 실패: ${response.status}`);
            }

            const { data } = await response.json();
            const container = document.querySelector(containerSelector);

            if (container) {
                container.innerHTML = ""; // 기존 내용을 초기화
                data.forEach((artwork) => {
                    const artworkItem = document.createElement("div");
                    artworkItem.className = "artwork-item";

                    const artworkImage = document.createElement("img");
                    artworkImage.src = artwork.imageUrls[0];
                    artworkImage.alt = artwork.title;
                    artworkImage.draggable = false;
                    artworkImage.onclick = () => {
                        window.location.href = `/post/${artwork._id}`;
                    };

                    const artworkInfo = document.createElement("div");
                    artworkInfo.className = "artwork-info";

                    // 조회수 SVG
                    const viewsSpan = document.createElement("span");
                    viewsSpan.className = "views";
                    viewsSpan.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                    ${artwork.views}
                `;

                    // 좋아요 SVG
                    const likesSpan = document.createElement("span");
                    likesSpan.className = "likes";
                    likesSpan.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                    ${artwork.likes.length}
                `;
                    artworkInfo.appendChild(viewsSpan);
                    artworkInfo.appendChild(likesSpan);

                    artworkItem.appendChild(artworkImage);
                    artworkItem.appendChild(artworkInfo);
                    container.appendChild(artworkItem);
                });
            }
        } catch (error) {
            console.error(
                `작품 데이터를 가져오는 중 오류 발생: ${error.message}`
            );
        }
    };

    // 각 섹션의 데이터를 가져와 렌더링
    fetchAndRenderArtworks(endpoints.hotWorks, "#hot");
    fetchAndRenderArtworks(endpoints.favoriteWorks, "#favorite");
    fetchAndRenderArtworks(endpoints.newWorks, "#new");
});
