/**
 * Image Search App - Phiên bản Web Tĩnh (Không API, Không Server)
 * Đọc ảnh trực tiếp từ thư mục cùng cấp
 */
class ImageSearchApp {
    constructor() {
        // Tên thư mục chứa ảnh (đặt cùng chỗ với file html)
        this.IMAGE_FOLDER = "./hinhanh"; 
        
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

        // Ghép đường dẫn tới ảnh. Ví dụ: ./hinhanh/12345678.jpg
        const imageUrl = `${this.IMAGE_FOLDER}/${imageId}.jpg`;

        try {
            await this.displayImage(imageUrl, imageId);
        } catch (err) {
            this.showError(`Không tìm thấy ảnh của mã: ${imageId}. Vui lòng kiểm tra lại.`);
        } finally {
            this.isSearching = false;
            this.searchBtn.disabled = false;
        }
    }

    async displayImage(url, imageId) {
        return new Promise((resolve, reject) => {
            // Trình duyệt sẽ thử tải ảnh từ URL
            this.resultImage.onload = () => {
                this.imageIdDisplay.textContent = `Mã: ${imageId}`;
                this.imageTitle.textContent = "Đã tìm thấy ảnh";
                this.showImageContainer();
                resolve();
            };
            // Nếu không có file ảnh đó, nó sẽ nhảy vào lỗi (onerror)
            this.resultImage.onerror = () => {
                reject(new Error("File không tồn tại"));
            };
            
            // Gắn URL để kích hoạt quá trình tải
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