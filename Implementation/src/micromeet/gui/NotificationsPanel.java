package micromeet.gui;

import java.awt.BorderLayout;
import java.util.List;
import javax.swing.DefaultListModel;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JList;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import micromeet.entity.Notification;
import micromeet.service.NotificationService;

public class NotificationsPanel extends JPanel {
    private final NotificationService notificationService;
    private final DefaultListModel<String> notificationListModel;
    private final JList<String> notificationList;
    private final JLabel statusLabel;

    public NotificationsPanel(NotificationService notificationService) {
        this.notificationService = notificationService;
        this.notificationListModel = new DefaultListModel<>();
        this.notificationList = new JList<>(notificationListModel);
        this.statusLabel = new JLabel(" ");
        initializeUi();
        refreshNotifications();
    }

    private void initializeUi() {
        setLayout(new BorderLayout(10, 10));

        JPanel topPanel = new JPanel(new BorderLayout(10, 10));
        JLabel titleLabel = new JLabel("Notifications");
        JButton refreshButton = new JButton("Refresh");
        refreshButton.addActionListener(e -> refreshNotifications());
        topPanel.add(titleLabel, BorderLayout.WEST);
        topPanel.add(refreshButton, BorderLayout.EAST);

        add(topPanel, BorderLayout.NORTH);
        add(new JScrollPane(notificationList), BorderLayout.CENTER);
        add(statusLabel, BorderLayout.SOUTH);
    }

    public void refreshNotifications() {
        notificationListModel.clear();
        List<Notification> notifications = notificationService.getAllNotifications();
        if (notifications.isEmpty()) {
            statusLabel.setText("No notifications available.");
            return;
        }

        for (Notification notification : notifications) {
            if (notification != null) {
                notificationListModel.addElement(formatNotification(notification));
            }
        }
        statusLabel.setText("Loaded " + notifications.size() + " notification(s).");
    }

    private String formatNotification(Notification notification) {
        String id = notification.getNotificationId() == null ? "-" : notification.getNotificationId();
        String type = notification.getType() == null ? "-" : notification.getType().name();
        String message = notification.getMessage() == null ? "" : notification.getMessage();
        return id + " | " + type + " | " + message;
    }

    public NotificationService getNotificationService() {
        return notificationService;
    }
}
