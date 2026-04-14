package micromeet.gui;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import micromeet.entity.Meetup;
import micromeet.entity.User;
import micromeet.service.MeetupService;

public class CreateMeetupPanel extends JPanel {
    private final MeetupService meetupService;
    private final User loggedInUser;

    private final JTextField titleField;
    private final JTextField activityTypeField;
    private final JTextField timeField;
    private final JTextField capacityField;
    private final JTextArea descriptionArea;
    private final JTextField locationLabelField;
    private final JLabel statusLabel;

    public CreateMeetupPanel(MeetupService meetupService, User loggedInUser) {
        this.meetupService = meetupService;
        this.loggedInUser = loggedInUser;
        this.titleField = new JTextField(18);
        this.activityTypeField = new JTextField(18);
        this.timeField = new JTextField(18);
        this.capacityField = new JTextField(18);
        this.descriptionArea = new JTextArea(4, 18);
        this.locationLabelField = new JTextField(18);
        this.statusLabel = new JLabel(" ");
        initializeUi();
    }

    private void initializeUi() {
        setLayout(new BorderLayout(10, 10));

        JLabel title = new JLabel("Create Meetup");
        add(title, BorderLayout.NORTH);

        JPanel formPanel = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 6, 5, 6);
        gbc.anchor = GridBagConstraints.WEST;
        gbc.fill = GridBagConstraints.HORIZONTAL;

        gbc.gridx = 0;
        gbc.gridy = 0;
        formPanel.add(new JLabel("Title:"), gbc);
        gbc.gridx = 1;
        formPanel.add(titleField, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        formPanel.add(new JLabel("Activity Type:"), gbc);
        gbc.gridx = 1;
        formPanel.add(activityTypeField, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;
        formPanel.add(new JLabel("Time:"), gbc);
        gbc.gridx = 1;
        formPanel.add(timeField, gbc);

        gbc.gridx = 0;
        gbc.gridy = 3;
        formPanel.add(new JLabel("Capacity:"), gbc);
        gbc.gridx = 1;
        formPanel.add(capacityField, gbc);

        gbc.gridx = 0;
        gbc.gridy = 4;
        formPanel.add(new JLabel("Description:"), gbc);
        gbc.gridx = 1;
        formPanel.add(descriptionArea, gbc);

        gbc.gridx = 0;
        gbc.gridy = 5;
        formPanel.add(new JLabel("Location Label:"), gbc);
        gbc.gridx = 1;
        formPanel.add(locationLabelField, gbc);

        JButton createButton = new JButton("Create Meetup");
        createButton.addActionListener(e -> createMeetup());
        gbc.gridx = 1;
        gbc.gridy = 6;
        formPanel.add(createButton, gbc);

        add(formPanel, BorderLayout.CENTER);

        statusLabel.setForeground(new Color(160, 0, 0));
        add(statusLabel, BorderLayout.SOUTH);
    }

    private void createMeetup() {
        if (loggedInUser == null) {
            setStatus("No logged-in user available for hosting.", false);
            return;
        }

        int capacity;
        try {
            capacity = Integer.parseInt(capacityField.getText().trim());
        } catch (NumberFormatException ex) {
            setStatus("Capacity must be a valid number.", false);
            return;
        }

        Meetup meetup =
                meetupService.createMeetup(
                        loggedInUser.getUserId(),
                        titleField.getText().trim(),
                        activityTypeField.getText().trim(),
                        timeField.getText().trim(),
                        capacity,
                        descriptionArea.getText().trim(),
                        locationLabelField.getText().trim());

        if (meetup == null) {
            setStatus("Failed to create meetup.", false);
            return;
        }

        setStatus("Meetup created: " + meetup.getMeetupId(), true);
    }

    private void setStatus(String message, boolean success) {
        statusLabel.setForeground(success ? new Color(0, 128, 0) : new Color(160, 0, 0));
        statusLabel.setText(message);
    }

    public MeetupService getMeetupService() {
        return meetupService;
    }
}
