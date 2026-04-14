package micromeet.gui;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import micromeet.entity.Preference;
import micromeet.entity.User;
import micromeet.service.ProfileService;

public class ProfilePanel extends JPanel {
    private final ProfileService profileService;
    private String currentUserId;

    private final JLabel userIdValue;
    private final JLabel nameValue;
    private final JLabel emailValue;
    private final JLabel availabilityValue;
    private final JTextArea preferencesArea;

    private final JTextField nameField;
    private final JTextField emailField;
    private final JTextField preferenceKeyField;
    private final JTextField preferenceValueField;
    private final JLabel statusLabel;

    public ProfilePanel(ProfileService profileService) {
        this(profileService, null);
    }

    public ProfilePanel(ProfileService profileService, User currentUser) {
        this.profileService = profileService;
        this.currentUserId = currentUser != null ? currentUser.getUserId() : null;
        this.userIdValue = new JLabel("-");
        this.nameValue = new JLabel("-");
        this.emailValue = new JLabel("-");
        this.availabilityValue = new JLabel("-");
        this.preferencesArea = new JTextArea(5, 28);
        this.nameField = new JTextField(18);
        this.emailField = new JTextField(18);
        this.preferenceKeyField = new JTextField(10);
        this.preferenceValueField = new JTextField(10);
        this.statusLabel = new JLabel(" ");
        initializeUi();
        refreshProfile();
    }

    private void initializeUi() {
        setLayout(new BorderLayout(10, 10));
        setBorder(BorderFactory.createTitledBorder("Manage Profile"));

        JPanel profileViewPanel = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(4, 6, 4, 6);
        gbc.anchor = GridBagConstraints.WEST;

        gbc.gridx = 0;
        gbc.gridy = 0;
        profileViewPanel.add(new JLabel("User ID:"), gbc);
        gbc.gridx = 1;
        profileViewPanel.add(userIdValue, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        profileViewPanel.add(new JLabel("Name:"), gbc);
        gbc.gridx = 1;
        profileViewPanel.add(nameValue, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;
        profileViewPanel.add(new JLabel("Email:"), gbc);
        gbc.gridx = 1;
        profileViewPanel.add(emailValue, gbc);

        gbc.gridx = 0;
        gbc.gridy = 3;
        profileViewPanel.add(new JLabel("Availability:"), gbc);
        gbc.gridx = 1;
        profileViewPanel.add(availabilityValue, gbc);

        gbc.gridx = 0;
        gbc.gridy = 4;
        gbc.anchor = GridBagConstraints.NORTHWEST;
        profileViewPanel.add(new JLabel("Preferences:"), gbc);
        gbc.gridx = 1;
        preferencesArea.setEditable(false);
        profileViewPanel.add(new JScrollPane(preferencesArea), gbc);

        JPanel formPanel = new JPanel(new GridBagLayout());
        GridBagConstraints formGbc = new GridBagConstraints();
        formGbc.insets = new Insets(4, 6, 4, 6);
        formGbc.anchor = GridBagConstraints.WEST;

        formGbc.gridx = 0;
        formGbc.gridy = 0;
        formPanel.add(new JLabel("New Name:"), formGbc);
        formGbc.gridx = 1;
        formPanel.add(nameField, formGbc);

        formGbc.gridx = 0;
        formGbc.gridy = 1;
        formPanel.add(new JLabel("New Email:"), formGbc);
        formGbc.gridx = 1;
        formPanel.add(emailField, formGbc);

        JButton updateProfileButton = new JButton("Update Profile");
        updateProfileButton.addActionListener(e -> updateProfile());
        formGbc.gridx = 1;
        formGbc.gridy = 2;
        formPanel.add(updateProfileButton, formGbc);

        formGbc.gridx = 0;
        formGbc.gridy = 3;
        formPanel.add(new JLabel("Preference Key:"), formGbc);
        formGbc.gridx = 1;
        formPanel.add(preferenceKeyField, formGbc);

        formGbc.gridx = 0;
        formGbc.gridy = 4;
        formPanel.add(new JLabel("Preference Value:"), formGbc);
        formGbc.gridx = 1;
        formPanel.add(preferenceValueField, formGbc);

        JButton updatePreferenceButton = new JButton("Update Preference");
        updatePreferenceButton.addActionListener(e -> updatePreference());
        formGbc.gridx = 1;
        formGbc.gridy = 5;
        formPanel.add(updatePreferenceButton, formGbc);

        JButton refreshButton = new JButton("Refresh");
        refreshButton.addActionListener(e -> refreshProfile());
        formGbc.gridx = 1;
        formGbc.gridy = 6;
        formPanel.add(refreshButton, formGbc);

        JPanel contentPanel = new JPanel(new BorderLayout(12, 12));
        contentPanel.add(profileViewPanel, BorderLayout.CENTER);
        contentPanel.add(formPanel, BorderLayout.EAST);

        statusLabel.setForeground(new Color(160, 0, 0));

        add(contentPanel, BorderLayout.CENTER);
        add(statusLabel, BorderLayout.SOUTH);
    }

    public void setCurrentUser(User user) {
        this.currentUserId = user != null ? user.getUserId() : null;
        refreshProfile();
    }

    public void refreshProfile() {
        if (currentUserId == null || currentUserId.trim().isEmpty()) {
            setStatus("No logged-in user found.", false);
            return;
        }
        User user = profileService.getUserProfile(currentUserId);
        if (user == null) {
            setStatus("Could not load profile.", false);
            return;
        }

        userIdValue.setText(valueOrDash(user.getUserId()));
        nameValue.setText(valueOrDash(user.getName()));
        emailValue.setText(valueOrDash(user.getEmail()));
        availabilityValue.setText(user.getAvailability() == null ? "-" : user.getAvailability().name());
        preferencesArea.setText(buildPreferencesText(user));
        setStatus("Profile loaded.", true);
    }

    private void updateProfile() {
        if (currentUserId == null) {
            setStatus("No logged-in user to update.", false);
            return;
        }

        String name = nameField.getText().trim();
        String email = emailField.getText().trim();
        User updated = profileService.updateProfile(currentUserId, name, email);
        if (updated == null) {
            setStatus("Failed to update profile.", false);
            return;
        }
        setStatus("Profile updated successfully.", true);
        refreshProfile();
    }

    private void updatePreference() {
        if (currentUserId == null) {
            setStatus("No logged-in user to update.", false);
            return;
        }
        String key = preferenceKeyField.getText().trim();
        String value = preferenceValueField.getText().trim();
        User updated = profileService.updatePreference(currentUserId, key, value);
        if (updated == null) {
            setStatus("Failed to update preference.", false);
            return;
        }
        setStatus("Preference saved.", true);
        refreshProfile();
    }

    private String buildPreferencesText(User user) {
        if (user.getPreferences() == null || user.getPreferences().isEmpty()) {
            return "-";
        }
        StringBuilder builder = new StringBuilder();
        for (Preference preference : user.getPreferences()) {
            if (preference != null) {
                builder.append("- ")
                        .append(valueOrDash(preference.getKey()))
                        .append(" = ")
                        .append(valueOrDash(preference.getValue()))
                        .append('\n');
            }
        }
        return builder.toString().trim();
    }

    private void setStatus(String message, boolean success) {
        statusLabel.setForeground(success ? new Color(0, 128, 0) : new Color(160, 0, 0));
        statusLabel.setText(message);
    }

    private String valueOrDash(String value) {
        return value == null || value.trim().isEmpty() ? "-" : value;
    }

    public ProfileService getProfileService() {
        return profileService;
    }
}
