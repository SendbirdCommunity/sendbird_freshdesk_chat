
/**
 * @file Home of the SBFDNotificationHandler which provides functions for updating the notification pop ups in the Freshdesk UI.
 * @module SBFDNotificationHandler
 */


/**
 * Handles the display of notifications.
 * @class
 */
class SBFDNotificationHandler {
    /**
     * Constructs a new notification handler.
     *
     * @param {object} client - The client interface for triggering notifications.
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Displays a notification.
     *
     * @param {string} notificationType - The type of notification ('success', 'warning', 'alert', 'danger').
     * @param {string} title - The title of the notification.
     * @param {string} message - The message body of the notification.
     * @returns {Promise<void>} Resolves with success data or rejects with an error.
     */
    show(notificationType, title, message) {
        return this.client.interface.trigger("showNotify", {
            type: notificationType,
            title: title,
            message: message
        }).then(data => {
            console.log(data);
        }).catch(error => {
            console.log(error);
        });
    }

    /**
     * Displays a red dot on the tab button.
     */
    setRedDotOn() {
        const redDot = document.querySelector('.tab-button__red-dot');
        redDot.className = 'tab-button__red-dot display';
    }

    /**
     * Hides the red dot on the tab button.
     */
    setRedDotOff() {
        const redDot = document.querySelector('.tab-button__red-dot');
        redDot.className = 'tab-button__red-dot hidden';
    }
}
