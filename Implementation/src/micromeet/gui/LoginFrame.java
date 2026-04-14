package micromeet.gui;

import java.awt.BorderLayout;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JPasswordField;
import javax.swing.JTextField;
import micromeet.repository.MeetupRepository;
import micromeet.repository.UserRepository;
import micromeet.service.AuthService;
import micromeet.service.MeetupService;
import micromeet.service.NotificationService;
import micromeet.service.ProfileService;

public class LoginFrame extends JFrame {
    private final AuthService authService;
    private final ProfileService profileService;
    private final MeetupService meetupService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final MeetupRepository meetupRepository;

    private JTextField usernameField;
    private JPasswordField passwordField;
    private JButton loginButton;

    public LoginFrame(
            AuthService authService,
            ProfileService profileService,
            MeetupService meetupService,
            NotificationService notificationService,
            UserRepository userRepository,
            MeetupRepository meetupRepository) {
        this.authService = authService;
        this.profileService = profileService;
        this.meetupService = meetupService;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
        this.meetupRepository = meetupRepository;
        initializeUi();
    }

    private void initializeUi() {
        setTitle("MicroMeet - Login");
        setSize(420, 220);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());

        JPanel formPanel = new JPanel();
        formPanel.add(new JLabel("Username:"));
        usernameField = new JTextField(20);
        formPanel.add(usernameField);

        formPanel.add(new JLabel("Password:"));
        passwordField = new JPasswordField(20);
        formPanel.add(passwordField);

        loginButton = new JButton("Login");
        formPanel.add(loginButton);

        add(formPanel, BorderLayout.CENTER);
    }
}
