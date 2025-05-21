document.addEventListener('DOMContentLoaded', function () {
    // Tìm tất cả các carousel trên trang
    const carousels = document.querySelectorAll('.newproduct-container, .best_seller-container');

    // Khởi tạo mỗi carousel riêng biệt
    carousels.forEach(function (carousel) {
        initCarousel(carousel);
    });

    function initCarousel(carouselContainer) {
        const slider = carouselContainer.querySelector('.product-slider');
        const prevButton = carouselContainer.querySelector('.carousel-button.prev');
        const nextButton = carouselContainer.querySelector('.carousel-button.next');

        // Lấy tất cả sản phẩm ban đầu trong carousel này
        const originalCards = carouselContainer.querySelectorAll('.product-card_2');
        if (!originalCards.length) return; // Tránh lỗi nếu không có sản phẩm

        // Các biến cần thiết
        let currentPosition = 0;
        let cardWidth = originalCards[0].offsetWidth;
        let cardGap = 20; // Khoảng cách giữa các sản phẩm (nếu có)
        let cardTotalWidth = cardWidth + cardGap;
        let isTransitioning = false;
        let autoScrollInterval;
        const AUTO_SCROLL_DELAY = 3000; // 3 giây

        // Tính toán cardGap từ CSS nếu có thể
        function updateCardDimensions() {
            cardWidth = originalCards[0].offsetWidth;
            const styles = window.getComputedStyle(originalCards[0]);
            cardGap = parseInt(styles.marginRight) || 20; // Sử dụng margin-right hoặc mặc định là 20px
            cardTotalWidth = cardWidth + cardGap;
        }

        updateCardDimensions();

        // Clone sản phẩm nhiều lần để đảm bảo đủ sản phẩm cho cuộn vô hạn
        function setupInfiniteCarousel() {
            // Xóa tất cả phần tử hiện tại trong slider 
            // (ngoại trừ những sản phẩm gốc đã có trong DOM)
            const clones = slider.querySelectorAll('.product-card_2.clone');
            clones.forEach(clone => clone.remove());

            // Xác định số lượng sản phẩm cần clone để đảm bảo đủ cho carousel
            const containerWidth = slider.parentElement.offsetWidth;
            const viewportCards = Math.ceil(containerWidth / cardTotalWidth) + 1;
            const totalClones = Math.max(viewportCards * 3, originalCards.length * 3);

            // Clone nhiều bản sao
            for (let i = 0; i < Math.ceil(totalClones / originalCards.length); i++) {
                originalCards.forEach(card => {
                    const clone = card.cloneNode(true);
                    clone.classList.add('clone');
                    slider.appendChild(clone);
                });
            }

            // Định vị ban đầu để hiển thị một phần của bộ sản phẩm đầu tiên
            currentPosition = -originalCards.length * cardTotalWidth;
            slider.style.transform = `translateX(${currentPosition}px)`;
        }

        // Xử lý sự kiện nút next
        function moveNext() {
            if (isTransitioning) return;
            isTransitioning = true;

            // Di chuyển một sản phẩm
            currentPosition -= cardTotalWidth;

            // Áp dụng hiệu ứng chuyển động
            slider.style.transition = 'transform 0.5s ease';
            slider.style.transform = `translateX(${currentPosition}px)`;

            // Kiểm tra và đặt lại vị trí khi cần
            setTimeout(() => {
                const totalWidth = originalCards.length * cardTotalWidth;
                if (Math.abs(currentPosition) % totalWidth <= cardTotalWidth) {
                    // Đặt lại vị trí về thời điểm tương đương trong bộ sản phẩm đầu tiên
                    const offset = currentPosition % totalWidth;
                    slider.style.transition = 'none';
                    currentPosition = offset || -totalWidth;
                    slider.style.transform = `translateX(${currentPosition}px)`;
                }
                isTransitioning = false;
            }, 500);

            // Reset auto scroll timer
            resetAutoScroll();
        }

        // Xử lý sự kiện nút prev
        function movePrev() {
            if (isTransitioning) return;
            isTransitioning = true;

            // Di chuyển một sản phẩm
            currentPosition += cardTotalWidth;

            // Áp dụng hiệu ứng chuyển động
            slider.style.transition = 'transform 0.5s ease';
            slider.style.transform = `translateX(${currentPosition}px)`;

            // Kiểm tra và đặt lại vị trí khi cần
            setTimeout(() => {
                const totalWidth = originalCards.length * cardTotalWidth;
                if (currentPosition > -cardTotalWidth) {
                    // Đặt lại vị trí về thời điểm tương đương trong bộ sản phẩm cuối cùng
                    slider.style.transition = 'none';
                    currentPosition -= totalWidth;
                    slider.style.transform = `translateX(${currentPosition}px)`;
                }
                isTransitioning = false;
            }, 500);

            // Reset auto scroll timer
            resetAutoScroll();
        }

        // Tự động cuộn sau 3 giây
        function startAutoScroll() {
            autoScrollInterval = setInterval(moveNext, AUTO_SCROLL_DELAY);
        }

        // Reset auto scroll timer
        function resetAutoScroll() {
            clearInterval(autoScrollInterval);
            startAutoScroll();
        }

        // Xử lý sự kiện transitionend để đảm bảo không có khoảng trống
        slider.addEventListener('transitionend', function () {
            const totalWidth = originalCards.length * cardTotalWidth;

            // Kiểm tra nếu đã cuộn quá xa về cuối
            if (Math.abs(currentPosition) > totalWidth * 2) {
                slider.style.transition = 'none';
                currentPosition = -totalWidth - (Math.abs(currentPosition) % totalWidth);
                slider.style.transform = `translateX(${currentPosition}px)`;
            }

            // Kiểm tra nếu đã cuộn quá xa về đầu
            if (currentPosition > 0) {
                slider.style.transition = 'none';
                currentPosition = -totalWidth + (currentPosition % totalWidth);
                slider.style.transform = `translateX(${currentPosition}px)`;
            }
        });

        // Khởi tạo carousel
        setupInfiniteCarousel();
        startAutoScroll();

        // Event listeners cho các nút
        prevButton.addEventListener('click', movePrev);
        nextButton.addEventListener('click', moveNext);

        // Xử lý khi cửa sổ thay đổi kích thước (chỉ thiết lập một lần cho mỗi carousel)
        const resizeHandler = function () {
            // Tạm dừng auto scroll
            clearInterval(autoScrollInterval);

            // Cập nhật lại kích thước thẻ và vị trí
            updateCardDimensions();
            const totalWidth = originalCards.length * cardTotalWidth;
            const relativePosition = currentPosition % (originalCards.length * cardTotalWidth);
            const ratio = relativePosition / (originalCards.length * cardTotalWidth);

            // Tính toán lại vị trí tương đối
            currentPosition = Math.floor(ratio * totalWidth) - totalWidth;

            // Áp dụng vị trí mới
            slider.style.transition = 'none';
            slider.style.transform = `translateX(${currentPosition}px)`;

            // Thiết lập lại carousel với kích thước mới
            setupInfiniteCarousel();

            // Khởi động lại auto scroll sau khi điều chỉnh kích thước
            setTimeout(startAutoScroll, 200);
        };

        window.addEventListener('resize', resizeHandler);

        // Dừng auto scroll khi người dùng hover vào carousel
        slider.addEventListener('mouseenter', function () {
            clearInterval(autoScrollInterval);
        });

        // Tiếp tục auto scroll khi người dùng rời chuột khỏi carousel
        slider.addEventListener('mouseleave', function () {
            startAutoScroll();
        });

        // Thêm sự kiện touch cho thiết bị di động
        let touchStartX = 0;
        let touchEndX = 0;

        slider.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
            clearInterval(autoScrollInterval);
        }, { passive: true });

        slider.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoScroll();
        }, { passive: true });

        function handleSwipe() {
            if (touchEndX < touchStartX) {
                // Vuốt sang trái - chuyển đến slide tiếp theo
                moveNext();
            } else if (touchEndX > touchStartX) {
                // Vuốt sang phải - chuyển đến slide trước
                movePrev();
            }
        }

        // Make sure slider is properly positioned after images load
        window.addEventListener('load', function () {
            updateCardDimensions();
            setupInfiniteCarousel();
        });
    }
});