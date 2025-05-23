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
        submitBtn.addEventListener('click', () => {
            const selectedRating = document.querySelectorAll('.review-star[style*="color: rgb(255, 215, 0)"]').length;
            const reviewTextArea = document.querySelector('.review-text-area');
            const reviewText = reviewTextArea ? reviewTextArea.value.trim() : '';

            if (selectedRating === 0) {
                alert('Vui lòng chọn số sao đánh giá');
                return;
            }

            alert(`Đã gửi đánh giá: ${selectedRating} sao.\nNội dung: ${reviewText || '(không có nội dung)'}`);
        });
    }
});