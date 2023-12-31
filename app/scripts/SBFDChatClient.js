/**
 * Class to manage the client, channels, and messages.
 */
class SBFDChatClient {
    /**
     * Initializes the chat client.
     */
    constructor() {
        this.messageStatusHandler = new SBFDMessageStatusHandler(this);
        this.isChatOpen = false;
        this.client = null;
        // this.sendbirdUser = null;
        this.activeChannelUrl = null;
        this.sb = null;
        this.MESSAGE_INPUT_LISTENER_ADDED = false;
        this.messageCollections = new Map();
        this.channelCollection = null;
        this.notify = null
        this.loggedInUser = null
        this.appId = null
    }

    /**
     * Generates and returns the expiry timestamp for a session token.
     * The expiry time is calculated as the current time plus a random
     * duration ranging from 1 minute to 5 days, 23 hours, and 59 minutes.
     * @memberof SBFDChatClient
     * @returns {number} Timestamp representing the session token expiry in milliseconds since the Unix epoch.
     * @example
     * const expiryTime = getSessionTokenExpiry();
     * console.log(new Date(expiryTime)); // Logs the expiration date and time for the token.
     */
    getSessionTokenExpiry() {
        const randomDays = Math.floor(Math.random() * 5) + 1;
        const randomHours = Math.floor(Math.random() * 24);
        const randomMinutes = Math.floor(Math.random() * 60);
        const now = Date.now();
        const expiresAt = now + ((randomDays * 24 + randomHours) * 60 + randomMinutes) * 60 * 1000;
        return expiresAt;
    }



    /**
     * Initializes the client and Sendbird connection.
     * @async
     * @returns {Promise<void>} A promise that resolves when initialization is complete.
     * @memberof SBFDChatClient
     */
    async init() {
        try {
            // $db.delete("sendbird_session_token")
            await this.initializeClient();
            await this.initializeSessionManager();
            await this.connectAndSetupChat();
        } catch (err) {
            console.log("ERROR:", err);
            this.notify.show("danger", "Chat: ", "Not Initialized");
        }
    }

    /**
     * Initializes the client, sets up notifications, and resizes the client instance.
     * @async
     * @function initializeClient
     * @returns {void}
     * @memberof SBFDChatClient
     */
    async initializeClient() {
        this.client = await app.initialized();
        this.notify = new SBFDNotificationHandler(this.client);
        const agentData = await  this.client.data.get('loggedInUser');
        this.loggedInUser = agentData.loggedInUser.contact;
        this.client.instance.resize({ height: "900px" });
        const params = await this.client.iparams.get("app_id");
        this.appId = params.app_id;
    }

    /**
     * Initializes the session manager, creates a session token, connects to Sendbird,
     * and shows a success notification.
     * @async
     * @function initializeSessionManager
     * @returns {void}
     * @memberof SBFDChatClient
     */
    async initializeSessionManager() {
        const sessionManager = new SBFDSessionHandler(this.client);
        const sessionTokenData = await sessionManager.checkAndCreateSessionToken(this.loggedInUser.id, this.loggedInUser.name);

        var { SendbirdChat, GroupChannelModule } = Sendbird;
        const appId = this.appId;
        this.sb = SendbirdChat.init({ appId, modules: [new GroupChannelModule()] });
        await this.sb.connect(this.loggedInUser.id, sessionTokenData.token);
        this.notify.show("success", "Chat: ", `"Connected as ${this.sb.currentUser.nickname}`);
    }

    /**
     * Sets the channel name in the user interface.
     * @function setChannelName
     * @param {string} channelName - The name of the channel to be displayed.
     * @returns {void}
     * @memberof SBFDChatClient
     */
    setChannelName(channelName) {
        const channelNameElement = document.getElementById('chat-view-channel-name');
        channelNameElement.innerHTML = channelName;
    }

    /**
     * Connects to the chat system and sets up the chat interface.
     *
     * This method handles various tasks such as:
     *  - Fetching the list of chat channels.
     *  - Setting up event handlers for those channels.
     *  - Rendering the initial chat user interface.
     *  - Initializing the active chat channel and associated message collections.
     *
     * If the channel collection contains no channels, a notification indicating the absence of messages is shown.
     * If all initialization tasks complete successfully, a success notification is displayed.
     *
     * @async
     * @function connectAndSetupChat
     * @returns {Promise<void>} A promise that resolves when the chat setup and connection are complete.
     *                          If an error occurs, it's logged to the console.
     * @throws {Error} If any part of the connection or setup process encounters an issue.
     * @memberof SBFDChatClient
     */
    async connectAndSetupChat() {
        try {
            this.channelCollection = await this.fetchChannelList();
            this.setChannelHandler();
            this.renderInitialUI();

            if (this.channelCollection.channels.length === 0) {
                this.notify.show("success", "Chat: ", "Initialized with zero messages!");
                return;
            }

            this.initializeActiveChannel();
            this.initializeMessageCollections();
            this.addMessageInputListener();
            this.notify.show("success", "Chat: ", "Set up completed!");
        } catch (err) {
            console.error("Error connecting and setting up chat:", err);
            // Handle error accordingly
        }
    }

    /**
     * Renders the initial user interface for the chat system.
     * @function renderInitialUI
     * @returns {void}
     * @memberof SBFDChatClient
     */
    renderInitialUI() {
        SBFDChannelHandler.renderChannelList(this.channelCollection.channels); // Initial UI render after fetching
    }

    /**
     * Initializes the active channel by setting the active channel URL and name.
     * @function initializeActiveChannel
     * @returns {void}
     * @memberof SBFDChatClient
     */
    initializeActiveChannel() {
        this.activeChannelUrl = this.channelCollection.channels[0].url;
        this.setChannelName(this.channelCollection.channels[0].name);
    }

    /**
     * Initializes the message collections for the active channel.
     * @async
     * @function initializeMessageCollections
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     * @memberof SBFDChatClient
     */
    async initializeMessageCollections() {
        await this.buildMessageCollection(this.activeChannelUrl);
    }

    /**
     * Adds a listener for the message input.
     * @memberof SBFDChatClient
     */
    addMessageInputListener() {
        // ... Existing logic for adding message input listener ...
        console.log("MESSAGE INPUT LISTENER ADDED")
        if(this.MESSAGE_INPUT_LISTENER_ADDED) {
            return
        } else {
            this.MESSAGE_INPUT_LISTENER_ADDED = true
        }
        const sendButton = document.querySelector('.message-input__send-button');
        sendButton.addEventListener('click', () => {
            console.log("ADD MESSAGE CLICK LISTENER")
            const messageInput = document.querySelector('.message-input__text');
            this.sendMessage(this.activeChannelUrl, messageInput.value)
        });
    }

    // ...

    /**
     * Builds the message collection for a specific channel URL.
     * @param {string} channelUrl - The URL of the channel.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     * @memberof SBFDChatClient
     */
    async buildMessageCollection(channelUrl) {
        // ...

        this.activeChannelUrl = channelUrl;
        if (this.messageCollections.get(channelUrl)) {
            const collection = this.messageCollections.get(channelUrl);
            SBFDMessageHandler.addMessages(collection.succeededMessages);
            return
        }
        const channel = await this.sb.groupChannel.getChannel(channelUrl);
        console.log("CHANNEL:", channel)
        const filter = new Sendbird.MessageFilter()
        const collection = channel.createMessageCollection({ filter, limit : 100, startingPoint: Date.now()});
        collection
            .initialize(Sendbird.MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API)
            .onCacheResult(() => {
                SBFDMessageHandler.addMessages(collection.succeededMessages);
            })
            .onApiResult(() => {
                SBFDMessageHandler.addMessages(collection.succeededMessages);
            });
        const handler = {
            onMessagesAdded: (context, channel) => {
                // Check if the current channel is the one being viewed
                this.notify.show("alert", "Chat: ", "New Message Received")

                if (channel.url === this.activeChannelUrl) {
                    if(this.isChatOpen) {
                        this.messageStatusHandler.markMessageAsRead(channel.url);
                    }
                    SBFDMessageHandler.addMessages(collection.succeededMessages)
                } else  {
                    this.notify.setRedDotOn();
                }

            }
        };
        collection.setMessageCollectionHandler(handler);

        // Store the collection in the Map using the channelUrl as the key.
        this.messageCollections.set(channelUrl, collection);
    }

    /**
     * Fetches the channel list.
     * @returns {Promise<object>} A promise that resolves with the channel collection.
     * @memberof SBFDChatClient
     */
    async fetchChannelList() {
        // ...
        const params = new Sendbird.GroupChannelFilter();
        params.includeEmpty = true;

        const channelCollection = await this.sb.groupChannel.createGroupChannelCollection({
            filter: params,
            order: Sendbird.GroupChannelListOrder.LATEST_LAST_MESSAGE,
        });

        if (channelCollection.hasMore) {
            await channelCollection.loadMore();
        }
        return channelCollection;
    }

    /**
     * Cleans up the user interface and internal state after channel removal.
     * Specifically, this method:
     * - Sets the active channel URL to `null` if it matches one of the removed channel URLs.
     * - Clears the content of the message view and channel name in the UI if the active channel URL matches one of the removed channel URLs or if the active channel URL is `null`.
     *
     * @function cleanUpafterChanneRemoval
     * @param {Array<string>} channelUrls - An array of channel URLs that have been removed. The function will iterate through this array to perform cleanup for each URL.
     * @returns {void} This method does not return a value.
     * @memberof SBFDChatClient
     */
    cleanUpafterChanneRemoval(channelUrls) {
        // ...
        channelUrls.forEach((channelUrl) => {
            if(channelUrl === this.activeChannelUrl || this.activeChannelUrl === null) {
                this.activeChannelUrl = null;
                const messageView = document.getElementById('tab1-tab-content__message-view');
                messageView.innerHTML = '';
                const channelName = document.getElementById('chat-view-channel-name');
                channelName.innerHTML = "";
            }
        })
    }


    /**
     * Sets the channel handler for the channel collection.
     * @function setChannelHandler
     * @memberof SBFDChatClient
     */
    setChannelHandler() {

        console.log("SET CHANNEL HANDLER")
        const renderUI = () => SBFDChannelHandler.renderChannelList(this.channelCollection.channels);
        const handler = {
            onChannelsAdded: (context, channels) => {
                console.log("CHANNELS ADDED", channels)
                this.activeChannelUrl = channels[0].url;
                this.addMessageInputListener()
                renderUI()
            },
            onChannelsUpdated: () => renderUI(),
            onChannelsDeleted: (_, channelUrls) => {
                this.cleanUpafterChanneRemoval(channelUrls);
                renderUI()
            }
        };

        this.channelCollection.setGroupChannelCollectionHandler(handler);
    }

    /**
     * Sends a user message to a specific channel within the chat system.
     * This method does the following:
     * - Retrieves the channel using the provided channel URL.
     * - Constructs the message parameters and attempts to send the user message.
     * - On success, adds the sent message to the associated message collection.
     * - Logs any errors encountered during the message sending process.
     *
     * @async
     * @function sendMessage
     * @param {string} channelUrl - The URL of the channel to which the message will be sent. Default is 'freshdesk_24'.
     * @param {string} message - The text content of the message to be sent.
     * @returns {Promise<void>} A promise that resolves when the message has been successfully sent. If an error occurs during the sending process, it will be logged but not propagated.
     * @throws {Error} Throws an error if there is an issue retrieving the channel or sending the message.
     * @memberof SBFDChatClient
     */
    async sendMessage(channelUrl, message) {
        // ...
        const channel = await this.sb.groupChannel.getChannel(channelUrl);
        const params = { message };
        try {
            await channel.sendUserMessage(params)
                .onSucceeded(message => {
                    const collection = this.messageCollections.get(channelUrl);
                    SBFDMessageHandler.addMessages([...collection.succeededMessages, message]);
                });
        } catch (e) {
            console.log("MESSAGE ERROR", e.message);
        }
    }

}
