async function handleSignup(event) {
    event.preventDefault(); // 기본 폼 제출 동작 중단

    const formData = new FormData(event.target);
    const formObject = Object.fromEntries(formData.entries()); // 입력값 객체화

    if (formObject.password !== formObject.confirmPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
    }

    try {
        const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formObject),
        });

        const result = await response.json();

        if (response.ok) {
            window.location.href = "/login"; // 로그인 페이지로 이동
        } else {
            alert(result.message || "회원가입에 실패했습니다.");
            window.location.reload(); // 페이지 새로고침
        }
    } catch (error) {
        alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
}
