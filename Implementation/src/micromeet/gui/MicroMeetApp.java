package micromeet.gui;

import javax.swing.UIManager;
import javax.swing.SwingUtilities;
import micromeet.entity.User;
import micromeet.repository.MeetupRepository;
import micromeet.repository.UserRepository;
import micromeet.service.AuthService;
import micromeet.service.MeetupService;
import micromeet.service.NotificationService;
import micromeet.service.ProfileService;

public class MicroMeetApp {
    private final UserRepository userRepository;
    private final MeetupRepository meetupRepository;
    private final NotificationService notificationService;
    private final AuthService authService;
    private final ProfileService profileService;
    private final MeetupService meetupService;

    public MicroMeetApp() {
        this.userRepository = new UserRepository();
        this.userRepository.seedSampleUsers();

        this.meetupRepository = new MeetupRepository();
        this.meetupRepository.seedSampleMeetups();

        this.notificationService = new NotificationService();
        this.authService = new AuthService(userRepository);
        this.profileService = new ProfileService(userRepository);
        this.meetupService = new MeetupService(meetupRepository, userRepository, notificationService);
    }

    public void start() {
        LoginFrame loginFrame = new LoginFrame(authService, this::showDashboard);
        loginFrame.setVisible(true);
    }

    public void showDashboard(User loggedInUser) {
        DashboardFrame dashboardFrame =
                new DashboardFrame(
                        loggedInUser,
                        profileService,
                        meetupService,
                        notificationService,
                        this::start);
        dashboardFrame.setVisible(true);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(
                () -> {
                    installLookAndFeel();
                    MicroMeetApp app = new MicroMeetApp();
                    app.start();
                });
    }

    private static void installLookAndFeel() {
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception ignored) {
            // Fallback to default look and feel.
        }
    }
}
