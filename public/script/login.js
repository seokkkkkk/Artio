async function handleLogin(event) {
    event.preventDefault(); // 기본 폼 제출 동작 중단

    const formData = new FormData(event.target);
    const formObject = Object.fromEntries(formData.entries()); // 입력값 객체화

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formObject),
        });

        const result = await response.json();

        if (response.ok) {
            window.location.href = "/"; // 홈 페이지로 이동
        } else {
            alert(result.message || "로그인에 실패했습니다.");
            window.location.reload(); // 페이지 새로고침
        }
    } catch (error) {
        alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
}
