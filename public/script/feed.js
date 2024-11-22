async function fetchFollowingFeed() {
    try {
        const response = await fetch("/api/artworks/following", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(
                "팔로우한 사용자의 게시물을 가져오는 데 실패했습니다."
            );
        }

        const data = await response.json();
        return data.data; // API에서 반환된 게시물 데이터
    } catch (error) {
        console.error(error.message);
        return [];
    }
}

async function getCurrentUser() {
    try {
        const response = await fetch("/api/users/me", {
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok)
            throw new Error("사용자 정보를 불러오는데 실패했습니다.");

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("사용자 정보 가져오기 실패:", error);
        return null;
    }
}

async function renderFeed(posts) {
    const feedContainer = document.querySelector(".feed-container"); // 피드 컨테이너
    feedContainer.innerHTML = ""; // 기존 피드 초기화
    const currentUser = await getCurrentUser(); // 현재 사용자 정보 가져오기

    posts.forEach((post) => {
        const postElement = document.createElement("div");
        postElement.className = "post";

        // 사용자 정보
        const userInfo = document.createElement("div");
        userInfo.className = "userInfo";

        const profile = `
            <div class="profile">
                <a href="/profile/${post.createdBy._id}">
                    <img src="${
                        post.createdBy.profileImage ||
                        "/uploads/profile_images/default-profile.png"
                    }" alt="프로필 이미지" />
                </a>
                <p>${post.createdBy.username}</p>
            </div>
        `;

        const followButton = `
            <button class="follow" data-user-id="${post.createdBy._id}">
                언팔로우
            </button>
        `;

        userInfo.innerHTML = profile + followButton;

        // 이미지 슬라이더
        const sliderImages = post.imageUrls
            .map(
                (image) =>
                    `<img src="${image}" alt="${
                        post.title || "게시물 이미지"
                    }" />`
            )
            .join("");
        const slider = `
            <div class="slider">
                <div class="slider-track">${sliderImages}</div>
                <div class="indicator"></div>
                <button class="prev"></button>
                <button class="next"></button>
            </div>
        `;

        // 게시물 본문
        const postContent = `
            <div class="post-container">
                <div class="post-header">
                    <p class="title">${post.title}</p>
                    <div class="icon">
                        <p class="comment">
                            <a href="/post/${post._id}">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="black"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="lucide lucide-message-circle">
                                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                                </svg>
                            </a>
                        </p>
                        <p class="like ${
                            post.likes.includes(currentUser._id) ? "active" : ""
                        }" data-post-id="${post._id}">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-heart"
                            >
                                <path
                                    d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
                                />
                            </svg>
                        </p>
                    </div>
                </div>
                <p class="post-content">${post.description}</p>
                <div class="post-footer">
                    <p class="date">${new Date(
                        post.uploadedAt
                    ).toLocaleDateString()}</p>
                    <p class="price">${post.price || "0"}원</p>
                </div>
            </div>
        `;

        // 게시물 구성
        postElement.innerHTML = `
            ${userInfo.outerHTML}
            ${slider}
            ${postContent}
        `;

        feedContainer.appendChild(postElement);

        // 슬라이더와 닷 컨트롤 초기화
        initializeSlider(postElement);

        const likeButton = postElement.querySelector(
            `.like[data-post-id="${post._id}"]`
        );
        likeButton.addEventListener("click", async () => {
            const isLiked = likeButton.classList.contains("active");
            const success = await toggleLike(post._id, isLiked);
            if (success) {
                likeButton.classList.toggle("active");
            } else {
                alert("좋아요 요청에 실패했습니다.");
            }
        });
    });
}

function initializeSlider(postElement) {
    const sliderTrack = postElement.querySelector(".slider-track");
    const dotsContainer = postElement.querySelector(".indicator");
    const prevButton = postElement.querySelector(".prev");
    const nextButton = postElement.querySelector(".next");
    const images = sliderTrack.children;
    let currentIndex = 0;

    // Dot 동적 생성
    dotsContainer.innerHTML = ""; // 기존 Dot 제거
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
        dotsContainer.appendChild(dot);
    });

    // Slider 업데이트 함수
    function updateSlider() {
        sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
    }

    // Dot 활성화 업데이트
    function updateDots() {
        const dots = dotsContainer.querySelectorAll(".dot");
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
}

async function initFeed() {
    const posts = await fetchFollowingFeed(); // 데이터 가져오기
    const sortedPosts = posts.sort(
        (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
    ); // 최신순 정렬
    renderFeed(sortedPosts); // 렌더링
}

async function toggleFollow(userId, isFollowing) {
    try {
        const url = isFollowing
            ? `/api/follow/unfollow/${userId}` // 언팔로우 API
            : `/api/follow/follow/${userId}`; // 팔로우 API

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok)
            throw new Error("팔로우/언팔로우 요청에 실패했습니다.");
        return true; // 요청 성공 시
    } catch (error) {
        console.error(error.message);
        return false; // 요청 실패 시
    }
}

document.addEventListener("DOMContentLoaded", initFeed);

document
    .querySelector(".feed-container")
    .addEventListener("click", async (event) => {
        if (event.target.classList.contains("follow")) {
            const button = event.target;
            const userId = button.dataset.userId;
            let isFollowing = button.textContent.trim() === "언팔로우";

            const success = await toggleFollow(userId, isFollowing);
            if (success) {
                isFollowing = !isFollowing;
                button.textContent = isFollowing ? "언팔로우" : "팔로우";
            } else {
                alert("팔로우/언팔로우 요청에 실패했습니다.");
            }
        }
    });

// 좋아요 상태 토글
async function toggleLike(postId, isLiked) {
    try {
        const url = `/api/artworks/${postId}/like`; // 좋아요 API

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok)
            throw new Error("좋아요/좋아요 해제 요청에 실패했습니다.");
        return true; // 요청 성공 시
    } catch (error) {
        console.error(error.message);
        return false; // 요청 실패 시
    }
}
