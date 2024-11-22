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
    }

    getUserInfo();
});
