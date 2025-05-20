document.addEventListener('DOMContentLoaded', function () {
    // Lấy tất cả các tab item
    const sidebarItems = document.querySelectorAll('.sidebar-item');

    // Gán sự kiện click cho từng tab
    sidebarItems.forEach(item => {
        item.addEventListener('click', function () {
            // Xóa class active khỏi tất cả các tab
            sidebarItems.forEach(tab => {
                tab.classList.remove('active');
            });

            // Thêm class active cho tab được click
            this.classList.add('active');

            // Lấy id của tab content tương ứng
            const tabId = this.getAttribute('data-tab');

            // Ẩn tất cả tab content
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => {
                content.classList.remove('active');
            });

            // Hiển thị tab content tương ứng
            document.getElementById(tabId).classList.add('active');
        });
    });
});