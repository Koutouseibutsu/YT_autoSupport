
//載入語言字典
const translations = window.translations;

if (!window.hasOwnProperty("intervalId")) {
    window.intervalId = null;
}
if (!window.hasOwnProperty("selectedInterval")) {
    window.selectedInterval = 10000;
}
if (!window.hasOwnProperty("autoStartInterval")) {
    window.autoStartInterval = 10000;
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
if (!window.hasOwnProperty("time_counter")) {
    window.time_counter = 180;
}
if (!window.hasOwnProperty("countdownId ")) {
    window.countdownId  = null;
}
if (!window.hasOwnProperty("savedLanguage")) {
    window.nowlang = localStorage.getItem('language') || 'zh-TW';  // 預設為繁體中文
}

// 創建浮動窗口
if (!document.getElementById('floating-window')) {
    const floatWindow = document.createElement('div');
    floatWindow.style.cssText = window.floatwindow_style;
    floatWindow.innerHTML = window.floatwindow_innerHTML;
    const style = document.createElement('style');
    style.textContent = window.floatwindow_style_textContent;

    const floatWindow1 = document.createElement('div');
    floatWindow1.id = 'floating-window1';
    floatWindow1.style.cssText = window.floatWindow1_style;

    const button = document.createElement('button');
    button.style.cssText = window.button_style;
    button.innerHTML = '▼';
    window.button = button;


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

    ///////////////////////////

    // 在頁面加載時讀取並更新語言
    window.addEventListener('load', () => {
        const savedLanguage = localStorage.getItem('language') || 'zh-TW';  // 預設為繁體中文
        currentLanguage = savedLanguage;
        updateLanguage(savedLanguage);
        langSelector.value = savedLanguage;
        window.nowlang = savedLanguage;
    });

    // 在語言選擇時儲存語言設置
    langSelector.addEventListener('change', (event) => {
        const selectedLang = event.target.value;
        localStorage.setItem('language', selectedLang);  // 儲存選擇的語言
        updateLanguage(selectedLang);
        window.nowlang = selectedLang;
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

    // 顯示/隱藏錢包地址
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

    // 讀取代發送的聊天訊息
    document.getElementById('get-message-from-chatroom').addEventListener('click', getMessage);
    
    // 設置間隔時間
    document.getElementById('interval-select').addEventListener('change', (event) => {
        selectedInterval = parseInt(event.target.value);
    });

    // 開始發送訊息
    document.getElementById('start-sending').addEventListener('click', startSending);

    // 停止發送訊息
    document.getElementById('stop-sending').addEventListener('click', stopSending);

    
    // 監聽按鍵事件，檢查是否按下 Ctrl + Space
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.code === 'Space') {
            if (!intervalId) {
                startSending();
            } else {
                stopSending();
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
    
    updateMessageList();
    updateQuickMenu(); // 初始化更新快捷選單
    setupAutoStartWatcher();

}


// setInterval(window.extractAndPrintChatUserURLs, 5000);
