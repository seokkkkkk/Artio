document.addEventListener("DOMContentLoaded", async () => {
    async function getUserInfo() {
        const user = await fetch("/api/users/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());

        const profileLink = document.querySelector("#profile-link");

        profileLink.removeAttribute("href");
        profileLink.setAttribute("href", `/profile/${user.data._id}`);

        const logoutLink = document.querySelector("#logout-link");

        logoutLink.addEventListener("click", async () => {
            const response = await fetch("/api/auth/logout", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                console.error("로그아웃에 실패했습니다.");
                return;
            }

            location.href = "/";
        });
    }

    getUserInfo();
});
