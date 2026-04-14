package micromeet.gui;

import java.awt.BorderLayout;
import javax.swing.JLabel;
import javax.swing.JPanel;
import micromeet.service.NotificationService;

public class NotificationsPanel extends JPanel {
    private final NotificationService notificationService;

    public NotificationsPanel(NotificationService notificationService) {
        this.notificationService = notificationService;
        initializeUi();
    }

    private void initializeUi() {
        setLayout(new BorderLayout());
        add(new JLabel("Notifications Panel", JLabel.CENTER), BorderLayout.CENTER);
    }

    public NotificationService getNotificationService() {
        return notificationService;
    }
}
