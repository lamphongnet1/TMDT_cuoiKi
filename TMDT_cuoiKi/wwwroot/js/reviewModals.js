document.addEventListener('DOMContentLoaded', function () {
    // Basic functionality for the stars
    const reviewStars = document.querySelectorAll('.review-star');

    reviewStars.forEach((star, index) => {
        star.addEventListener('click', () => {
            // Reset all stars
            reviewStars.forEach(s => s.style.color = '#FFD700');

            // Fill selected star and all before it
            for (let i = 0; i <= index; i++) {
                reviewStars[i].style.color = '#FFD700';
            }

            // Make stars after it gray
            for (let i = index + 1; i < reviewStars.length; i++) {
                reviewStars[i].style.color = '#ccc';
            }
        });
    });

    // Show modal with animation when buy button is clicked
    const buyButton = document.getElementById("buy-button");
    if (buyButton) {
        buyButton.addEventListener("click", function () {
            const modalWrapper = document.getElementById("review-modal-wrapper");
            if (modalWrapper) {
                modalWrapper.style.display = "flex";
                // Trigger animation after display is set
                setTimeout(() => {
                    modalWrapper.classList.add("show");
                }, 10);
            }
        });
    }

    // Close button functionality with animation
    const closeBtn = document.querySelector('.review-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            const modalWrapper = document.getElementById("review-modal-wrapper");
            if (modalWrapper) {
                modalWrapper.classList.remove("show");
                setTimeout(() => {
                    modalWrapper.style.display = "none";
                }, 300);
            }
        });
    }

    // Close modal when clicking outside with animation
    const modalWrapper = document.getElementById("review-modal-wrapper");
    if (modalWrapper) {
        modalWrapper.addEventListener('click', function (e) {
            // Only close if clicking on the wrapper (background), not on the modal content
            if (e.target === modalWrapper) {
                modalWrapper.classList.remove("show");
                setTimeout(() => {
                    modalWrapper.style.display = "none";
                }, 300);
            }
        });
    }

    // Submit button functionality
    const submitBtn = document.querySelector('.review-submit-btn');

    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            const selectedRating = document.querySelectorAll('.review-star[style*="color: rgb(255, 215, 0)"]').length;
            const reviewTextArea = document.querySelector('.review-text-area');
            const reviewText = reviewTextArea ? reviewTextArea.value.trim() : '';

            if (selectedRating === 0) {
                alert('Vui lòng chọn số sao đánh giá');
                return;
            }

            const productId = window.productId || document.getElementById('review-modal-wrapper')?.dataset?.productid;

            if (!productId) {
                alert('Không xác định được sản phẩm cần đánh giá');
                return;
            }

            try {
                const response = await fetch('/Home/SubmitDanhGia', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        idSanPham: productId,
                        soSao: selectedRating,
                        noiDung: reviewText
                    })
                });

                const result = await response.json();

                if (result.success) {
                    alert('Gửi đánh giá thành công!');
                    location.reload();
                } else {
                    alert('Gửi đánh giá thất bại: ' + result.message);
                }
            } catch (error) {
                console.error('Lỗi gửi đánh giá:', error);
                alert('Đã xảy ra lỗi khi gửi đánh giá.');
            }
        });
    }

});