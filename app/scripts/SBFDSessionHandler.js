/**
 * Represents a handler for managing SBFD sessions.
 */
class SBFDSessionHandler {
    /**
     * Creates a new SBFDSessionHandler instance.
     * @param {object} client - The client object used to make requests and manage data.
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Sets the expiry for the session token. The expiry is calculated based on a random number of days, hours, and minutes.
     * @async
     * @returns {number} The timestamp indicating the session token's expiry.
     * @memberof SBFDSessionHandler
     */
    async setSessionTokenExpiry() {
        const randomDays = Math.floor(Math.random() * 5) + 1;
        const randomHours = Math.floor(Math.random() * 24);
        const randomMinutes = Math.floor(Math.random() * 60);
        const now = Date.now();
        return now + ((randomDays * 24 + randomHours) * 60 + randomMinutes) * 60 * 1000;
    }

    /**
     * Retrieves the user's session token.
     * @async
     * @param {string} userId - The ID of the user for whom the session token needs to be fetched.
     * @returns {object} The session token data.
     * @memberof SBFDSessionHandler
     */
    async getUserSessionToken(userId) {
        const sessionToken = await this.client.request.invoke("getUserSessionToken", { params: { "user_id": userId, expires_at: await this.setSessionTokenExpiry() } });
        console.log(sessionToken)
        const data = JSON.parse(sessionToken.message);
        return data;
    }

    /**
     * Checks the validity of the locally stored session token and creates a new one if necessary.
     * @async
     * @param {string} userId - The ID of the user for whom the session token needs to be checked or created.
     * @param {string} nickname - The nickname of the user.
     * @returns {object} The session token data.
     * @memberof SBFDSessionHandler
     */
    async checkAndCreateSessionToken(userId, nickname) {
        try {
            const locallyStoredUserSessionToken = await this.client.db.get("sendbird_session_token");
            let expiresAt;
            if (locallyStoredUserSessionToken) {
                expiresAt = locallyStoredUserSessionToken.expires_at;
            } else {
                expiresAt = undefined;  // or null, or some default value
            }
            const now = new Date().getTime();

            if (expiresAt > now) {
                locallyStoredUserSessionToken.source = "local";
                return locallyStoredUserSessionToken;
            } else {
                //Check if user exists
                await this.client.request.invoke("checkUserExists", { params: { "user_id": userId, "nickname": nickname, "profile_url": "" } });

                //Create user session token
                const newSessionToken = await this.getUserSessionToken(userId);
                newSessionToken.source = "server:expired";
                await this.client.db.set("sendbird_session_token", newSessionToken);
                return newSessionToken;
            }
        } catch (e) {
            try {
                const newSessionToken = await this.getUserSessionToken(userId);
                newSessionToken.source = "server:new";
                await this.client.db.set("sendbird_session_token", newSessionToken);
                return newSessionToken;
            } catch (e) {
                this.notify.show("danger", "", `${e.message}`);
            }
        }
    }
}
