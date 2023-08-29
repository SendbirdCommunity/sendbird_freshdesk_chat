/**
 * Class representing a handler for managing message statuses within the SBFDChatClient.
 */
class  SBFDMessageStatusHandler  {
  /**
   * Create a new SBFDMessageStatusHandler.
   * @param {Object} chatClient - An instance of SBFDChatClient or a related chat client object.
   */
  constructor(chatClient) {
    /**
     * The chat client associated with this handler.
     * @type {Object}
     */
    this.chatClient = chatClient;
  }

  /**
   * Mark a message as read within a specific channel.
   * @param {string} channelUrl - The URL of the channel where the message should be marked as read.
   */
  markMessageAsRead(channelUrl) {
    this.chatClient.channelCollection.channels.forEach(channel => {
      if (channel.url === channelUrl) {
        channel.markAsRead();

      }

    });
  }
}

