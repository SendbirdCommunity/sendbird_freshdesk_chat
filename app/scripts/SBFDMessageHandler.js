/**
 * @fileoverview Home of the SBFDmessageHandler global object which listens for messages events and updates the UI accordingly.
 * @module SBFDMessageHandler
 */

/**
 * Represents a chat message.
 */
class SBFDMessage {
    /**
     * Creates a new message.
     * @param {string} sender - The sender's type, either 'other_user' or 'my'.
     * @param {string} name - The name of the sender.
     * @param {string} time - The time the message was sent.
     * @param {string} text - The content of the message.
     */
    constructor(sender, name, time, text) {
        this.sender = sender;
        this.name = name;
        this.time = time;
        this.text = text;
    }

    /**
     * Creates the HTML representation of the message.
     * @returns {HTMLElement} The created div element representing the message.
     */
    createBubble() {
        const messageBubble = document.createElement('div');
        const currentUser = SBFDchatClientInstance.loggedInUser.id;
        const isCurrentUser = this.sender.userId === currentUser;

        messageBubble.classList.add('message-bubble', isCurrentUser ? 'message-bubble__my' : 'message-bubble__other_user');
        const nameElement = isCurrentUser ? '' : `<span class="message-bubble__name">${this.name}</span>`;

        messageBubble.innerHTML = `
        <div class="message-bubble__header">
            ${nameElement}
            <span class="message-bubble__time">${this.time}</span>
        </div>
        <div class="message-bubble__text">${this.text}</div>
    `;

        return messageBubble;
    }
}

/**
 * Object containing functions for handling messages.
 */
const SBFDMessageHandler = {
    /**
     * Adds a message to the message view.
     * @param {SBFDMessage} message - The message to add.
     */
    addMessage: function(message) {
        const messageView = document.getElementById('tab1-tab-content__message-view');

        const messageBubble = message.createBubble();
        messageView.appendChild(messageBubble);
        // Scroll to the bottom of the message view
        messageView.scrollTop = messageView.scrollHeight;
    },

    /**
     * Adds a list of messages to the message view.
     * @param {Array} messages - The list of messages to add.
     */
    addMessages: function(messages) {
        const messageView = document.getElementById('tab1-tab-content__message-view');
        messageView.innerHTML = '';
        messages.forEach(message => {
            if (message.messageType === 'user') {
                const sender = message.sender;
                const name = sender.nickname;
                const time = new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                const text = message.message;
                this.addMessage(new SBFDMessage(sender, name, time, text));
            }
        });
    }
}

