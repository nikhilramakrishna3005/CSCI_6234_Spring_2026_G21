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
import javax.swing.JTextArea;
import javax.swing.JTextField;
import micromeet.entity.Meetup;
import micromeet.service.MeetupService;

public class EditMeetupPanel extends JPanel {
    private final MeetupService meetupService;

    private final JTextField meetupIdField;
    private final JTextField titleField;
    private final JTextField timeField;
    private final JTextField capacityField;
    private final JTextArea descriptionArea;
    private final JLabel statusLabel;

    public EditMeetupPanel(MeetupService meetupService) {
        this.meetupService = meetupService;
        this.meetupIdField = new JTextField(16);
        this.titleField = new JTextField(18);
        this.timeField = new JTextField(18);
        this.capacityField = new JTextField(18);
        this.descriptionArea = new JTextArea(4, 18);
        this.statusLabel = new JLabel(" ");
        initializeUi();
    }

    private void initializeUi() {
        setLayout(new BorderLayout(10, 10));
        setBorder(BorderFactory.createTitledBorder("Edit Meetup"));

        JPanel formPanel = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(4, 6, 4, 6);
        gbc.anchor = GridBagConstraints.WEST;

        int row = 0;
        addLabeledField(formPanel, gbc, row++, "Meetup ID:", meetupIdField);

        JButton loadButton = new JButton("Load Meetup");
        loadButton.addActionListener(e -> loadMeetup());
        gbc.gridx = 1;
        gbc.gridy = row++;
        gbc.fill = GridBagConstraints.NONE;
        formPanel.add(loadButton, gbc);

        addLabeledField(formPanel, gbc, row++, "Title:", titleField);
        addLabeledField(formPanel, gbc, row++, "Time:", timeField);
        addLabeledField(formPanel, gbc, row++, "Capacity:", capacityField);

        gbc.gridx = 0;
        gbc.gridy = row;
        gbc.anchor = GridBagConstraints.NORTHWEST;
        formPanel.add(new JLabel("Description:"), gbc);
        gbc.gridx = 1;
        descriptionArea.setLineWrap(true);
        descriptionArea.setWrapStyleWord(true);
        formPanel.add(descriptionArea, gbc);

        JButton saveButton = new JButton("Save Changes");
        saveButton.addActionListener(e -> saveChanges());
        gbc.gridx = 1;
        gbc.gridy = row + 1;
        gbc.anchor = GridBagConstraints.EAST;
        formPanel.add(saveButton, gbc);

        statusLabel.setForeground(new Color(160, 0, 0));

        add(formPanel, BorderLayout.CENTER);
        add(statusLabel, BorderLayout.SOUTH);
    }

    private void addLabeledField(
            JPanel panel, GridBagConstraints gbc, int row, String labelText, JTextField field) {
        gbc.gridx = 0;
        gbc.gridy = row;
        gbc.anchor = GridBagConstraints.WEST;
        panel.add(new JLabel(labelText), gbc);
        gbc.gridx = 1;
        panel.add(field, gbc);
    }

    private void loadMeetup() {
        String meetupId = meetupIdField.getText().trim();
        if (meetupId.isEmpty()) {
            setStatus("Please enter meetup ID.", false);
            return;
        }

        Meetup meetup = meetupService.getMeetupDetails(meetupId);
        if (meetup == null) {
            setStatus("Meetup not found.", false);
            return;
        }

        titleField.setText(valueOrEmpty(meetup.getTitle()));
        timeField.setText(valueOrEmpty(meetup.getTime()));
        capacityField.setText(String.valueOf(meetup.getCapacity()));
        descriptionArea.setText(valueOrEmpty(meetup.getDescription()));
        setStatus("Meetup loaded.", true);
    }

    private void saveChanges() {
        String meetupId = meetupIdField.getText().trim();
        String title = titleField.getText().trim();
        String time = timeField.getText().trim();
        String description = descriptionArea.getText().trim();
        int capacity;
        try {
            capacity = Integer.parseInt(capacityField.getText().trim());
        } catch (NumberFormatException ex) {
            setStatus("Capacity must be a number.", false);
            return;
        }

        Meetup updated = meetupService.editMeetup(meetupId, title, time, capacity, description);
        if (updated == null) {
            setStatus("Failed to save changes. Check meetup ID.", false);
            return;
        }

        setStatus("Meetup updated successfully.", true);
    }

    private void setStatus(String message, boolean success) {
        statusLabel.setForeground(success ? new Color(0, 128, 0) : new Color(160, 0, 0));
        statusLabel.setText(message);
    }

    private String valueOrEmpty(String value) {
        return value == null ? "" : value;
    }

    public MeetupService getMeetupService() {
        return meetupService;
    }
}
