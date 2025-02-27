// 語言字典
const translations = {
    "zh-TW": {
        title: "自動應援設定(Beta)",
        loadSettings: "載入設定",
        saveSettings: "儲存當前設定",
        settingsName: "設定檔名稱",
        customMessage: "自定義隨機訊息:",
        addMessage: "新增訊息",
        readFromChat: "從發送欄讀取訊息",
        sendInterval: "選擇發送間隔:",
        startSending: "開始發送",
        stopSending: "結束發送",
        currentStatus: "目前狀態：",
        stopped: "停止中",
        sending: "發送中",
        quickMenu: "快捷訊息",
        addQuickMessage: "新增快捷訊息",
        addQuickMessageFromChat: "從發送欄讀取訊息",
        closeWindow: "關閉視窗",
        placeholder: "按 Enter 新增隨機訊息",
        quickMessagePlaceholder: "按 Enter 新增快捷訊息" ,
        sendButtonText: "發送", 
        deleteButtonText: "刪除",
        options: {
            "5000": "5 秒",
            "10000": "10 秒",
            "15000": "15 秒",
            "20000": "20 秒",
            "30000": "30 秒",
            "60000": "60 秒"
        },
        disclaimer: "免責聲明:本程式不對任何使用上所造成的結果負責",
    },
    "en": {
        title: "Auto Cheer Settings(Beta)",
        loadSettings: "Load Settings",
        saveSettings: "Save Current Settings",
        settingsName: "Settings File Name",
        customMessage: "Custom Random Messages:",
        addMessage: "Add Message",
        readFromChat: "Read from the message input box",
        sendInterval: "Select Sending Interval:",
        startSending: "Start Sending",
        stopSending: "Stop Sending",
        currentStatus: "Current Status:",
        stopped: "Stopped",
        sending: "Sending",
        quickMenu: "Quick Menu",
        addQuickMessage: "Add Quick Message",
        addQuickMessageFromChat: "Read from the message input box",
        closeWindow: "Close Window",
        placeholder: "Press Enter to add a random message",
        quickMessagePlaceholder: "Press Enter to Add Quick Message",
        sendButtonText: "Send", 
        deleteButtonText: "Delete",
        options: {
            "5000": "5 seconds",
            "10000": "10 seconds",
            "15000": "15 seconds",
            "20000": "20 seconds",
            "30000": "30 seconds",
            "60000": "60 seconds"
        },
        disclaimer: "Disclaimer: The program is not responsible for any results caused by the use."
    },
    "ja": {
        title: "自動応援設定(Beta)",
        loadSettings: "設定を読み込む",
        saveSettings: "現在の設定を保存",
        settingsName: "設定ファイル名",
        customMessage: "カスタムランダムメッセージ:",
        addMessage: "メッセージを追加",
        readFromChat: "送信欄からメッセージを取得",
        sendInterval: "送信間隔を選択:",
        startSending: "送信開始",
        stopSending: "送信終了",
        currentStatus: "現在の状態:",
        stopped: "停止中",
        sending: "送信中",
        quickMenu: "クイックメニュー",
        addQuickMessage: "クイックメッセージを追加",
        addQuickMessageFromChat: "送信欄からメッセージを取得",
        closeWindow: "ウィンドウを閉じる",
        placeholder: "Enterキーでランダムメッセージを追加できます",
        quickMessagePlaceholder: "Enterキーでクイックメッセージを追加",
        sendButtonText: "送信",  
        deleteButtonText: "削除",
        options: {
            "5000": "5秒",
            "10000": "10秒",
            "15000": "15秒",
            "20000": "20秒",
            "30000": "30秒",
            "60000": "60秒"
        },
        disclaimer: "免責事項:プログラムの使用によって引き起こされた結果について、プログラムは責任を負いません。"
    }
};

if (!window.hasOwnProperty("intervalId")) {
    window.intervalId = null;
}
if (!window.hasOwnProperty("selectedInterval")) {
    window.selectedInterval = 10000;
}
// 檢查並初始化 messages 陣列
if (!window.hasOwnProperty("messages")) {
    window.messages = [];
}
// 檢查並初始化 quickMessages 陣列
if (!window.hasOwnProperty("quickMessages")) {
    window.quickMessages = [];
}
if (!window.hasOwnProperty("currentLanguage")) {
    window.currentLanguage = "zh-TW";
}
if (!window.hasOwnProperty("emojiToImageMap")) {
    window.emojiToImageMap = new Map();
}

(function() {
    'use strict';

    // Your code here...
    const TYPES = {
        CHAT: Symbol("Chat"),
        INPUT: Symbol("Input"),
        PICKER: Symbol("Picker"),
    };

    const YOUTUBE_CHANNEL_ID_REGEX = /^UCkszU2WH9gy1mb0dV-11UJg\//;
    const CHAT_EMOJI_SELECTOR = 'img.emoji.yt-live-chat-text-message-renderer[shared-tooltip-text][data-emoji-id]:not(.copyable)';
    const INPUT_FIELD_SELECTOR = 'yt-live-chat-text-input-field-renderer > #input';
    const EMOJI_PICKER_SELECTOR = 'div.yt-emoji-picker-renderer#categories';
    const VERSION = (typeof GM_info !== 'undefined') ? GM_info?.script?.version : (typeof chrome !== 'undefined') ? chrome?.runtime?.getManifest()?.version : '';

    /**
     * Check if the emoji is already copyable.
     */
    function isEmojiCopyable(emoji) {
        return emoji.classList.contains('copyable');
    }

    /**
     * Retrieve the emoji's ID.
     */
    function getEmojiId(emoji) {
        return emoji.dataset.emojiId || emoji.id;
    }

    /**
     * Determine if the emoji is a YouTube-specific emoji.
     */
    function isYoutubeEmoji(emoji) {
        const id = getEmojiId(emoji);
        return !id || YOUTUBE_CHANNEL_ID_REGEX.test(id);
    }

    /**
     * Update the emoji's alt attribute with colon format.
     */
    function updateEmojiAltWithColon(emoji, compareText = null) {
        if (compareText && !compareText.match(emoji.alt)) return;
        emoji.alt = `:${isYoutubeEmoji(emoji) ? '' : '_'}${emoji.alt}:`;

        // Update the emoji-to-image map
        const emojiAlt = emoji.alt;
        if (!emojiToImageMap.has(emojiAlt)) {
            
            // let imgElement = emoji;
            let imgElement = emoji.cloneNode(true); // 創建 emoji 的副本

            // 修改 img 元素的屬性
            console.log("before imgElement ", imgElement);
            imgElement.className = 'emoji yt-formatted-string style-scope yt-live-chat-text-input-field-renderer copyable'; // 更新 class
            imgElement.alt = emojiAlt; // 保留原來的 alt 屬性
            // const emojiId = imgElement.id;
            imgElement.removeAttribute('height'); // 移除 height 屬性
            imgElement.removeAttribute('width'); // 移除 width 屬性
            imgElement.removeAttribute('loading'); // 移除 loading 屬性
            imgElement.removeAttribute('aria-selected'); // 移除 aria-selected 屬性
            imgElement.removeAttribute('aria-label'); // 移除 aria-label 屬性
            imgElement.removeAttribute('role');
            imgElement.setAttribute('data-emoji-id', imgElement.id);
            imgElement.removeAttribute('id'); 
            console.log("after imgElement ", imgElement);

            // emojiToImageMap.set(emojiAlt, emoji); // Store the alt text and corresponding image node
            emojiToImageMap.set(emojiAlt, imgElement);
            
            // console.log("emoji.alt ", emoji.alt);
            // console.log("emoji ", emoji);
            // console.log(emojiToImageMap);
            
        }
    }

    /**
     * Process the emoji based on its type.
     */
    function processEmoji(emoji, type) {
        if (isEmojiCopyable(emoji)) return;

        emoji.classList.add('copyable');
        let compareText = null;

        switch (type) {
            case TYPES.CHAT:
                if (!document.contains(emoji)) return;
                compareText = emoji.getAttribute('shared-tooltip-text');
                break;
            case TYPES.INPUT:
                if (!getEmojiId(emoji)) return;
                break;
            case TYPES.PICKER:
                compareText = emoji.getAttribute('aria-label');
                break;
            default:
                console.warn(`Unknown emoji type: ${type}`);
                return;
        }

        updateEmojiAltWithColon(emoji, compareText);
    }

    /**
     * Update all emojis in the selected range.
     */
    function updateSelectedRangeEmojis() {
        try {
            const selection = window.getSelection();
            if (!selection.rangeCount) return;
            const range = selection.getRangeAt(0);
            const fragment = range.cloneContents();
            const selectedEmojis = fragment.querySelectorAll(CHAT_EMOJI_SELECTOR);
            selectedEmojis.forEach(clonedEmoji => {
                const originalEmoji = range.commonAncestorContainer.querySelector(`img.emoji#${clonedEmoji.id}`);
                if (originalEmoji) {
                    processEmoji(originalEmoji, TYPES.CHAT);
                }
            });
        } catch (error) {
            console.error(`Error in updateSelectedRangeEmojis: ${error}`);
        }
    }

    /**
     * Update all emojis inside the input field.
     */
    function updateInputFieldEmojis(inputField) {
        const inputEmojis = inputField?.getElementsByClassName('yt-live-chat-text-input-field-renderer') || [];
        Array.from(inputEmojis).forEach((node) => processEmoji(node, TYPES.INPUT));
    }

    /**
     * Update emojis in the emoji picker based on mutations.
     */
    function updateEmojiPickerEmojis(mutations) {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'IMG') {
                    processEmoji(node, TYPES.PICKER);
                }
            });
        });
    }

    /**
     * Initialize observers and event listeners on page load.
     */
    function initializeObservers() {
        const inputField = document.querySelector(INPUT_FIELD_SELECTOR);
        const emojiPicker = document.querySelector(EMOJI_PICKER_SELECTOR);
        const selectionchangeCallback = _.debounce(updateSelectedRangeEmojis, 200);
        const observeInputFieldCallback = _.debounce(() => {
            if (inputField) updateInputFieldEmojis(inputField);
        }, 200);
        const observeEmojiPickerCallback = updateEmojiPickerEmojis;
        // console.log("observeEmojiPickerCallback ", observeEmojiPickerCallback)

        const inputFieldObserver = new MutationObserver(observeInputFieldCallback);
        const emojiPickerObserver = new MutationObserver(observeEmojiPickerCallback);

        if (inputField) inputFieldObserver.observe(inputField, { childList: true, subtree: true });
        if (emojiPicker) emojiPickerObserver.observe(emojiPicker, { childList: true, subtree: true });

        document.addEventListener('selectionchange', selectionchangeCallback);
    }

    if (/^\/live_chat/.test(window.location.pathname)) {
        initializeObservers();
        // console.log(`[YT Live Chat Emoji Copy Tool${VERSION ? ` v${VERSION}` : ''}]`);
    }

})();


// 隨機選取訊息
function getRandomMessage() {
    const index = Math.floor(Math.random() * messages.length);
    return messages[index];
}

//更新隨機訊息列表
function updateMessageList() {
    const messageList = document.getElementById('message-list');
    messageList.innerHTML = ''; // 清空目前的訊息列表

    messages.forEach((message, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('message_style'); // 加入 class

        // 先創建顯示區塊，檢查是否包含 <img>
        const messageDiv = document.createElement('div');
        messageDiv.innerHTML = message; // 插入 HTML
        let textOnly = messageDiv.textContent; // 只提取純文字部分

        // 檢查是否包含 <img> 標籤
        const containsImage = messageDiv.querySelector('img') !== null;

        // 處理圖片部分
        const displayDiv = document.createElement('div');
        if (containsImage) {
            // 遍歷所有 <img> 標籤並設定統一大小
            const images = messageDiv.querySelectorAll('img');
            images.forEach(img => {
                img.style.width = '24px';  // 設定圖片寬度
                img.style.height = '24px'; // 設定圖片高度
            });
            // 替換訊息中的圖片
            displayDiv.innerHTML = messageDiv.innerHTML; // 保留圖片
        } else {
            // 只顯示文字
            displayDiv.innerHTML = textOnly;
        }

        // 創建刪除按鈕
        const deleteButton = document.createElement('button');
        deleteButton.textContent = translations[currentLanguage].deleteButtonText;
        deleteButton.onclick = () => {
            messages.splice(index, 1); // 刪除指定的訊息
            updateMessageList(); // 更新訊息列表
        };

        listItem.appendChild(displayDiv);
        listItem.appendChild(deleteButton);

        // 使用 flexbox 讓內容和刪除按鈕在同一行
        messageList.appendChild(listItem);
    });
}

function updateQuickMenu() {
    const quickMenu = document.getElementById('quick-menu');
    quickMenu.innerHTML = ''; // 清空目前的快捷選單
    quickMessages.forEach((message, index) => {
        const listItem = document.createElement('li');
        listItem.style.marginBottom = '5px';

        // 先創建顯示區塊，檢查是否包含 <img>
        const messageDiv = document.createElement('div');
        messageDiv.innerHTML = message; // 插入 HTML
        let textOnly = messageDiv.textContent; // 只提取純文字部分

        // 檢查是否包含 <img> 標籤
        const containsImage = messageDiv.querySelector('img') !== null;

        // 處理圖片部分
        const displayDiv = document.createElement('div');
        if (containsImage) {
            // 遍歷所有 <img> 標籤並設定統一大小
            const images = messageDiv.querySelectorAll('img');
            images.forEach(img => {
                img.style.width = '24px';  // 設定圖片寬度
                img.style.height = '24px'; // 設定圖片高度
            });
            // 替換訊息中的圖片
            displayDiv.innerHTML = messageDiv.innerHTML; // 保留圖片
        } else {
            // 只顯示文字
            displayDiv.innerHTML = textOnly;
        }

        // 設定字體顏色為白色
        displayDiv.style.color = 'white';

        // 創建發送按鈕
        const sendButton = document.createElement('button');
        sendButton.textContent = translations[currentLanguage].sendButtonText;
        sendButton.style.marginLeft = '10px';
        sendButton.onclick = () => sendMessage(message);

        // 創建刪除按鈕
        const deleteButton = document.createElement('button');
        deleteButton.textContent = translations[currentLanguage].deleteButtonText;
        deleteButton.style.marginLeft = '5px';
        deleteButton.onclick = () => {
            quickMessages.splice(index, 1); // 刪除指定的快捷訊息
            updateQuickMenu(); // 更新快捷選單
        };

        // 將顯示區塊、發送按鈕、刪除按鈕加到列表項
        listItem.appendChild(displayDiv);
        listItem.appendChild(sendButton);
        listItem.appendChild(deleteButton);
        quickMenu.appendChild(listItem);
    });

}

// 創建浮動窗口
if (!document.getElementById('floating-window')) {
    const floatWindow = document.createElement('div');
    floatWindow.id = 'floating-window';
    floatWindow.style.position = 'fixed';
    floatWindow.style.top = '35px';
    floatWindow.style.right = '10px';
    floatWindow.style.width = '300px';
    floatWindow.style.maxHeight = '90vh'; // 最大高度設置為視窗 90%
    floatWindow.style.height = 'auto'; // 高度自適應
    floatWindow.style.backgroundColor = '#fff';
    floatWindow.style.border = '2px solid #000';
    floatWindow.style.zIndex = '10000';
    floatWindow.style.padding = '10px';
    floatWindow.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    floatWindow.style.overflowY = 'auto'; // 啟用垂直捲動
    floatWindow.style.backgroundColor='rgb(48, 45, 45)';
    floatWindow.style.display = 'none';

    floatWindow.innerHTML = `
    <div id="allElement">
        <h2 class="title_color">自動應援設定 Beta測試</h2>

        <div class="button_container">
            <button class="button" id="select-setting-file">載入設定</button>
            <button class="button" id="save-setting-file">儲存當前設定</button>
        </div>
        <div class="area1">
            <h3 class="setting_name">設定檔名稱 <span style="font-size:12px;" id="setting-file-name">預設</span></h3>
            <label for="message-input">自定義隨機訊息:</label>
            <input type="text" id="message-input" style="width: 100%;" placeholder="按 Enter 新增隨機訊息" />
            <button class="button" id="add-message">新增訊息</button>
            <button class="button" id="get-message-from-chatroom">從發送欄讀取訊息</button>
            <p style="margin: 10px 0;"></p> 
            <ul id="message-list" style="list-style-type: none; padding: 0;"></ul>
            <label for="interval-select">選擇發送間隔:</label>
            <select id="interval-select">
                <option value="5000">5 秒</option>
                <option value="10000" selected>10 秒</option>
                <option value="15000">15 秒</option>
                <option value="20000">20 秒</option>
                <option value="30000">30 秒</option>
                <option value="60000">60 秒</option>
            </select>
            <button class="button" id="start-sending">開始發送</button>
            <button class="button" id="stop-sending" disabled>結束發送</button>
            <p class="status_title">目前狀態：<span id="status">停止中</span>   <span style="font-size:10px;"> (ctrl + space)</span> </p> 
        </div>
        <div class="area2">
            <h3 class="menu_title">快捷選單</h3>
            <ul id="quick-menu"></ul>
            <input type="text" id="quick-message-input" style="width: 100%;" placeholder="按 Enter 新增快捷訊息" />
            <button class="button" id="add-quick-message">新增快捷訊息</button>
            <button class="button" id="get-quick-message-from-chatroom">從發送欄讀取訊息</button>
        </div>
        <p id="disclaimer" style="color: blanchedalmond; font-size:10px;"> 免責聲明:本程式不對任何使用上所造成的結果負責</p>
        <div style="text-align:center; margin-top: 3px; display: none;">
            <button class="button" id="close-window" style="font-size:16px;">關閉視窗</button>
        </div>
        
        <p style="margin: 20px 0;"></p> 
        <div style="position: absolute; width: 90%; text-align: center; font-size: 12px; color: #666;">
            ©2024 Koutouseibutsu™ <br>
            email: koutouseibutsu@gmail.com <br>
            <br><br>
            <button class="button" id="donate-me" style="font-size:16px; border: 1px solid #F5D300; color:  #F5D300;"> donate me </button>
            <div class="wallet-info" id="wallet-info">
                <br><br>
                <p><strong style="color: #F5D300; font-size:16px;">Solana Wallet Address </strong><br> 
                6GsRmgMsttXUh664ee4bbTTw2zhjxrPBVzSPMUmdRQy9
                </p>
                <img src="https://api.qrserver.com/v1/create-qr-code/?data=6GsRmgMsttXUh664ee4bbTTw2zhjxrPBVzSPMUmdRQy9&size=140x140&color=black&bgcolor=white&margin=10">
                <br><br>
                <br><br>
                <p><strong style="color: #F5D300; font-size:16px;">ETH (Arbitrum One) Wallet Address</strong><br> 
                0x3282128ac76E5D6a304d87E9d392f80BBfEE0027
                </p>
                <img src="https://api.qrserver.com/v1/create-qr-code/?data=0x3282128ac76E5D6a304d87E9d392f80BBfEE0027&size=140x140&color=black&bgcolor=white&margin=10">
                <br><br>
                <br><br>
            </div>
        </div>
    </div>
    `;
    const style = document.createElement('style');
    style.textContent = `

    #all {
        background-color: rgb(48, 45, 45);
    }

    .message_style {
        font-size: 12px;
        color: white;
        font-weight: bold;
    }

    .title_color {
        text-align: center;
        background-color: #F5D300;
        color: rgb(9, 41, 77);
        margin-bottom: 10px;
    }

    .button {
        border: 1px solid aqua;
        background-color: rgba(0, 0, 0, 0);
        font-size: 15px;
        color: aqua;
        border-radius: 8px;
        place-content: center;
    }
    .button_container{
        display: flex;
        justify-content: center;
        margin-bottom: 5px;
    }
    #save-setting-file{
        margin-left: 3px;
    }
    .setting_name,label,.status_title,#status,.menu_title{
        font-size: 14px;
        margin-top: -5px;
        margin-bottom: 0px;
        color: blanchedalmond;
    }
    .status_title{
        margin-top: 2px;
    }
    input{
        margin-bottom: 5px;
    }
    .area1,.area2{
        // border: 3px solid rgb(64, 153, 212);
        border: 3px solid #09FBD3;
        padding: 10px;
        border-radius: 5px;
    }
    .area1{
        margin-bottom: 3px;
    }

    .button:hover{
        border: 1px solid rgb(252, 255, 63);
        color:  rgb(252, 255, 63);
        cursor: pointer;
    }

    button:disabled,
    button[disabled]{
        border: 1px solid rgb(144, 156, 156);
        background-color: rgba(0, 0, 0, 0);
        font-size: 15px;
        color: rgb(144, 156, 156);
        border-radius: 8px;
        place-content: center;
    }

    button:disabled:hover{
        border: 1px solid rgb(144, 156, 156);
        background-color: rgba(0, 0, 0, 0);
        font-size: 15px;
        color: rgb(144, 156, 156);
        border-radius: 8px;
        place-content: center;
        cursor:auto;
    }

    .wallet-info {
        display: none;
        font-size:12px;
        // margin-top: 20px;
        // padding: 12px;
        color: #FE53BB;
        // border-radius: 5px;
    }
    .wallet-info img {
        margin-top: 10px;
        width: 200px; /* 控制 QR Code 大小 */
        height: 200px;
    }
    
    `;

    const floatWindow1 = document.createElement('div');
    floatWindow1.id = 'floating-window1';
    floatWindow1.style.position = 'fixed';
    floatWindow1.style.top = '10px';
    floatWindow1.style.right = '120px';
    floatWindow1.style.width = '90px';
    floatWindow1.style.maxHeight = '90vh'; // 最大高度設置為視窗 90%
    floatWindow1.style.height = '25px';
    floatWindow1.style.zIndex = '20000';
    floatWindow1.style.backgroundColor = "rgb(255, 255, 255)";

    const button = document.createElement('button');
    button.style.width = '100%';
    button.style.height = '25px';
    button.style.cursor = 'pointer';
    button.style.border = '3px solid #F5D300';
    button.style.backgroundColor = 'rgb(150, 148, 148)';
    button.style.fontSize = 'large';
    button.style.color = '#F5D300';
    button.innerHTML = '▼';


    document.head.appendChild(style);
    document.body.appendChild(floatWindow);
    floatWindow1.appendChild(button);
    document.body.appendChild(floatWindow1);
    var floatWindow_display = false;
    document.getElementById('floating-window1').addEventListener('click', () => {
        if (!floatWindow_display) {
            floatWindow.style.display = 'block';
            floatWindow_display = true;
            
            //如果正在發送
            if (intervalId){
                button.innerHTML = '<span style="color: lime;">▼</span>';
                button.style.border = '3px solid lime';
            }
            else{
                button.innerHTML = '<span style="color: #F5D300;">▼</span>';
                button.style.border = '3px solid #F5D300';
            }
        }
        else if (floatWindow_display) {
            floatWindow.style.display = 'none';
            floatWindow_display = false;
            
            //如果正在發送
            if (intervalId){
                button.innerHTML = '<span style="font-size: 12px; color: lime;">▶</span>';
                button.style.border = '3px solid lime';
            }
            else{
                button.innerHTML = '<span style="color: #F5D300;">▼</span>';
                button.style.border = '3px solid #F5D300';
            }
            
        }
    });

    // 在浮動視窗內部增加語言選擇 UI
    const langSelector = document.createElement("select");
    langSelector.id = "language-select";
    langSelector.innerHTML = `
        <option value="zh-TW">繁體中文</option>
        <option value="en">English</option>
        <option value="ja">日本語</option>
    `;
    langSelector.style.marginBottom = "10px";
    document.getElementById("allElement").prepend(langSelector);
    // 更新 UI 文字內容
    function updateLanguage(lang) {
        currentLanguage = lang;
        document.querySelector("h2.title_color").textContent = translations[lang].title;
        document.getElementById("select-setting-file").textContent = translations[lang].loadSettings;
        document.getElementById("save-setting-file").textContent = translations[lang].saveSettings;
        document.querySelector("h3.setting_name").childNodes[0].textContent = translations[lang].settingsName + " ";
        document.querySelector("label[for='message-input']").textContent = translations[lang].customMessage;
        document.getElementById("add-message").textContent = translations[lang].addMessage;
        document.getElementById("get-message-from-chatroom").textContent = translations[lang].readFromChat;
        document.querySelector("label[for='interval-select']").textContent = translations[lang].sendInterval;
        document.getElementById("start-sending").textContent = translations[lang].startSending;
        document.getElementById("stop-sending").textContent = translations[lang].stopSending;
        document.querySelector("p.status_title").childNodes[0].textContent = translations[lang].currentStatus;
        document.getElementById("quick-menu").previousElementSibling.textContent = translations[lang].quickMenu;
        document.getElementById("add-quick-message").textContent = translations[lang].addQuickMessage;
        document.getElementById("get-quick-message-from-chatroom").textContent = translations[lang].addQuickMessageFromChat;
        document.getElementById("close-window").textContent = translations[lang].closeWindow;
        document.getElementById("disclaimer").textContent = translations[lang].disclaimer;
        
        // 更新狀態文字
        document.getElementById("status").innerText =
            intervalId ? translations[lang].sending : translations[lang].stopped;

        // 更新輸入框 placeholder
        document.getElementById("message-input").placeholder = translations[lang].placeholder;
        document.getElementById("quick-message-input").placeholder = translations[lang].quickMessagePlaceholder;

        // 更新選擇發送間隔選單的 option
        const intervalSelect = document.getElementById("interval-select");
        for (const option of intervalSelect.options) {
            if (translations[lang].options[option.value]) {
                option.textContent = translations[lang].options[option.value];
            }
        }
    }

    // 在頁面加載時讀取並更新語言
    window.addEventListener('load', () => {
        const savedLanguage = localStorage.getItem('language') || 'zh-TW';  // 預設為繁體中文
        currentLanguage = savedLanguage;
        updateLanguage(savedLanguage);
        langSelector.value = savedLanguage;
    });

    // 在語言選擇時儲存語言設置
    langSelector.addEventListener('change', (event) => {
        const selectedLang = event.target.value;
        localStorage.setItem('language', selectedLang);  // 儲存選擇的語言
        updateLanguage(selectedLang);
    });

    // 關閉視窗
    document.getElementById('close-window').addEventListener('click', () => {
        if (intervalId) clearInterval(intervalId);
        intervalId = null;
        document.getElementById('status').innerText = '停止中';
        document.getElementById('interval-select').disabled = false;
        document.getElementById('start-sending').disabled = false;
        document.getElementById('stop-sending').disabled = true;
        floatWindow.remove();
        floatWindow1.remove();
    });

    // 關閉視窗
    document.getElementById('donate-me').addEventListener('click', () => {
        const walletDiv = document.getElementById('wallet-info');
        const donateButton = document.getElementById('donate-me');

        if (walletDiv.style.display === 'none' || walletDiv.style.display === '') {
            walletDiv.style.display = 'block';
            donateButton.innerText = 'Close Donate';
            donateButton.style.border = '1px solid #FE53BB';
            donateButton.style.color = '#FE53BB';
        } else {
            walletDiv.style.display = 'none';
            donateButton.innerText = 'Donate Me';
            donateButton.style.border = '1px solid #F5D300';
            donateButton.style.color = '#F5D300';
        }

    });

    //儲存設定
    document.getElementById('save-setting-file').addEventListener('click', () => {
        const settings = {
            messages: messages, // 隨機訊息
            quickMessages: quickMessages, // 快捷訊息
            interval: selectedInterval // 當前的時間間隔
        };
        const blob = new Blob([JSON.stringify(settings)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'settings.json';
        link.click();
        // alert('設定已下載！');
    });

    //載入設定
    document.getElementById('select-setting-file').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.addEventListener('change', event => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    const settings = JSON.parse(reader.result);
                    messages.length = 0;
                    messages.push(...settings.messages); // 加載隨機訊息
                    quickMessages.length = 0;
                    quickMessages.push(...settings.quickMessages); // 加載快捷訊息
                    selectedInterval = settings.interval; // 設定時間間隔
                    updateMessageList();
                    updateQuickMenu();
                    document.getElementById('interval-select').value = selectedInterval.toString();
                    // alert('設定已成功載入！');
                    document.getElementById('setting-file-name').textContent = `${file.name}`;
                };
                reader.readAsText(file);
            }
        });
        input.click();
    });

    // 新增訊息
    document.getElementById('add-message').addEventListener('click', addMessage);
    document.getElementById('message-input').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addMessage();
        }
    });

    function addMessage() {
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

    // 讀取代發送的聊天訊息
    document.getElementById('get-message-from-chatroom').addEventListener('click', getMessage);
    function getMessage() {
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

    // 設置間隔時間
    document.getElementById('interval-select').addEventListener('change', (event) => {
        selectedInterval = parseInt(event.target.value);
    });

    // 開始發送訊息
    document.getElementById('start-sending').addEventListener('click', () => {
        if (!intervalId) {
            intervalId = setInterval(() => {
                const message = getRandomMessage();
                sendMessage(message);
            }, selectedInterval);
            document.getElementById('status').innerText = '發送中';
            document.getElementById('interval-select').disabled = true;
            document.getElementById('start-sending').disabled = true;
            document.getElementById('stop-sending').disabled = false;
            
            button.innerHTML = '<span style="color: lime;">▼</span>';
            button.style.border = '3px solid lime';
            document.querySelector(".title_color").style.backgroundColor = "lime"; 
        }
    });


    // 停止發送訊息
    document.getElementById('stop-sending').addEventListener('click', () => {
        if (intervalId) clearInterval(intervalId);
        intervalId = null;
        document.getElementById('status').innerText = '停止中';
        document.getElementById('interval-select').disabled = false;
        document.getElementById('start-sending').disabled = false;
        document.getElementById('stop-sending').disabled = true;

        button.innerHTML = '<span style="color: #F5D300;">▼</span>';
        button.style.border = '3px solid #F5D300';
        document.querySelector(".title_color").style.backgroundColor = "#F5D300"; 
    });

    // 監聽按鍵事件，檢查是否按下 Ctrl + Space 並切換開始與停止
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.code === 'Space') {
            if (!intervalId) {
                // 如果沒有在發送，開始發送訊息
                intervalId = setInterval(() => {
                    const message = getRandomMessage();
                    sendMessage(message);
                }, selectedInterval);
                document.getElementById('status').innerText = '發送中';
                document.getElementById('interval-select').disabled = true;
                document.getElementById('start-sending').disabled = true;
                document.getElementById('stop-sending').disabled = false;

                button.innerHTML = '<span style="color: lime;">▼</span>';
                button.style.border = '3px solid lime';
                document.querySelector(".title_color").style.backgroundColor = "lime"; 
            } else {
                // 如果正在發送，停止發送訊息
                if (intervalId) clearInterval(intervalId);
                intervalId = null;
                document.getElementById('status').innerText = '停止中';
                document.getElementById('interval-select').disabled = false;
                document.getElementById('start-sending').disabled = false;
                document.getElementById('stop-sending').disabled = true;

                button.innerHTML = '<span style="color: #F5D300;">▼</span>';
                button.style.border = '3px solid #F5D300';
                document.querySelector(".title_color").style.backgroundColor = "#F5D300"; 
            }
        }
    });

    // 新增快捷訊息
    document.getElementById('add-quick-message').addEventListener('click', () => {
        let quickMessage = document.getElementById('quick-message-input').value.trim();
        if (quickMessage) {

            // 做處理 :貼圖: 轉換成 <img>
            const emojiRegex = /:([^:]+):/g;
            quickMessage = quickMessage.replace(emojiRegex, (match, emojiName) => {
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

            quickMessages.push(quickMessage);
            document.getElementById('quick-message-input').value = ''; // 清空輸入框
            updateQuickMenu(); // 更新快捷選單
        }
    });

    document.getElementById('quick-message-input').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            document.getElementById('add-quick-message').click();
        }
    });

    // 讀取代發送的快捷訊息
    document.getElementById('get-quick-message-from-chatroom').addEventListener('click', getQuickMessage);
    function getQuickMessage() {
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

    // 發送訊息的函數
    function sendMessage(message) {
        // 檢查訊息是否為空字串
        if (!message) {
            console.log("Message is empty, not sending.");
            return; // 如果訊息是空的，直接返回不執行發送
        }

        console.log("sendMessage!!!!!!!!!");
        const messageBox = document.querySelector("div#input[contenteditable='']");
        if (messageBox) {
            messageBox.innerHTML = ""; // 清空輸入框
            messageBox.innerHTML = message; // 插入訊息

            // 觸發 DOM 更新
            const inputEvent = new Event("input", { bubbles: true });
            messageBox.dispatchEvent(inputEvent);

            // 1 秒延遲後執行點擊操作
            setTimeout(() => {
                const sendButton = document.evaluate(
                    '//*[@id="send-button"]/yt-button-renderer/yt-button-shape/button',
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;

                if (sendButton) {
                    sendButton.click();
                    console.log("Message sent: " + message);
                } else {
                    console.log("Send button not found.");
                }
            }, 500); // 延遲 500 毫秒

        } else {
            console.log("Message box not found.");
        }
    }

    updateMessageList();
    updateQuickMenu(); // 初始化更新快捷選單

}

