/**
 * Class for notifications
 */
class SBFDNotificationHandler {
    /**
     *
     * @param notificationType
     * @param title
     * @param message
     */
    constructor(client) {
        this.client = client;
    }
    /**
     *
     * @param notificationType
     * @param title
     * @param message
     */
    show(notificationType, title, message) {

        //Success, warning, alert, danger.
        this.client.interface.trigger("showNotify", {
            type: notificationType,
            title: title,
            message: message
        }).then(function(data) {
        // data - success message
            console.log(data);

        }
    ).catch(function(error) {
        // error - error object
            console.log(error);
        })
    }
    setRedDotOn() {
        const redDot = document.querySelector('.tab-button__red-dot');
        redDot.className = 'tab-button__red-dot display';
    }
    setRedDotOff() {
        const redDot = document.querySelector('.tab-button__red-dot');
        redDot.className = 'tab-button__red-dot hidden';
    }
}
