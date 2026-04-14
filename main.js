/**
 * Image Search App - Phiên bản Web Tĩnh (Hỗ trợ chia thư mục con)
 */
class ImageSearchApp {
    constructor() {
        this.IMAGE_FOLDER = "./hinhanh"; 
        
        // 👇 CẤU HÌNH THƯ MỤC CỦA BẠN TẠI ĐÂY 👇
        // Điền chính xác tên các thư mục con bạn đã tạo trong thư mục 'hinhanh'.
        // Dấu "" (rỗng) là để dặn code tìm cả ở thư mục 'hinhanh' bên ngoài cùng.
        this.SUB_FOLDERS = ["12TN1", "12TN2", "12TN3", "12XH1", "12XH2A", "12XH2B", "12XH2C", "12XH3", ""]; 
        
        this.isSearching = false;
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.imageIdInput = document.getElementById("imageId");
        this.searchBtn = document.getElementById("searchBtn");
        this.loadingSpinner = document.getElementById("loadingSpinner");
        this.imageContainer = document.getElementById("imageContainer");
        this.errorMessage = document.getElementById("errorMessage");
        this.resultImage = document.getElementById("resultImage");
        this.imageIdDisplay = document.getElementById("imageIdDisplay");
        this.imageTitle = document.getElementById("imageTitle");
        this.errorText = document.getElementById("errorText");
        
        this.downloadBtn = document.getElementById("downloadBtn");
        this.fullscreenBtn = document.getElementById("fullscreenBtn");
        this.imageModal = document.getElementById("imageModal");
        this.closeModal = document.getElementById("closeModal");
        this.modalImage = document.getElementById("modalImage");
    }

    bindEvents() {
        this.searchBtn.addEventListener("click", () => this.performSearch());
        this.imageIdInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") this.performSearch();
        });
        
        if(this.downloadBtn) this.downloadBtn.addEventListener("click", () => this.downloadImage());
        if(this.fullscreenBtn) this.fullscreenBtn.addEventListener("click", () => this.openFullscreen());
        if(this.closeModal) this.closeModal.addEventListener("click", () => this.closeFullscreen());
    }

    async performSearch() {
        if (this.isSearching) return;
        
        const imageId = this.imageIdInput.value.trim();
        if (!imageId) {
            this.showError("Vui lòng nhập CCCD/Mã học sinh (ví dụ: 12345678)");
            return;
        }

        this.isSearching = true;
        this.showLoading();

        let foundImageUrl = null;

        // Tự động quét qua các thư mục con đã khai báo
        for (const subFolder of this.SUB_FOLDERS) {
            // Xây dựng đường dẫn: Nếu subFolder rỗng thì là ./hinhanh, nếu có thì là ./hinhanh/lop10
            const basePath = subFolder ? `${this.IMAGE_FOLDER}/${subFolder}` : this.IMAGE_FOLDER;
            const testUrl = `${basePath}/${imageId}.jpg`;

            try {
                // Thử kiểm tra xem file có tồn tại không
                const exists = await this.checkImageExists(testUrl);
                if (exists) {
                    foundImageUrl = testUrl; // Đã tìm thấy!
                    break; // Ngưng tìm kiếm các thư mục khác
                }
            } catch (err) {
                // Lỗi (không tìm thấy ảnh ở thư mục này), tiếp tục vòng lặp
            }
        }

        if (foundImageUrl) {
            await this.displayImage(foundImageUrl, imageId);
        } else {
            this.showError(`Không tìm thấy ảnh của mã: ${imageId}. Vui lòng kiểm tra lại.`);
        }

        this.isSearching = false;
        this.searchBtn.disabled = false;
    }

    // Hàm phụ trợ để kiểm tra file ảnh có tồn tại trên GitHub không
    checkImageExists(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

    async displayImage(url, imageId) {
        return new Promise((resolve) => {
            this.resultImage.onload = () => {
                this.imageIdDisplay.textContent = `Mã: ${imageId}`;
                this.imageTitle.textContent = "Đã tìm thấy ảnh";
                this.showImageContainer();
                resolve();
            };
            this.resultImage.src = url; 
        });
    }

    showLoading() {
        this.hideAll();
        this.loadingSpinner.style.display = "block";
        this.searchBtn.disabled = true;
    }

    showImageContainer() {
        this.hideAll();
        this.imageContainer.style.display = "block";
    }

    showError(msg) {
        this.hideAll();
        this.errorText.textContent = msg;
        this.errorMessage.style.display = "block";
    }

    hideAll() {
        this.loadingSpinner.style.display = "none";
        this.imageContainer.style.display = "none";
        this.errorMessage.style.display = "none";
    }

    downloadImage() {
        const link = document.createElement("a");
        link.href = this.resultImage.src;
        link.download = `${this.imageIdInput.value.trim()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    openFullscreen() {
        this.modalImage.src = this.resultImage.src;
        this.imageModal.style.display = "flex";
        document.body.style.overflow = "hidden";
    }

    closeFullscreen() {
        this.imageModal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.imageSearchApp = new ImageSearchApp();
});
