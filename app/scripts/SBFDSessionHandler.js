class SBFDSessionHandler {
    constructor(client) {
        this.client = client;
    }

    async setSessionTokenExpiry() {
        const randomDays = Math.floor(Math.random() * 5) + 1;
        const randomHours = Math.floor(Math.random() * 24);
        const randomMinutes = Math.floor(Math.random() * 60);
        const now = Date.now();
        return now + ((randomDays * 24 + randomHours) * 60 + randomMinutes) * 60 * 1000;
        // return now + 1000
    }

    async getUserSessionToken(userId) {
        const sessionToken = await this.client.request.invoke("getUserSessionToken", { params: { "user_id": userId, expires_at: await this.setSessionTokenExpiry() } });
        const data = JSON.parse(sessionToken.message);
        return data;
    }

    async checkAndCreateSessionToken(userId, nickname) {
        try {
            await this.client.request.invoke("checkUserExists", { params: { "user_id": userId, "nickname": nickname, "profile_url": "" } });
            const locallyStoredUserSessionToken = await this.client.db.get("sendbird_session_token");
            const expiresAt = locallyStoredUserSessionToken?.expires_at;
            const now = new Date().getTime();

            if (expiresAt && expiresAt > now) {
                locallyStoredUserSessionToken.source = "local";
                return locallyStoredUserSessionToken;
            } else {
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
