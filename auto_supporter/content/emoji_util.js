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
            // console.log("before imgElement ", imgElement);
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
            // console.log("after imgElement ", imgElement);

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
