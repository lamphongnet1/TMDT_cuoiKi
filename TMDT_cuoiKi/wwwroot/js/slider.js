document.addEventListener('DOMContentLoaded', function () {
    // Lấy các phần tử cần thiết
    const productCardsContainer = document.querySelector('.product-cards-container');
    const productCards = document.querySelector('.product-cards');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');

    // Lấy tất cả sản phẩm ban đầu
    const originalCards = document.querySelectorAll('.product-card');
    let cardWidth = originalCards[0].offsetWidth + 24; // Thêm khoảng cách giữa các sản phẩm (gap)
    let currentPosition = 0;
    let autoScrollInterval;
    let isTransitioning = false;

    // Clone sản phẩm nhiều lần để đảm bảo đủ sản phẩm cho cuộn vô hạn
    function setupInfiniteCarousel() {
        // Xác định số lượng sản phẩm cần clone để đảm bảo đủ cho carousel
        const containerWidth = productCardsContainer.offsetWidth;
        const viewportCards = Math.ceil(containerWidth / cardWidth) + 1;
        const totalClones = Math.max(viewportCards * 3, originalCards.length * 3);

        // Clone nhiều bản sao
        for (let i = 0; i < totalClones / originalCards.length; i++) {
            originalCards.forEach(card => {
                const clone = card.cloneNode(true);
                productCards.appendChild(clone);
            });
        }

        // Định vị ban đầu để hiển thị một phần của bộ sản phẩm đầu tiên
        currentPosition = -originalCards.length * cardWidth;
        productCards.style.transform = `translateX(${currentPosition}px)`;
    }

    // Xác định số lượng sản phẩm hiển thị dựa trên kích thước container
    function getVisibleCardCount() {
        const containerWidth = productCardsContainer.offsetWidth;
        return Math.floor(containerWidth / cardWidth);
    }

    // Xử lý sự kiện nút next
    function moveNext() {
        if (isTransitioning) return;
        isTransitioning = true;

        // Di chuyển một sản phẩm
        currentPosition -= cardWidth;

        // Áp dụng hiệu ứng chuyển động
        productCards.style.transition = 'transform 0.5s ease';
        productCards.style.transform = `translateX(${currentPosition}px)`;

        // Kiểm tra và đặt lại vị trí khi cần
        setTimeout(() => {
            const totalWidth = originalCards.length * cardWidth;
            if (Math.abs(currentPosition) % totalWidth <= cardWidth) {
                // Đặt lại vị trí về thời điểm tương đương trong bộ sản phẩm đầu tiên
                const offset = currentPosition % totalWidth;
                productCards.style.transition = 'none';
                currentPosition = offset || -totalWidth;
                productCards.style.transform = `translateX(${currentPosition}px)`;
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
        currentPosition += cardWidth;

        // Áp dụng hiệu ứng chuyển động
        productCards.style.transition = 'transform 0.5s ease';
        productCards.style.transform = `translateX(${currentPosition}px)`;

        // Kiểm tra và đặt lại vị trí khi cần
        setTimeout(() => {
            const totalWidth = originalCards.length * cardWidth;
            if (currentPosition > -cardWidth) {
                // Đặt lại vị trí về thời điểm tương đương trong bộ sản phẩm cuối cùng
                productCards.style.transition = 'none';
                currentPosition -= totalWidth;
                productCards.style.transform = `translateX(${currentPosition}px)`;
            }
            isTransitioning = false;
        }, 500);

        // Reset auto scroll timer
        resetAutoScroll();
    }

    // Tự động cuộn sau 3 giây
    function startAutoScroll() {
        autoScrollInterval = setInterval(moveNext, 3000);
    }

    // Reset auto scroll timer
    function resetAutoScroll() {
        clearInterval(autoScrollInterval);
        startAutoScroll();
    }

    // Xử lý sự kiện transitionend để đảm bảo không có khoảng trống
    productCards.addEventListener('transitionend', function () {
        const totalWidth = originalCards.length * cardWidth;

        // Kiểm tra nếu đã cuộn quá xa về cuối
        if (Math.abs(currentPosition) > totalWidth * 2) {
            productCards.style.transition = 'none';
            currentPosition = -totalWidth - (Math.abs(currentPosition) % totalWidth);
            productCards.style.transform = `translateX(${currentPosition}px)`;
        }

        // Kiểm tra nếu đã cuộn quá xa về đầu
        if (currentPosition > 0) {
            productCards.style.transition = 'none';
            currentPosition = -totalWidth + (currentPosition % totalWidth);
            productCards.style.transform = `translateX(${currentPosition}px)`;
        }
    });

    // Khởi tạo carousel
    setupInfiniteCarousel();
    startAutoScroll();

    // Thêm event listeners
    nextButton.addEventListener('click', moveNext);
    prevButton.addEventListener('click', movePrev);

    // Xử lý khi cửa sổ thay đổi kích thước
    window.addEventListener('resize', function () {
        // Tạm dừng auto scroll
        clearInterval(autoScrollInterval);

        // Cập nhật lại kích thước thẻ và vị trí
        const newCardWidth = document.querySelector('.product-card').offsetWidth + 24;
        const totalWidth = originalCards.length * newCardWidth;
        const relativePosition = currentPosition % (originalCards.length * cardWidth);
        const ratio = relativePosition / (originalCards.length * cardWidth);

        // Cập nhật biến cardWidth
        cardWidth = newCardWidth;

        // Tính toán lại vị trí tương đối
        currentPosition = Math.floor(ratio * totalWidth) - totalWidth;

        // Áp dụng vị trí mới
        productCards.style.transition = 'none';
        productCards.style.transform = `translateX(${currentPosition}px)`;

        // Khởi động lại auto scroll sau khi điều chỉnh kích thước
        setTimeout(startAutoScroll, 200);
    });

    // Dừng auto scroll khi người dùng hover vào carousel
    productCardsContainer.addEventListener('mouseenter', function () {
        clearInterval(autoScrollInterval);
    });

    // Tiếp tục auto scroll khi người dùng rời chuột khỏi carousel
    productCardsContainer.addEventListener('mouseleave', function () {
        startAutoScroll();
    });

    // Thêm sự kiện touch cho thiết bị di động
    let touchStartX = 0;
    let touchEndX = 0;

    productCardsContainer.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(autoScrollInterval);
    }, { passive: true });

    productCardsContainer.addEventListener('touchend', function (e) {
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
});