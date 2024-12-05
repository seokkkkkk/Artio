document.addEventListener("DOMContentLoaded", () => {
    const editForm = document.getElementById("edit-profile-form");

    async function fetchCurrentProfile() {
        try {
            const response = await fetch(`/api/users/me`, {
                method: "GET",
                credentials: "include",
            });
            if (!response.ok)
                throw new Error("프로필 정보를 가져오지 못했습니다.");
            const { data } = await response.json();
            document.getElementById("username").value = data.username;
            document.getElementById("bio").value = data.bio;
        } catch (error) {
            console.error(error.message);
        }
    }

    async function updateProfile(formData) {
        try {
            const response = await fetch(`/api/users/me`, {
                method: "PATCH",
                credentials: "include",
                body: formData,
            });
            if (!response.ok) throw new Error("프로필을 수정하지 못했습니다.");
            alert("프로필이 성공적으로 수정되었습니다!");
            window.location.href = `/`;
        } catch (error) {
            console.error(error.message);
        }
    }

    editForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(editForm);
        await updateProfile(formData);
    });

    fetchCurrentProfile();
});
