/**
 * Singleton instance of the SBFDchat client.
 * @type {null|object}
 */
let SBFDchatClientInstance = null

setTimeout(async () => {
    SBFDchatClientInstance = new SBFDChatClient();
    await SBFDchatClientInstance.init();
}, 500)


