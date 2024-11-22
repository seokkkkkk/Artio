// 서버 URL 설정 (환경에 따라 변경)
const BASE_URL = "/api/artworks";
const artworkId = window.location.pathname.split("/").pop(); // URL에서 작품 ID 추출
const sliderTrack = document.querySelector(".slider-track");
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");
const indicator = document.querySelector(".indicator");

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

let currentIndex = 0;

// Dot 동적 생성
function createDots() {
    let images = sliderTrack.children; // 이미지 리스트
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

// 작품 상세 데이터 가져오기
async function fetchArtworkDetails() {
    try {
        const response = await fetch(`${BASE_URL}/${artworkId}`);
        if (!response.ok)
            throw new Error("작품 정보를 불러오는데 실패했습니다.");
        const data = await response.json();
        const currentUser = await getCurrentUser(); // 사용자 ID 가져오기
        renderUserInfo(data.data.createdBy, currentUser._id);
        renderArtwork(data.data, currentUser._id);
        createDots();
    } catch (error) {
        console.error(error.message);
    }
}

async function renderUserInfo(user, currentUserId) {
    // 프로필 이미지 업데이트
    const profileLink = document.querySelector(".userInfo .profile a");
    const profileImage = document.createElement("img");
    profileImage.src =
        user.profileImage || "/uploads/profile_images/default-profile.png";
    profileImage.alt = `${user.username}의 프로필 이미지`;
    const followButton = document.querySelector(".follow");

    // 기존 SVG 아이콘을 이미지로 대체
    profileLink.innerHTML = "";
    profileLink.appendChild(profileImage);

    // 사용자명 업데이트
    const usernameElement = document.querySelector(".userInfo .profile p");
    usernameElement.textContent = user.username;

    if (user._id === currentUserId) {
        followButton.style.display = "none"; // 본인인 경우 숨김
        profileLink.href = `/profile`;
    } else {
        checkFollowStatus(user.id, followButton); // 팔로우 상태 확인 후 버튼 업데이트
        profileLink.href = `/profile/${user._id}`;
    }

    // 프로필 페이지 링크 설정
}

// 작품 렌더링
function renderArtwork(artwork, currentUserId) {
    // 제목, 이미지, 내용, 댓글 등 렌더링
    document.querySelector(".post-container .title").textContent =
        artwork.title;
    document.querySelector(".post-container .post-content").textContent =
        artwork.description;
    document.querySelector(
        ".post-container .price"
    ).textContent = `${artwork.price}원`;
    document.querySelector(".post-container .date").textContent = new Date(
        artwork.uploadedAt
    ).toLocaleDateString();

    // 이미지 슬라이더 렌더링
    const sliderTrack = document.querySelector(".slider-track");
    sliderTrack.innerHTML = ""; // 기존 이미지 제거
    artwork.imageUrls.forEach((url) => {
        const img = document.createElement("img");
        img.src = url;
        img.alt = "Artwork Image";
        sliderTrack.appendChild(img);
    });

    // 좋아요 버튼 업데이트
    const likeButton = document.querySelector(".post-header .like");
    if (artwork.likes.includes(currentUserId)) {
        likeButton.classList.add("active");
    } else {
        likeButton.classList.remove("active");
    }
    likeButton.addEventListener("click", toggleLike);
}

// 댓글 목록 가져오기
async function fetchComments() {
    try {
        const response = await fetch(`${BASE_URL}/${artworkId}/comment`);
        if (!response.ok)
            throw new Error("댓글 정보를 불러오는데 실패했습니다.");
        const data = await response.json();

        renderComments(data.data);
    } catch (error) {
        console.error(error.message);
    }
}

// 댓글 렌더링
function renderComments(comments) {
    const commentContainer = document.querySelector(".comment-container");
    commentContainer.innerHTML = ""; // 기존 댓글 제거
    comments.forEach((comment) => {
        const commentDiv = document.createElement("div");
        commentDiv.className = "comment";

        const nameP = document.createElement("p");
        nameP.className = "name";
        nameP.textContent = comment.user.username;

        const contentP = document.createElement("p");
        contentP.className = "content";
        contentP.textContent = comment.text;

        commentDiv.appendChild(nameP);
        commentDiv.appendChild(contentP);

        commentContainer.appendChild(commentDiv);
    });
}

// 댓글 추가
async function addComment() {
    const input = document.querySelector(".comment-input input");
    const text = input.value.trim();
    if (!text) return alert("댓글 내용을 입력하세요.");

    try {
        const response = await fetch(`${BASE_URL}/${artworkId}/comment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text }),
        });
        if (!response.ok) throw new Error("댓글 추가에 실패했습니다.");

        input.value = ""; // 입력 필드 초기화
        fetchComments(); // 댓글 목록 갱신
    } catch (error) {
        console.error(error.message);
    }
}

// 좋아요 토글
async function toggleLike() {
    try {
        const response = await fetch(`${BASE_URL}/${artworkId}/like`, {
            method: "POST",
        });
        if (!response.ok) throw new Error("좋아요 처리에 실패했습니다.");

        fetchArtworkDetails(); // 작품 상세 정보 갱신
    } catch (error) {
        console.error(error.message);
    }
}

// 이벤트 리스너 등록
document
    .querySelector(".comment-input .submit")
    .addEventListener("click", addComment);

// 초기 데이터 로드
fetchArtworkDetails();
fetchComments();
