document
    .getElementById("newPostForm")
    .addEventListener("submit", async (event) => {
        event.preventDefault();

        // 사용자 입력값 가져오기
        const title = document.getElementById("title").value;
        const date = document.getElementById("date").value;
        const price = document.getElementById("price").value;
        const description = document.getElementById("description").value;
        const images = document.getElementById("imageUpload").files;

        // FormData 객체 생성
        const formData = new FormData();
        formData.append("title", title);
        formData.append("date", date);
        formData.append("price", price);
        formData.append("description", description);

        // 이미지 파일 추가
        for (let i = 0; i < images.length; i++) {
            formData.append("images", images[i]);
        }

        try {
            // API 요청 보내기
            const response = await fetch("/api/artworks", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("게시물 등록 실패");
            }

            const result = await response.json();
            window.location.href = `/post/${result.data._id}`; // 상세 페이지로 이동
        } catch (error) {
            console.error("Error:", error);
            alert("게시물 등록 중 오류가 발생했습니다.");
        }
    });
