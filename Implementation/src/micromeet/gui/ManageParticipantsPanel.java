package micromeet.gui;

import java.awt.BorderLayout;
import javax.swing.JLabel;
import javax.swing.JPanel;
import micromeet.service.MeetupService;

public class ManageParticipantsPanel extends JPanel {
    private final MeetupService meetupService;

    public ManageParticipantsPanel(MeetupService meetupService) {
        this.meetupService = meetupService;
        initializeUi();
    }

    private void initializeUi() {
        setLayout(new BorderLayout());
        add(new JLabel("Manage Participants Panel", JLabel.CENTER), BorderLayout.CENTER);
    }

    public MeetupService getMeetupService() {
        return meetupService;
    }
}
