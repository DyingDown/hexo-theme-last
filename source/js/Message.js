/* message.js */

class Message {

    /**
     * 构造函数会在实例化的时候自动执行
     */
    constructor() {
        const containerId = 'message-alert';
        // 检测下html中是否已经有这个message-alert元素
        this.containerEl = document.getElementById(containerId);

        if (!this.containerEl) {
            // 创建一个Element对象，也就是创建一个id为message-container的dom节点
            this.containerEl = document.createElement('div');
            this.containerEl.id = containerId;
            // 把message-container元素放在html的body末尾
            document.body.appendChild(this.containerEl);
        }
    }

    show({type = 'info', text = '', duration = 2000, isClose = false}) {
        let messageEl = document.createElement('div');
        // 设置消息class，这里加上move-in可以直接看到弹出效果
        messageEl.className = type + '-message message message-move-in';
        // 消息内部html字符串
        var iconStr;
        if (type == 'info') {
            iconStr = "fa-solid fa-circle-info";
        } else if (type == 'error') {
            iconStr = "fa-sharp fa-solid fa-circle-xmark";
        } else if (type == 'success') {
            iconStr = "fa-sharp fa-solid fa-circle-check";
        } else if (type == 'warning') {
            iconStr = "fa-solid fa-triangle-exclamation";
        }
        messageEl.innerHTML = `
            <div class="alert-icon"> 
                <i class="${iconStr}"> </i>
            </div>
            <div class="text">${text}</div>
        `;
        if (isClose) {
            // 创建一个关闭按钮
            let closeEl = document.createElement('div');
            closeEl.className = 'close-icon';
            closeEl.innerHTML = '<i class="fa-sharp fa-solid fa-xmark"></i>';
            // 把关闭按钮追加到message元素末尾
            messageEl.appendChild(closeEl);

            // 监听关闭按钮的click事件，触发后将调用我们的close方法
            // 我们把刚才写的移除消息封装为一个close方法
            closeEl.addEventListener('click', () => {
                this.close(messageEl)
            });
        }

        // 追加到message-container末尾
        // this.containerEl属性是我们在构造函数中创建的message-container容器
        this.containerEl.appendChild(messageEl);

        // 用setTimeout来做一个定时器
        if(duration > 0) {
            setTimeout(() => {
                // 首先把move-in这个弹出动画类给移除掉，要不然会有问题，可以自己测试下
                messageEl.className = messageEl.className.replace('message-move-in', '');
                messageEl.className += " message-move-out"
                // 增加一个message-move-out类
                messageEl.addEventListener('animationend', () => {
                    // Element对象内部有一个remove方法，调用之后可以将该元素从dom树种移除！
                    messageEl.remove();
                });
            }, duration);
        }
        
    }
    close(messageEl) {
        // 首先把move-in这个弹出动画类给移除掉，要不然会有问题，可以自己测试下
        messageEl.className = messageEl.className.replace('message-move-in', '');
        // 增加一个move-out类
        messageEl.className += 'message-move-out';

        messageEl.addEventListener('animationend', () => {
            messageEl.setAttribute('style', 'height: 0; margin: 0');
        });
        
        // 这个地方是监听动画结束事件，在动画结束后把消息从dom树中移除。
        // 如果你是在增加move-out后直接调用messageEl.remove，那么你不会看到任何动画效果
        messageEl.addEventListener('animationend', () => {
            // Element对象内部有一个remove方法，调用之后可以将该元素从dom树种移除！
            messageEl.remove();
        });
    }
}