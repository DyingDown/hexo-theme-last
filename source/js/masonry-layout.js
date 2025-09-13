// 智能瀑布流布局 - 根据卡片数量选择最佳布局方式
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.cols');
    if (!container) return;
    
    // 计算卡片数量
    const boxes = container.querySelectorAll('.box');
    const count = boxes.length;
    
    // 根据数量设置布局模式
    if (count <= 4) {
        container.setAttribute('data-count', count.toString());
    } else {
        // 5个或更多时移除data-count，使用瀑布流
        container.removeAttribute('data-count');
    }
    
    // 如果是瀑布流模式（5个以上），实现更好的列平衡
    if (count > 4) {
        balanceColumns();
    }
});

// 平衡列高度 - 让各列底部尽量对齐
function balanceColumns() {
    const container = document.querySelector('.cols');
    if (!container) return;
    
    // 等待图片加载完成后重新平衡
    const images = container.querySelectorAll('img');
    let loadedImages = 0;
    
    const checkBalance = () => {
        loadedImages++;
        if (loadedImages === images.length) {
            // 所有图片加载完成，进行列平衡
            setTimeout(() => {
                optimizeColumnBalance();
            }, 100);
        }
    };
    
    images.forEach(img => {
        if (img.complete) {
            checkBalance();
        } else {
            img.addEventListener('load', checkBalance);
            img.addEventListener('error', checkBalance);
        }
    });
    
    // 如果没有图片，直接进行平衡
    if (images.length === 0) {
        optimizeColumnBalance();
    }
}

// 优化列平衡算法
function optimizeColumnBalance() {
    const container = document.querySelector('.cols');
    if (!container || container.hasAttribute('data-count')) return;
    
    // 检查当前列数
    const computedStyle = window.getComputedStyle(container);
    const columnCount = parseInt(computedStyle.columnCount) || 4;
    
    if (columnCount <= 1) return;
    
    // 获取所有卡片
    const boxes = Array.from(container.querySelectorAll('.box'));
    const totalBoxes = boxes.length;
    
    // 如果卡片数量刚好是列数的倍数，使用均匀分布
    if (totalBoxes % columnCount === 0) {
        container.style.columnFill = 'auto';
    } else {
        // 否则使用平衡模式
        container.style.columnFill = 'balance';
    }
    
    // 动态调整列间距以优化视觉效果
    const boxesPerColumn = Math.ceil(totalBoxes / columnCount);
    if (boxesPerColumn <= 2) {
        // 每列卡片较少时，减少列间距
        const currentGap = parseInt(computedStyle.columnGap) || 15;
        container.style.columnGap = Math.max(currentGap * 0.8, 10) + 'px';
    }
}

// 响应式重新计算
window.addEventListener('resize', debounce(() => {
    const container = document.querySelector('.cols');
    if (container && !container.hasAttribute('data-count')) {
        optimizeColumnBalance();
    }
}, 250));

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}