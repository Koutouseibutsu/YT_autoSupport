// 隨機選取訊息 用於發送
window.getRandomMessage = function getRandomMessage() {
    const index = Math.floor(Math.random() * messages.length);
    return messages[index];
}

//發送控制
window.startSending = function startSending() {
    if (!intervalId) {
        window.time_counter = 180; // 重置倒數計時
        document.getElementById('timer-display').innerText = window.time_counter; // 更新 UI

        intervalId = setInterval(() => {
            
            let containsClapEmoji = false; // 用來標記是否找到 👏👏👏
            if ( document.getElementById('enableClapFeature').checked) {
                // 讀取聊天室訊息
                const chatMessages = document.querySelectorAll('yt-live-chat-text-message-renderer');
                // 取得倒數 3 條訊息
                const lastMessages = Array.from(chatMessages).slice(-5);
                
                let clapCount = 0; // 統計 clap 出現次數（👏 或 "clap"）

                lastMessages.forEach((message) => {
                    const authorName = message.querySelector('#author-name')?.textContent || '未知使用者';
                    // 取得訊息內容
                    const messageElement = message.querySelector('#message');
                    let messageContent = "";
                    if (messageElement) {
                        // 遍歷所有子節點（文字與圖片）
                        messageElement.childNodes.forEach(node => {
                            if (node.nodeType === Node.TEXT_NODE) {
                                // 純文字部分
                                messageContent += node.textContent;
                            } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "IMG") {
                                // 判斷是一般 emoji 還是 YouTube 貼圖
                                if (node.hasAttribute("data-emoji-id")) {
                                    // YT 貼圖
                                    messageContent += `:${node.alt}:`;  // 加上 `:貼圖名稱:`
                                } else {
                                    // 一般 emoji
                                    messageContent += node.alt || "[圖片]";
                                }
                            }
                        });
                    } else {
                        messageContent = "無內容";
                    }
            
                    const timestamp = message.querySelector('#timestamp')?.textContent || '無時間';
                    console.log(`[${timestamp}] ${authorName}: ${messageContent}`);
                    // if (messageContent.includes("👏👏👏")) {
                    //     containsClapEmoji = true;
                    // }
                    // 計算 👏 和 clap (不分大小寫) 出現次數
                    const clapRegex = /clap|拍手|888|👏|ぱちぱち|パチパチ|pachipachi/gi;
                    clapCount += (messageContent.match(clapRegex) || []).length;
                });
                // if (containsClapEmoji) {
                //     console.log("發現 👏👏👏，停止發送訊息！");
                //     stopSending();
                // }
                if (clapCount >= 3) {
                    containsClapEmoji = true;
                    console.log("發現 👏 / clap 達 3 次，停止發送訊息！");
                    stopSending();
                }
            }
            
            if (containsClapEmoji == false) {
                const message = getRandomMessage();
                sendMessage(message);
            }

        }, selectedInterval);

        countdownId = setInterval(() => {
            window.time_counter--;
            document.getElementById('timer-display').innerText = window.time_counter; // 更新倒數顯示
            if (window.time_counter <= 0) {
                stopSending(); // 倒數結束時自動停止
            }

        }, 1000);
        
        document.getElementById('status').innerText = '發送中';
        document.getElementById('interval-select').disabled = true;
        document.getElementById('start-sending').disabled = true;
        document.getElementById('stop-sending').disabled = false;

        window.button.innerHTML = '<span style="color: lime;">▼</span>';
        window.button.style.border = '3px solid lime';
        document.querySelector(".title_color").style.backgroundColor = "lime"; 

        document.getElementById("status").innerText = intervalId ? translations[nowlang].sending : translations[nowlang].stopped;
    }
}

// 停止發送訊息
window.stopSending = function stopSending() {
    if (intervalId) clearInterval(intervalId);
    if (countdownId) clearInterval(countdownId);

    intervalId = null;
    countdownId = null;

    document.getElementById('status').innerText = '停止中';
    document.getElementById('interval-select').disabled = false;
    document.getElementById('start-sending').disabled = false;
    document.getElementById('stop-sending').disabled = true;

    document.getElementById('timer-display').innerText = "0"; // 倒數結束時顯示 0

    window.button.innerHTML = '<span style="color: #F5D300;">▼</span>';
    window.button.style.border = '3px solid #F5D300';
    document.querySelector(".title_color").style.backgroundColor = "#F5D300"; 

    document.getElementById("status").innerText = intervalId ? translations[nowlang].sending : translations[nowlang].stopped;
}

// 發送訊息
window.sendMessage = function sendMessage(message) {
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


// window.extractFromHtml = function extractFromHtml(htmlStr) {
//     const container = document.createElement('div');
//     container.innerHTML = htmlStr;

//     const resultSet = new Set();

//     // Emoji 判斷用正則（可以辨識表情符號）
//     const emojiRegex = /\p{Emoji_Presentation}|\p{Emoji}/u;

//     container.childNodes.forEach(node => {
//         if (node.nodeType === Node.TEXT_NODE) {
//             const text = node.textContent.trim();
//             if (text) resultSet.add(text);
//         } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "IMG") {
//             const alt = node.getAttribute('alt') || '';
//             const tooltip = node.getAttribute('shared-tooltip-text') || '';

//             // 只有 alt 含 emoji 才加入
//             if (emojiRegex.test(alt)) resultSet.add(alt);
//             if (tooltip) resultSet.add(tooltip);
//         }
//     });

//     return Array.from(resultSet);
// };



window.extractFromHtml = function extractFromHtml(htmlStr) {
    const container = document.createElement('div');
    container.innerHTML = htmlStr;

    const result = [];

    // 判斷 Unicode emoji
    const emojiRegex = /\p{Emoji_Presentation}|\p{Emoji}/u;

    // 判斷 YouTube 自訂貼圖格式，如 :face-orange-tv-shape:
    const customEmojiRegex = /^:.*:$/;

    container.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.trim();
            if (text) {
                result.push(text);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "IMG") {
            const alt = node.getAttribute('alt') || '';
            const tooltip = node.getAttribute('shared-tooltip-text') || '';

            // ✅ 如果是 Unicode emoji 或 :xxx: 格式的自訂貼圖，就加入 alt
            if ((emojiRegex.test(alt) || customEmojiRegex.test(alt))) {
                result.push(alt);
            } else if (tooltip) {
                // ❗️否則只加 tooltip（alt 非 emoji）
                result.push(tooltip);
            }
        }
    });

    return {
        items: result,
        count: result.length
    };
};



function checkForTriggerMessage() {
    if (!document.getElementById('enableStartAuto')?.checked) return;

    const chatMessages = document.querySelectorAll('yt-live-chat-text-message-renderer');
    const lastMessages = Array.from(chatMessages).slice(-5);

    let foundMatch = 0;

    lastMessages.forEach((messageElement) => {
        const messageNode = messageElement.querySelector('#message');
        let contentHtml = '';
        
        if (messageNode) {
            contentHtml = messageNode.innerHTML;
        }
        
        const input_content = extractFromHtml(contentHtml);  // ✅ 抽出 alt 為文字

        // // 跟 messages 陣列裡每一則做相似度比對
        for (const triggerMsg of messages) {
            let triggerText = extractFromHtml(triggerMsg);
            if (
                triggerText.items.length === 1 &&
                typeof triggerText.items[0] === 'string' &&
                triggerText.items[0].length > 1
            ) {
                triggerText.items = Array.from(triggerText.items[0]);
            }
            if (input_content.count < 3) continue;
    
            const intersectionCount = (arr1, arr2) => {
                const set1 = new Set(arr1);
                return arr2.filter(item => set1.has(item)).length;
            };
            
            const matchedCount = intersectionCount(triggerText.items, input_content.items);

            console.log("input", input_content.items);
            console.log("my", triggerText.items);
            console.log("matchedCount", matchedCount);

            if (matchedCount === 0) continue;
            const matchRatio = matchedCount / input_content.count;
            console.log("matchRatio:", matchRatio);
        
            if (matchRatio >= 0.75) {
                foundMatch = foundMatch + 1;
                break;
            }
        }
    });

    if (foundMatch > 1) {
        console.log("🟢 偵測到高相似度訊息，自動開始發送！");
        startSending();
    } else {
        console.log("stop sending");
        stopSending();
    }
}

window.setupAutoStartWatcher = function setupAutoStartWatcher() {
    document.getElementById('enableStartAuto').addEventListener('change', () => {
        if (document.getElementById('enableStartAuto').checked) {
            if (autoStartInterval) clearInterval(autoStartInterval); // ✅ 先清除
            autoStartInterval = setInterval(checkForTriggerMessage, 10000);
        } else {
            if (autoStartInterval) clearInterval(autoStartInterval); // ✅ 停止監看
            autoStartInterval = null;
            stopSending();
        }
    });
}