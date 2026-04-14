package micromeet.gui;

import java.awt.BorderLayout;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.SwingConstants;
import micromeet.service.MeetupService;

public class CreateMeetupPanel extends JPanel {
    private final MeetupService meetupService;

    public CreateMeetupPanel(MeetupService meetupService) {
        this.meetupService = meetupService;
        initializeUi();
    }

    private void initializeUi() {
        setLayout(new BorderLayout());
        add(new JLabel("Create Meetup (skeleton)", SwingConstants.CENTER), BorderLayout.CENTER);
    }

    public MeetupService getMeetupService() {
        return meetupService;
    }
}
