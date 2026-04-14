package micromeet.gui;

import java.awt.BorderLayout;
import javax.swing.JLabel;
import javax.swing.JPanel;
import micromeet.service.MeetupService;

public class JoinResponsePanel extends JPanel {
    private final MeetupService meetupService;

    public JoinResponsePanel(MeetupService meetupService) {
        this.meetupService = meetupService;
        initializeUi();
    }

    private void initializeUi() {
        setLayout(new BorderLayout());
        add(new JLabel("Join Response Panel", JLabel.CENTER), BorderLayout.CENTER);
    }

    public MeetupService getMeetupService() {
        return meetupService;
    }
}
