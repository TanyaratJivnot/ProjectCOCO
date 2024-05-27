$(document).ready(function(){
    $('.icon_warp').click(function() {
        $('#scrollbar1').toggle(); 
    });
});
$(document).ready(function() {
    $('.icon_warp').click(function() {
        $('#count_notificate').css('display', 'none');
    });
});
$(document).ready(function() {
    var shouldHideNotification = localStorage.getItem('hideNotification') === 'true';
    var currentNotificationCount = $('#count').text();

    if (shouldHideNotification) {
        var storedNotificationCount = localStorage.getItem('notificationCount');
        if (storedNotificationCount !== currentNotificationCount) {
            $('#count_notificate').show();
            localStorage.setItem('hideNotification', 'false');
        } else {
            $('#count_notificate').hide();
        }
    }

    $('.icon_warp').click(function() {
        $('#count_notificate').hide();
        localStorage.setItem('hideNotification', 'true');
        localStorage.setItem('notificationCount', currentNotificationCount);
    });
});