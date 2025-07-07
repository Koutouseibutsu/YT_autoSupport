window.floatwindow_style = `
    position: fixed;
    top: 35px;
    right: 10px;
    width: 300px;
    max-height: 90vh;
    height: auto;
    background-color: rgb(48, 45, 45);
    border: 2px solid #000;
    z-index: 10000;
    padding: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    overflow-y: auto;
    display: none;
    `;

window.floatwindow_innerHTML = `
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
        <p class="status_title">倒數計時：<span id="timer-display">180</span> 秒</p>
        <input type="checkbox" id="enableStartAuto">
        <label for="enableStartAuto">自動判定應援開始(請小心使用)</label><br>
        <input type="checkbox" id="enableClapFeature">
        <label for="enableClapFeature">遇到 拍手👏 停止發送</label>
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
            <!-- 
            <br><br>
            <br><br>
            <p><strong style="color: #F5D300; font-size:16px;">ETH (Arbitrum One) Wallet Address</strong><br> 
            0x3282128ac76E5D6a304d87E9d392f80BBfEE0027
            </p>
            <img src="https://api.qrserver.com/v1/create-qr-code/?data=0x3282128ac76E5D6a304d87E9d392f80BBfEE0027&size=140x140&color=black&bgcolor=white&margin=10">
            <br><br>
            <br><br> -->
        </div>
    </div>
</div>
`;

window.floatwindow_style_textContent = `

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


// window.floatWindow1_style = `
//     position: fixed;
//     top: 10px;
//     right: 120px;
//     width: 90px;
//     height: 25px;
//     max-height: 90vh;
//     z-index: 20000;
//     background-color: rgb(255, 255, 255);
// `;


// window.button_style = `
//     width: 100%;
//     height: 25px;
//     cursor: pointer;
//     border: 3px solid #F5D300;
//     background-color: rgb(150, 148, 148);
//     font-size: large;
//     color: #F5D300;
// `;

window.floatWindow1_style = `
    position: fixed;
    top: 12px; /* 向下移動 2px */
    right: 165px;
    width: 70px;
    height: 22px;
    max-height: 90vh;
    z-index: 20000;
    background-color: rgb(255, 255, 255);
    border-radius: 6px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;

window.button_style = `
    width: 100%;
    height: 22px;    /* 更小一點的高度 */
    cursor: pointer;
    border: 2px solid #F5D300;  /* 邊框變細 */
    background-color: rgb(150, 148, 148);
    font-size: medium;          /* 字體小一點 */
    color: #F5D300;
    border-radius: 5px;
`;