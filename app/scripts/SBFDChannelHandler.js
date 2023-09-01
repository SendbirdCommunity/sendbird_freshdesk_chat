/**
 * Represents a chat channel.
 */
class SBFDChannel {
    /**
     * Creates a new channel.
     * @param {string} name - The name of the channel.
     * @param {string} timestamp - The timestamp of the last message.
     * @param {string} lastMessage - The content of the last message.
     * @param {string} channelUrl - The URL of the channel.
     */
    constructor(name, timestamp, lastMessage, channelUrl, unreadMessageCount) {
        this.name = name;
        this.timestamp = timestamp;
        this.lastMessage = lastMessage;
        this.channelUrl = channelUrl;
        this.unreadMessageCount = unreadMessageCount;
    }

    /**
     * Creates the HTML representation of the channel.
     * @returns {HTMLElement} The created div element representing the channel.
     */
    createEntry() {
        const channelEntry = document.createElement('div');
        // channelEntry.classList.add('channel-entry');
        channelEntry.setAttribute('data-channel-url', this.channelUrl);
        let unreadClass = 'channel-entry__unread-count'
        if(this.unreadMessageCount == 0) unreadClass = 'channel-entry__unread-count-zero';
        channelEntry.innerHTML = `
            <div class="channel-entry" onclick="SBFDChannelHandler.switchToChatView('${this.channelUrl}','${this.name}' )">
                <div class="channel-entry-title">
                    <span class="channel-name">${this.name}</span>
                    <span class=${unreadClass}>${this.unreadMessageCount}</span>
                </div>
                 <span class="timestamp">${this.timestamp}</span>
                <div class="last-message">${this.lastMessage}</div>
            </div>
        `;
        return channelEntry;
    }
}

/**
 * Object containing functions for handling channels.
 * @type {object}
 * @property {Function} createChannelEntry - Creates a channel entry.
 * @property {Function} createChannelList - Creates a list of channels.
 * @property {Function} switchToChatView - Switches to the chat view.
 * @global
 */
const SBFDChannelHandler = {
    /**
     * Switches the view to the chat view for a given channel URL.
     * @param {string} channelUrl - The URL of the channel.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     */
    switchToChatView: async function(channelUrl, cName) {
        // Switch to chat view

        console.log("CHANGE to Chat view");
        const chatView = document.getElementById('chatView');
        chatView.classList.remove('hidden');
        chatView.classList.add('active');
        //Set title of chat view

        const channelTab = document.getElementById('channel-list-tab');
        const chatTab = document.getElementById('chat-list-tab');
        channelTab.classList.remove('active');
        chatTab.classList.add('active');


        const channelName = document.getElementById('chat-view-channel-name');
        channelName.innerHTML = cName;

        const channelList = document.getElementById('channelList');
        channelList.classList.add('hidden');
        channelList.classList.remove('active');

        //Mark messages as read.
        SBFDchatClientInstance.isChatOpen = true;
        SBFDchatClientInstance.buildMessageCollection(channelUrl);
        SBFDchatClientInstance.messageStatusHandler.markMessageAsRead(channelUrl);
    },

    /**
     * Renders a list of channels in the UI.
     * @param {Array} channels - The list of channels to render.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     *
     */
    renderChannelList: function(channels) {
        const target = document.getElementById('channel-list');
        target.innerHTML = '';

        channels.forEach(channel => {
            let lastMessage = '';
            let lastMessageTimestamp = '';

            if (channel.lastMessage) {
                lastMessage = channel.lastMessage.message;
                lastMessageTimestamp = new Date(channel.lastMessage.createdAt).toLocaleString([], {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'});
            }
            const unreadMessageCount = channel.unreadMessageCount
            const channelElement = new SBFDChannel(channel.name, lastMessageTimestamp, lastMessage, channel.url, unreadMessageCount);
            target.appendChild(channelElement.createEntry());
        })
    }
}
