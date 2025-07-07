// 語言字典
window.translations = {
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
        quickMessagePlaceholder: "按 Enter 新增快捷訊息",
        sendButtonText: "發送", 
        deleteButtonText: "刪除",
        countdownTitle: "倒數計時：",
        timerUnit: "秒",
        enableStartAuto: "自動判定應援開始(請小心使用)",
        enableClapFeature: "遇到 拍手👏 停止發送",
        options: {
            "5000": "5 秒",
            "10000": "10 秒",
            "15000": "15 秒",
            "20000": "20 秒",
            "30000": "30 秒",
            "60000": "60 秒"
        },
        disclaimer: "免責聲明:本程式不對任何使用上所造成的結果負責"
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
        countdownTitle: "Countdown: ",
        timerUnit: "seconds",
        enableStartAuto: "Auto-detect cheering start (Be careful)",
        enableClapFeature: "Stop sending when clap👏 appears",
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
        countdownTitle: "カウントダウン: ",
        timerUnit: "秒",
        enableStartAuto: "応援開始を自動判定（注意）",
        enableClapFeature: "ぱちぱちが表示されたら送信を停止",
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

// 更新 UI 文字內容
window.updateLanguage = function updateLanguage(lang) {
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
   document.getElementById("timer-display").nextSibling.textContent = " " + translations[lang].timerUnit;
   document.querySelector("label[for='enableStartAuto']").textContent = translations[lang].enableStartAuto;
   document.querySelector("label[for='enableClapFeature']").textContent = translations[lang].enableClapFeature;
   
   // 更新狀態文字
   document.getElementById("status").innerText = intervalId ? translations[lang].sending : translations[lang].stopped;

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
