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

public class ManageParticipantsPanel extends JPanel {
    private final MeetupService meetupService;
    private final JTextField meetupIdField;
    private final JTextField userIdField;
    private final JTextField actionField;
    private final JLabel statusLabel;

    public ManageParticipantsPanel(MeetupService meetupService) {
        this.meetupService = meetupService;
        this.meetupIdField = new JTextField(16);
        this.userIdField = new JTextField(16);
        this.actionField = new JTextField(16);
        this.statusLabel = new JLabel(" ");
        initializeUi();
    }

    private void initializeUi() {
        setLayout(new BorderLayout(10, 10));
        setBorder(BorderFactory.createTitledBorder("Invite / Approve Participants"));

        JPanel formPanel = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(6, 6, 6, 6);
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
        formPanel.add(new JLabel("Action (INVITE/APPROVE):"), gbc);
        gbc.gridx = 1;
        formPanel.add(actionField, gbc);

        JButton submitButton = new JButton("Apply Action");
        submitButton.addActionListener(e -> manageParticipants());
        gbc.gridx = 1;
        gbc.gridy = 3;
        gbc.anchor = GridBagConstraints.EAST;
        formPanel.add(submitButton, gbc);

        statusLabel.setForeground(new Color(160, 0, 0));

        add(formPanel, BorderLayout.CENTER);
        add(statusLabel, BorderLayout.SOUTH);
    }

    private void manageParticipants() {
        String meetupId = meetupIdField.getText().trim();
        String userId = userIdField.getText().trim();
        String action = actionField.getText().trim();

        if (meetupId.isEmpty() || userId.isEmpty() || action.isEmpty()) {
            setStatus("Please fill meetupId, userId, and action.", false);
            return;
        }
        if (!"INVITE".equalsIgnoreCase(action) && !"APPROVE".equalsIgnoreCase(action)) {
            setStatus("Action must be INVITE or APPROVE.", false);
            return;
        }

        Meetup updated = meetupService.manageParticipants(meetupId, userId, action);
        if (updated == null) {
            setStatus("Failed to manage participants. Check meetup/user/action.", false);
            return;
        }

        setStatus(
                "Updated " + updated.getMeetupId() + ". Total participants: "
                        + updated.getParticipants().size(),
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
