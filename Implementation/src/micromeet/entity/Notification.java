package micromeet.entity;

public class Notification {
    private String notificationId;
    private NotificationType type;
    private String message;
    private String createdAt;

    public Notification() {
    }

    public Notification(String notificationId, NotificationType type, String message, String createdAt) {
        this.notificationId = notificationId;
        this.type = type;
        this.message = message;
        this.createdAt = createdAt;
    }

    public String getNotificationId() {
        return notificationId;
    }

    public void setNotificationId(String notificationId) {
        this.notificationId = notificationId;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public void compose(NotificationType type, String message) {
        this.type = type;
        this.message = message;
    }

    @Override
    public String toString() {
        return "Notification{"
                + "notificationId='" + notificationId + '\''
                + ", type=" + type
                + ", message='" + message + '\''
                + ", createdAt='" + createdAt + '\''
                + '}';
    }
}
