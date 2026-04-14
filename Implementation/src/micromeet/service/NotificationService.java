package micromeet.service;

import java.util.ArrayList;
import java.util.List;
import micromeet.entity.Notification;
import micromeet.entity.NotificationType;

public class NotificationService {
    private final List<Notification> notifications;

    public NotificationService() {
        this.notifications = new ArrayList<>();
    }

    public void notifyParticipants(String meetupId, String message) {
        Notification notification = new Notification();
        notification.setNotificationId("notif-" + (notifications.size() + 1));
        notification.compose(NotificationType.MEETUP_UPDATED, message);
        notification.setCreatedAt("now");
        notifications.add(notification);

        System.out.println("Participants notified for meetup " + meetupId + ": " + message);
    }

    public void sendInviteOrApproval(String userId, String action) {
        NotificationType type =
                "approval".equalsIgnoreCase(action)
                        ? NotificationType.APPROVAL_SENT
                        : NotificationType.INVITE_SENT;
        String message = "Action for user " + userId + ": " + action;

        Notification notification = new Notification();
        notification.setNotificationId("notif-" + (notifications.size() + 1));
        notification.compose(type, message);
        notification.setCreatedAt("now");
        notifications.add(notification);

        System.out.println("Notification sent to user " + userId + ": " + action);
    }

    public void notifyHostOrUser(String meetupId, String userId, String choice) {
        String message =
                "Join response for meetup "
                        + meetupId
                        + " by user "
                        + userId
                        + ": "
                        + choice;

        Notification notification = new Notification();
        notification.setNotificationId("notif-" + (notifications.size() + 1));
        notification.compose(NotificationType.JOIN_RESPONSE, message);
        notification.setCreatedAt("now");
        notifications.add(notification);

        System.out.println("Join response notification created: " + message);
    }

    public int processPendingUpdates() {
        return notifications.size();
    }

    public List<Notification> getAllNotifications() {
        return new ArrayList<>(notifications);
    }
}
