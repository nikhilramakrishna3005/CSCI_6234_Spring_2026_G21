package micromeet.gui;

import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.GridLayout;
import java.util.List;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import micromeet.entity.Meetup;
import micromeet.entity.Notification;
import micromeet.entity.User;
import micromeet.service.MeetupService;
import micromeet.service.NotificationService;
import micromeet.service.ProfileService;

public class DashboardFrame extends JFrame {
    private final User loggedInUser;
    private final ProfileService profileService;
    private final MeetupService meetupService;
    private final NotificationService notificationService;
    private final Runnable onLogout;

    public DashboardFrame(
            User loggedInUser,
            ProfileService profileService,
            MeetupService meetupService,
            NotificationService notificationService,
            Runnable onLogout) {
        this.loggedInUser = loggedInUser;
        this.profileService = profileService;
        this.meetupService = meetupService;
        this.notificationService = notificationService;
        this.onLogout = onLogout;
        initialize();
    }

    private void initialize() {
        setTitle("MicroMeet Dashboard");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setPreferredSize(new Dimension(760, 560));
        setLayout(new BorderLayout(12, 12));

        add(createHeaderPanel(), BorderLayout.NORTH);
        add(createActionsPanel(), BorderLayout.CENTER);

        pack();
        setLocationRelativeTo(null);
    }

    private JPanel createHeaderPanel() {
        JPanel headerPanel = new JPanel(new BorderLayout());
        headerPanel.setBorder(BorderFactory.createEmptyBorder(10, 12, 0, 12));

        JLabel titleLabel = new JLabel("MicroMeet Dashboard");
        titleLabel.setFont(new Font("SansSerif", Font.BOLD, 22));

        String name = loggedInUser == null ? "User" : loggedInUser.getName();
        String id = loggedInUser == null ? "-" : loggedInUser.getUserId();
        JLabel userLabel = new JLabel("Logged in as: " + name + " (" + id + ")");

        headerPanel.add(titleLabel, BorderLayout.NORTH);
        headerPanel.add(userLabel, BorderLayout.SOUTH);
        return headerPanel;
    }

    private JPanel createActionsPanel() {
        JPanel actionsPanel = new JPanel(new GridLayout(3, 3, 10, 10));
        actionsPanel.setBorder(BorderFactory.createEmptyBorder(8, 12, 12, 12));

        actionsPanel.add(createButton("1. Manage Profile", e -> openProfilePanel()));
        actionsPanel.add(
                createButton(
                        "2. View Active / Upcoming Meetups",
                        e -> openMeetupListPanel()));
        actionsPanel.add(createButton("3. View Meetup Details", e -> openMeetupDetailPanel()));
        actionsPanel.add(createButton("4. Create Meetup", e -> openCreateMeetupPanel()));
        actionsPanel.add(createButton("5. Edit Meetup", e -> openEditMeetupPanel()));
        actionsPanel.add(
                createButton(
                        "6. Invite / Approve Participants",
                        e -> openManageParticipantsPanel()));
        actionsPanel.add(createButton("7. Respond to Join Request", e -> openJoinResponsePanel()));
        actionsPanel.add(createButton("8. Send Update Notifications", e -> openNotificationsPanel()));
        actionsPanel.add(createButton("9. Logout", e -> logout()));

        return actionsPanel;
    }

    private JButton createButton(String text, java.awt.event.ActionListener actionListener) {
        JButton button = new JButton(text);
        button.addActionListener(actionListener);
        return button;
    }

    private void openProfilePanel() {
        ProfilePanel panel = new ProfilePanel(profileService, loggedInUser);
        showPanelDialog("Manage Profile", panel, 520, 320);
    }

    private void openMeetupListPanel() {
        MeetupListPanel panel = new MeetupListPanel(meetupService);
        showPanelDialog("Active / Upcoming Meetups", panel, 640, 420);
    }

    private void openMeetupDetailPanel() {
        String meetupId = JOptionPane.showInputDialog(this, "Enter meetup ID:");
        if (meetupId == null || meetupId.trim().isEmpty()) {
            return;
        }
        Meetup meetup = meetupService.getMeetupDetails(meetupId.trim());
        MeetupDetailPanel panel = new MeetupDetailPanel(meetupService);
        panel.showMeetup(meetup);
        showPanelDialog("Meetup Details", panel, 640, 420);
    }

    private void openCreateMeetupPanel() {
        CreateMeetupPanel panel = new CreateMeetupPanel(meetupService, loggedInUser);
        showPanelDialog("Create Meetup", panel, 520, 320);
    }

    private void openEditMeetupPanel() {
        EditMeetupPanel panel = new EditMeetupPanel(meetupService);
        showPanelDialog("Edit Meetup", panel, 520, 320);
    }

    private void openManageParticipantsPanel() {
        ManageParticipantsPanel panel = new ManageParticipantsPanel(meetupService);
        showPanelDialog("Invite / Approve Participants", panel, 520, 320);
    }

    private void openJoinResponsePanel() {
        JoinResponsePanel panel = new JoinResponsePanel(meetupService);
        showPanelDialog("Respond to Join Request", panel, 520, 320);
    }

    private void openNotificationsPanel() {
        NotificationsPanel panel = new NotificationsPanel(notificationService);
        List<Notification> notifications = notificationService.getAllNotifications();
        JOptionPane.showMessageDialog(
                this,
                "Current notifications stored: " + notifications.size(),
                "Send Update Notifications",
                JOptionPane.INFORMATION_MESSAGE);
        showPanelDialog("Send Update Notifications", panel, 520, 320);
    }

    private void showPanelDialog(String title, JPanel panel, int width, int height) {
        JFrame frame = new JFrame(title);
        frame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        frame.setSize(width, height);
        frame.setLocationRelativeTo(this);
        frame.add(panel);
        frame.setVisible(true);
    }

    private void logout() {
        dispose();
        if (onLogout != null) {
            onLogout.run();
        }
    }
}
