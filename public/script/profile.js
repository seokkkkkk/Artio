document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = window.location.pathname.split("/");
    const profileId = urlParams[urlParams.length - 1]; // profileId는 URL의 마지막 부분

    // 로그인된 사용자 정보 가져오기
    async function fetchLoggedInUser() {
        try {
            const response = await fetch(`/api/users/me`, {
                method: "GET",
                credentials: "include",
            });
            if (!response.ok)
                throw new Error("로그인된 사용자 정보를 가져올 수 없습니다.");
            const { data } = await response.json();
            return data;
        } catch (error) {
            console.error(error.message);
        }
    }

    // 회원탈퇴 요청
    async function deleteAccount() {
        try {
            const confirmed = confirm("정말로 회원탈퇴를 진행하시겠습니까?");
            if (!confirmed) return;

            const response = await fetch(`/api/auth/delete`, {
                method: "DELETE",
                credentials: "include",
            });
            if (response.status === 204) {
                alert("회원탈퇴가 완료되었습니다.");
                window.location.href = "/login"; // 홈으로 리디렉션
            } else {
                const errorData = await response.json();
                alert(errorData.message || "회원탈퇴에 실패했습니다.");
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    // 사용자 정보 가져오기
    async function fetchUserProfile(userId) {
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: "GET",
                credentials: "include",
            });
            if (!response.ok)
                throw new Error("사용자 정보를 가져올 수 없습니다.");
            const { data } = await response.json();
            return data;
        } catch (error) {
            console.error(error.message);
        }
    }

    // 작품 목록 가져오기
    async function fetchUserArtworks(userId) {
        try {
            const response = await fetch(`/api/artworks/user/${userId}`, {
                method: "GET",
                credentials: "include",
            });
            if (!response.ok)
                throw new Error("작품 목록을 가져올 수 없습니다.");
            const { data } = await response.json();
            return data;
        } catch (error) {
            console.error(error.message);
        }
    }

    // 팔로우/언팔로우 상태 가져오기
    async function fetchFollowStatus(userId) {
        try {
            const response = await fetch(`/api/users/${userId}/following`, {
                method: "GET",
                credentials: "include",
            });
            if (!response.ok)
                throw new Error("팔로우 상태를 확인할 수 없습니다.");
            const { data } = await response.json();
            return data.isFollowing;
        } catch (error) {
            console.error(error.message);
        }
    }

    // 팔로우/언팔로우 요청
    async function toggleFollow(userId, isFollowing) {
        try {
            const url = isFollowing
                ? `/api/follow/unfollow/${userId}`
                : `/api/follow/follow/${userId}`;
            const method = "POST";

            const response = await fetch(url, {
                method,
                credentials: "include",
            });
            if (!response.ok) alert(response.json().message);
            return true;
        } catch (error) {
            console.error(error.message);
            return false;
        }
    }

    // 데이터 렌더링
    async function renderProfile() {
        const loggedInUser = await fetchLoggedInUser();

        // 자신인지 확인
        const isOwnProfile = loggedInUser && loggedInUser._id === profileId;

        // 사용자 프로필 정보 렌더링
        const userProfile = await fetchUserProfile(profileId);
        if (userProfile) {
            document.querySelector(".profile-name").textContent =
                userProfile.username;
            document.querySelector(".bio").textContent =
                userProfile.bio || "소개글이 없습니다.";
            document.querySelector(".profile-image").src =
                userProfile.profileImage ||
                "../../uploads/profile_images/default-profile.png";
            document.querySelector(".follower .follow-count").textContent =
                userProfile.followers.length || 0;
            document.querySelector(".following .follow-count").textContent =
                userProfile.following.length || 0;
        }

        const deleteButton = document.querySelector("#delete-account-btn");
        if (isOwnProfile) {
            deleteButton.addEventListener("click", deleteAccount);
        }

        // 자신일 경우 팔로우 버튼 숨기기
        const followButton = document.querySelector("#follow-button");
        if (isOwnProfile) {
            followButton.style.display = "none";
        } else {
            // 팔로우 버튼 상태 설정
            const isFollowing = await fetchFollowStatus(profileId);
            followButton.textContent = isFollowing ? "언팔로우" : "팔로우";

            followButton.addEventListener("click", async () => {
                const success = await toggleFollow(profileId, isFollowing);
                if (success) {
                    location.reload(); // 페이지 새로고침
                }
            });
        }

        // 작품 목록 렌더링
        const artworks = await fetchUserArtworks(profileId);
        const feedContainer = document.querySelector(".feed");
        feedContainer.innerHTML = ""; // 기존 콘텐츠 초기화
        if (artworks && artworks.length > 0) {
            artworks.forEach((artwork) => {
                const imgElement = document.createElement("img");
                imgElement.src = artwork.imageUrls[0];
                imgElement.alt = artwork.title;
                imgElement.addEventListener("click", () => {
                    window.location.href = `/post/${artwork._id}`;
                });
                feedContainer.appendChild(imgElement);
            });
        } else {
            feedContainer.innerHTML = `
                <div class="empty-feed">
                    <p>작품이 없습니다.</p>
                </div>
            `;
        }
    }

    // 프로필 페이지 렌더링
    renderProfile();
});
