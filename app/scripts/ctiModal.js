/**
 * @fileoverview Is the starting point for the application to show the Freshdesk CTI modal
 * @module ctiModal
 */



/**
 * Singleton instance of the SBFDchat client.
 * @type {null|object}
 */
let SBFDchatClientInstance = null

setTimeout(async () => {
    SBFDchatClientInstance = new SBFDChatClient();
    await SBFDchatClientInstance.init();
}, 500)


