export function initImageViewer(containerSelector = "#post-content img") {
    const images = Array.from(document.querySelectorAll(containerSelector));
    console.log(images)

    if (images.length === 0) return;

    // 创建弹窗元素
    const modal = document.createElement("div");
    modal.classList.add("image-modal");
    modal.innerHTML = `
        <button class="close-btn"><i class="fa-sharp fa-solid fa-xmark"></i></button>
        <button class="prev-btn"><i class="fa-solid fa-caret-left"></i></button>
        <img src="" alt="Preview">
        <button class="next-btn"><i class="fa-solid fa-caret-right"></i></button>
    `;
    document.body.appendChild(modal);

    const modalImg = modal.querySelector("img");
    const closeBtn = modal.querySelector(".close-btn");
    const prevBtn = modal.querySelector(".prev-btn");
    const nextBtn = modal.querySelector(".next-btn");

    let currentIndex = 0;

    function openModal(index) {
        currentIndex = index;
        modalImg.src = images[index].src;
        modal.style.display = "flex";
    }

    function closeModal() {
        modal.style.display = "none";
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % images.length;
        modalImg.src = images[currentIndex].src;
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        modalImg.src = images[currentIndex].src;
    }

    images.forEach((img, index) => {
        img.style.cursor = "pointer"; // 让可放大的图片有指示性
        img.addEventListener("click", () => openModal(index));
    });

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });
    nextBtn.addEventListener("click", showNext);
    prevBtn.addEventListener("click", showPrev);

    document.addEventListener("keydown", (e) => {
        if (modal.style.display === "flex") {
            if (e.key === "Escape") closeModal();
            if (e.key === "ArrowRight") showNext();
            if (e.key === "ArrowLeft") showPrev();
        }
    });
}
