package micromeet.gui;

import java.awt.BorderLayout;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import javax.swing.JLabel;
import javax.swing.JPanel;
import micromeet.entity.Meetup;
import micromeet.service.MeetupService;

public class MeetupDetailPanel extends JPanel {
    private final MeetupService meetupService;
    private final JLabel titleValue;
    private final JLabel typeValue;
    private final JLabel timeValue;
    private final JLabel capacityValue;
    private final JLabel locationValue;
    private final JLabel participantsValue;
    private final JLabel descriptionValue;

    public MeetupDetailPanel(MeetupService meetupService) {
        this.meetupService = meetupService;
        this.titleValue = new JLabel("-");
        this.typeValue = new JLabel("-");
        this.timeValue = new JLabel("-");
        this.capacityValue = new JLabel("-");
        this.locationValue = new JLabel("-");
        this.participantsValue = new JLabel("-");
        this.descriptionValue = new JLabel("-");
        initUi();
    }

    private void initUi() {
        setLayout(new BorderLayout(8, 8));
        add(new JLabel("Meetup Details"), BorderLayout.NORTH);

        JPanel detailsPanel = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(4, 8, 4, 8);
        gbc.anchor = GridBagConstraints.WEST;

        addDetailRow(detailsPanel, gbc, 0, "Title:", titleValue);
        addDetailRow(detailsPanel, gbc, 1, "Type:", typeValue);
        addDetailRow(detailsPanel, gbc, 2, "Time:", timeValue);
        addDetailRow(detailsPanel, gbc, 3, "Capacity:", capacityValue);
        addDetailRow(detailsPanel, gbc, 4, "Description:", descriptionValue);
        addDetailRow(detailsPanel, gbc, 5, "Location:", locationValue);
        addDetailRow(detailsPanel, gbc, 6, "Participants:", participantsValue);

        add(detailsPanel, BorderLayout.CENTER);
    }

    public void showMeetup(Meetup meetup) {
        if (meetup == null) {
            clearDetails("No meetup selected.");
            return;
        }

        titleValue.setText(valueOrDash(meetup.getTitle()));
        typeValue.setText(meetup.getActivityType() == null ? "-" : meetup.getActivityType().name());
        timeValue.setText(valueOrDash(meetup.getTime()));
        capacityValue.setText(String.valueOf(meetup.getCapacity()));
        descriptionValue.setText(valueOrDash(meetup.getDescription()));
        locationValue.setText(
                meetup.getLocation() == null ? "-" : valueOrDash(meetup.getLocation().getLabel()));
        participantsValue.setText(String.valueOf(meetup.getParticipants() == null ? 0 : meetup.getParticipants().size()));
    }

    public void showMeetupById(String meetupId) {
        Meetup meetup = meetupService.getMeetupDetails(meetupId);
        showMeetup(meetup);
    }

    private void addDetailRow(
            JPanel panel, GridBagConstraints gbc, int row, String labelText, JLabel valueLabel) {
        gbc.gridx = 0;
        gbc.gridy = row;
        panel.add(new JLabel(labelText), gbc);

        gbc.gridx = 1;
        panel.add(valueLabel, gbc);
    }

    private void clearDetails(String message) {
        titleValue.setText(message);
        typeValue.setText("-");
        timeValue.setText("-");
        capacityValue.setText("-");
        descriptionValue.setText("-");
        locationValue.setText("-");
        participantsValue.setText("-");
    }

    private String valueOrDash(String value) {
        return value == null || value.trim().isEmpty() ? "-" : value;
    }

    public MeetupService getMeetupService() {
        return meetupService;
    }
}
