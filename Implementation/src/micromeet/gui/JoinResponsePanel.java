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
import javax.swing.JTextField;
import micromeet.entity.Meetup;
import micromeet.service.MeetupService;

public class JoinResponsePanel extends JPanel {
    private final MeetupService meetupService;
    private final JTextField meetupIdField;
    private final JTextField userIdField;
    private final JTextField choiceField;
    private final JLabel statusLabel;

    public JoinResponsePanel(MeetupService meetupService) {
        this.meetupService = meetupService;
        this.meetupIdField = new JTextField(16);
        this.userIdField = new JTextField(16);
        this.choiceField = new JTextField(16);
        this.statusLabel = new JLabel(" ");
        initializeUi();
    }

    private void initializeUi() {
        setLayout(new BorderLayout(10, 10));
        setBorder(BorderFactory.createTitledBorder("Respond to Join Request"));

        JPanel formPanel = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 6, 5, 6);
        gbc.anchor = GridBagConstraints.WEST;

        gbc.gridx = 0;
        gbc.gridy = 0;
        formPanel.add(new JLabel("Meetup ID:"), gbc);
        gbc.gridx = 1;
        formPanel.add(meetupIdField, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        formPanel.add(new JLabel("User ID:"), gbc);
        gbc.gridx = 1;
        formPanel.add(userIdField, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;
        formPanel.add(new JLabel("Choice (ACCEPT/DECLINE):"), gbc);
        gbc.gridx = 1;
        formPanel.add(choiceField, gbc);

        JButton submitButton = new JButton("Submit Response");
        submitButton.addActionListener(e -> submitResponse());
        gbc.gridx = 1;
        gbc.gridy = 3;
        formPanel.add(submitButton, gbc);

        statusLabel.setForeground(new Color(160, 0, 0));

        add(formPanel, BorderLayout.CENTER);
        add(statusLabel, BorderLayout.SOUTH);
    }

    private void submitResponse() {
        String meetupId = meetupIdField.getText().trim();
        String userId = userIdField.getText().trim();
        String choice = choiceField.getText().trim().toUpperCase();

        if (meetupId.isEmpty() || userId.isEmpty() || choice.isEmpty()) {
            setStatus("Please fill meetupId, userId, and choice.", false);
            return;
        }
        if (!"ACCEPT".equals(choice) && !"DECLINE".equals(choice)) {
            setStatus("Choice must be ACCEPT or DECLINE.", false);
            return;
        }

        Meetup meetup = meetupService.updateParticipation(meetupId, userId, choice);
        if (meetup == null) {
            setStatus("Failed to update participation.", false);
            return;
        }

        setStatus(
                "Response saved for meetup "
                        + meetup.getMeetupId()
                        + ". Participant count: "
                        + meetup.getParticipants().size(),
                true);
    }

    private void setStatus(String message, boolean success) {
        statusLabel.setForeground(success ? new Color(0, 128, 0) : new Color(160, 0, 0));
        statusLabel.setText(message);
    }

    public MeetupService getMeetupService() {
        return meetupService;
    }
}
