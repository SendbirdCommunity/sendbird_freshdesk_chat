function openTab(e, tabName) {
    SBFDchatClientInstance.isChatOpen = (tabName === "chatView");

    SBFDchatClientInstance.messageStatusHandler.markMessageAsRead(SBFDchatClientInstance.activeChannelUrl);
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].className = tabcontent[i].className.replace(" active", "");

    }
    tablinks = document.getElementsByClassName("tab-button");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).className += " active";
    e.currentTarget.className += " active";
}
