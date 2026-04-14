package micromeet.gui;

import java.awt.BorderLayout;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import micromeet.entity.Meetup;
import micromeet.service.MeetupService;

public class MeetupDetailPanel extends JPanel {
    private final MeetupService meetupService;
    private final JTextArea detailsArea;

    public MeetupDetailPanel(MeetupService meetupService) {
        this.meetupService = meetupService;
        this.detailsArea = new JTextArea(16, 48);
        initUi();
    }

    private void initUi() {
        setLayout(new BorderLayout(8, 8));
        add(new JLabel("Meetup Details"), BorderLayout.NORTH);
        detailsArea.setEditable(false);
        detailsArea.setText("Select a meetup to view details.");
        add(new JScrollPane(detailsArea), BorderLayout.CENTER);
    }

    public void showMeetup(Meetup meetup) {
        if (meetup == null) {
            detailsArea.setText("No meetup selected.");
            return;
        }

        StringBuilder builder = new StringBuilder();
        builder.append("ID: ").append(meetup.getMeetupId()).append('\n');
        builder.append("Title: ").append(meetup.getTitle()).append('\n');
        builder.append("Activity: ").append(meetup.getActivityType()).append('\n');
        builder.append("Time: ").append(meetup.getTime()).append('\n');
        builder.append("Capacity: ").append(meetup.getCapacity()).append('\n');
        detailsArea.setText(builder.toString());
    }

    public MeetupService getMeetupService() {
        return meetupService;
    }
}
