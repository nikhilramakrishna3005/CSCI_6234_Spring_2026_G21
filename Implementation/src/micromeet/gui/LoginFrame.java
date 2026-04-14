package micromeet.gui;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionListener;
import java.util.function.Consumer;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JPasswordField;
import javax.swing.JTextField;
import micromeet.entity.User;
import micromeet.service.AuthService;

public class LoginFrame extends JFrame {
    private final AuthService authService;
    private final Consumer<User> onLoginSuccess;

    private final JTextField usernameField;
    private final JPasswordField passwordField;
    private final JButton loginButton;
    private final JLabel statusLabel;

    public LoginFrame(AuthService authService, Consumer<User> onLoginSuccess) {
        this.authService = authService;
        this.onLoginSuccess = onLoginSuccess;
        this.usernameField = new JTextField(18);
        this.passwordField = new JPasswordField(18);
        this.loginButton = new JButton("Login");
        this.statusLabel = new JLabel(" ");
        initializeUi();
        bindActions();
    }

    private void initializeUi() {
        setTitle("MicroMeet");
        setSize(430, 260);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout(10, 10));

        JLabel titleLabel = new JLabel("MicroMeet Login", JLabel.CENTER);
        titleLabel.setFont(new Font("SansSerif", Font.BOLD, 20));
        add(titleLabel, BorderLayout.NORTH);

        JPanel formPanel = new JPanel(new GridBagLayout());
        formPanel.setBorder(BorderFactory.createEmptyBorder(8, 16, 8, 16));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(6, 6, 6, 6);
        gbc.anchor = GridBagConstraints.WEST;

        gbc.gridx = 0;
        gbc.gridy = 0;
        formPanel.add(new JLabel("Username:"), gbc);

        gbc.gridx = 1;
        formPanel.add(usernameField, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        formPanel.add(new JLabel("Password:"), gbc);

        gbc.gridx = 1;
        formPanel.add(passwordField, gbc);

        gbc.gridx = 1;
        gbc.gridy = 2;
        gbc.anchor = GridBagConstraints.EAST;
        formPanel.add(loginButton, gbc);

        add(formPanel, BorderLayout.CENTER);

        JPanel footerPanel = new JPanel(new BorderLayout());
        footerPanel.setBorder(BorderFactory.createEmptyBorder(0, 12, 10, 12));
        statusLabel.setForeground(new Color(180, 0, 0));
        footerPanel.add(statusLabel, BorderLayout.NORTH);
        footerPanel.add(
                new JLabel("Demo accounts: host1/pass123, user1/pass123, user2/pass123"),
                BorderLayout.SOUTH);
        add(footerPanel, BorderLayout.SOUTH);
    }

    private void bindActions() {
        ActionListener loginAction = e -> authenticate();
        loginButton.addActionListener(loginAction);
        usernameField.addActionListener(loginAction);
        passwordField.addActionListener(loginAction);
    }

    private void authenticate() {
        String username = usernameField.getText().trim();
        String password = new String(passwordField.getPassword());

        User authenticatedUser = authService.authenticate(username, password);
        if (authenticatedUser == null) {
            statusLabel.setForeground(new Color(180, 0, 0));
            statusLabel.setText("Invalid username or password. Please try again.");
            return;
        }

        statusLabel.setForeground(new Color(0, 128, 0));
        statusLabel.setText("Login successful. Opening dashboard...");
        dispose();
        if (onLoginSuccess != null) {
            onLoginSuccess.accept(authenticatedUser);
        }
    }
}
