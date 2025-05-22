document.addEventListener('DOMContentLoaded', function () {
    const mainImage = document.getElementById('mainImage');
    const mainImageContainer = document.querySelector('.main-image-container');
    const thumbImages = document.querySelectorAll('.thumb-image');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Xử lý click vào thumbnail
    thumbImages.forEach((thumb, index) => {
        thumb.addEventListener('click', function () {
            const newImageSrc = this.getAttribute('data-main');

            // Không làm gì nếu click vào ảnh đang active
            if (this.classList.contains('active')) {
                return;
            }

            // Hiển thị loading
            if (loadingOverlay) {
                loadingOverlay.style.display = 'flex';
            }

            // Bỏ active class từ tất cả thumbnails
            thumbImages.forEach(img => img.classList.remove('active'));

            // Thêm active class cho thumbnail được click
            this.classList.add('active');

            // Hiệu ứng fade out ảnh chính
            mainImage.classList.remove('loaded');
            mainImage.classList.add('changing');

            // Preload ảnh mới
            const newImage = new Image();
            newImage.onload = function () {
                // Đợi hiệu ứng fade out hoàn thành
                setTimeout(() => {
                    // Ẩn loading
                    if (loadingOverlay) {
                        loadingOverlay.style.display = 'none';
                    }

                    // Cập nhật src ảnh chính
                    mainImage.src = newImageSrc;

                    // Hiệu ứng fade in
                    mainImage.classList.remove('changing');
                    mainImage.classList.add('loaded');
                }, 300);
            };

            newImage.onerror = function () {
                // Xử lý lỗi
                setTimeout(() => {
                    if (loadingOverlay) {
                        loadingOverlay.style.display = 'none';
                    }
                    mainImage.classList.remove('changing');
                    mainImage.classList.add('loaded');
                    console.error('Không thể tải ảnh:', newImageSrc);
                }, 300);
            };

            // Bắt đầu tải ảnh
            newImage.src = newImageSrc;
        });
    });

    // Xử lý hiệu ứng zoom tại điểm rê chuột
    mainImageContainer.addEventListener('mousemove', function (e) {
        if (mainImage.classList.contains('changing')) return;

        const rect = this.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Cập nhật transform-origin và zoom
        mainImage.style.transformOrigin = `${x}% ${y}%`;
        mainImage.style.transform = 'scale(2)';
    });

    // Hover vào container để zoom
    mainImageContainer.addEventListener('mouseenter', function () {
        if (!mainImage.classList.contains('changing')) {
            mainImage.style.transition = 'transform 0.2s ease';
        }
    });

    // Rê chuột ra ngoài để reset
    mainImageContainer.addEventListener('mouseleave', function () {
        mainImage.style.transformOrigin = 'center center';
        mainImage.style.transform = 'scale(1)';
    });

    // Đặt thumbnail đầu tiên làm active
    if (thumbImages.length > 0) {
        thumbImages[0].classList.add('active');
    }
});