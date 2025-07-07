//更新訊息列表
window.updateMessageList = function updateMessageList() {
    const messageList = document.getElementById('message-list');
    if (!messageList) return;
    messageList.innerHTML = '';
    messages.forEach((message, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('message_style');

        const messageDiv = document.createElement('div');
        messageDiv.innerHTML = message;
        const containsImage = messageDiv.querySelector('img') !== null;

        const displayDiv = document.createElement('div');
        displayDiv.innerHTML = containsImage ? messageDiv.innerHTML : messageDiv.textContent;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = translations[currentLanguage].deleteButtonText;
        deleteButton.onclick = () => {
            messages.splice(index, 1);
            updateMessageList();
        };

        listItem.appendChild(displayDiv);
        listItem.appendChild(deleteButton);
        messageList.appendChild(listItem);
    });
};

//更新快速訊息選單
window.updateQuickMenu = function updateQuickMenu() {
    const quickMenu = document.getElementById('quick-menu');
    if (!quickMenu) return;
    quickMenu.innerHTML = '';
    quickMessages.forEach((message, index) => {
        const listItem = document.createElement('li');
        listItem.style.marginBottom = '5px';

        const messageDiv = document.createElement('div');
        messageDiv.innerHTML = message;
        const containsImage = messageDiv.querySelector('img') !== null;

        const displayDiv = document.createElement('div');
        displayDiv.innerHTML = containsImage ? messageDiv.innerHTML : messageDiv.textContent;
        displayDiv.style.color = 'white';

        const sendButton = document.createElement('button');
        sendButton.textContent = translations[currentLanguage].sendButtonText;
        sendButton.style.marginLeft = '10px';
        sendButton.onclick = () => sendMessage(message);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = translations[currentLanguage].deleteButtonText;
        deleteButton.style.marginLeft = '5px';
        deleteButton.onclick = () => {
            quickMessages.splice(index, 1);
            updateQuickMenu();
        };

        listItem.appendChild(displayDiv);
        listItem.appendChild(sendButton);
        listItem.appendChild(deleteButton);
        quickMenu.appendChild(listItem);
    });
};

// 新增訊息到訊息列表
window.addMessage = function addMessage() {
    let customMessage = document.getElementById('message-input').value.trim();
    if (customMessage) {

        // 做處理 :貼圖: 轉換成 <img>
        const emojiRegex = /:([^:]+):/g;
        customMessage = customMessage.replace(emojiRegex, (match, emojiName) => {
            emojiName = ":" + emojiName + ":"; // 恢復原始表情名稱（例如 :貼圖:）
            if (emojiToImageMap.has(emojiName)) {
                let emojiImage = emojiToImageMap.get(emojiName); // 獲取 HTMLImageElement
                // 如果 emojiImage 是一個 HTMLImageElement，則獲取它的 src
                if (emojiImage instanceof HTMLImageElement) {
                    return emojiImage.outerHTML; // 返回 <img> 標籤的 HTML
                }
                return emojiImage; // 否則直接返回圖片 URL
            }
            return match; // 如果沒有對應的表情，則保留原樣
        });
        console.log(customMessage)
    
        messages.push(customMessage);
        document.getElementById('message-input').value = '';
        updateMessageList();
    }
}

//將訊息放入message list
window.getMessage = function getMessage() {
    const messageBox = document.querySelector("div#input[contenteditable='']");
    if (messageBox) {
        const message = messageBox.innerHTML; // 讀取輸入框內容
        
        // 如果訊息非空，加入到快捷訊息列表
        if (message) {
            messages.push(message);
            updateMessageList(); // 更新快捷選單顯示
        }
    }
}

//將訊息放入quickMessages list
window.getQuickMessage = function getQuickMessage() {
    const messageBox = document.querySelector("div#input[contenteditable='']"); // 目標訊息輸入框
    if (messageBox) {
        const message = messageBox.innerHTML.trim(); // 讀取訊息框中的內容並去除前後空格
        console.log("Quick Message read: " + message);

        // 如果訊息非空，加入到快捷訊息列表
        if (message) {
            quickMessages.push(message);
            updateQuickMenu(); // 更新快捷選單顯示
            console.log("Quick message added to the list.");
        }
    } else {
        console.log("Message box not found.");
    }
}