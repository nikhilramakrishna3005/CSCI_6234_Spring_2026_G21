package micromeet.gui;

import java.awt.BorderLayout;
import java.awt.Dimension;
import javax.swing.JFrame;
import javax.swing.JTabbedPane;
import micromeet.repository.MeetupRepository;
import micromeet.repository.UserRepository;
import micromeet.service.MeetupService;
import micromeet.service.NotificationService;
import micromeet.service.ProfileService;

public class DashboardFrame extends JFrame {
    private final UserRepository userRepository;
    private final MeetupRepository meetupRepository;
    private final ProfileService profileService;
    private final MeetupService meetupService;
    private final NotificationService notificationService;

    public DashboardFrame(
            UserRepository userRepository,
            MeetupRepository meetupRepository,
            ProfileService profileService,
            MeetupService meetupService,
            NotificationService notificationService) {
        this.userRepository = userRepository;
        this.meetupRepository = meetupRepository;
        this.profileService = profileService;
        this.meetupService = meetupService;
        this.notificationService = notificationService;
        initialize();
    }

    private void initialize() {
        setTitle("MicroMeet Dashboard");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setPreferredSize(new Dimension(1000, 700));
        setLayout(new BorderLayout());

        JTabbedPane tabs = new JTabbedPane();
        tabs.addTab("Profile", new ProfilePanel(profileService));
        tabs.addTab("Meetups", new MeetupListPanel(meetupService));
        tabs.addTab("Meetup Details", new MeetupDetailPanel(meetupService));
        tabs.addTab("Create Meetup", new CreateMeetupPanel(meetupService));
        tabs.addTab("Edit Meetup", new EditMeetupPanel(meetupService));
        tabs.addTab("Manage Participants", new ManageParticipantsPanel(meetupService));
        tabs.addTab("Join Response", new JoinResponsePanel(meetupService));
        tabs.addTab("Notifications", new NotificationsPanel(notificationService));

        add(tabs, BorderLayout.CENTER);
        pack();
        setLocationRelativeTo(null);
    }
}
