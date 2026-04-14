package micromeet.gui;

import java.awt.BorderLayout;
import java.util.List;
import javax.swing.DefaultListModel;
import javax.swing.JLabel;
import javax.swing.JList;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import micromeet.entity.Meetup;
import micromeet.service.MeetupService;

public class MeetupListPanel extends JPanel {
    private final MeetupService meetupService;
    private final JLabel titleLabel;
    private final DefaultListModel<String> meetupListModel;
    private final JList<String> meetupList;

    public MeetupListPanel(MeetupService meetupService) {
        this.meetupService = meetupService;
        setLayout(new BorderLayout(10, 10));
        titleLabel = new JLabel("Meetups");
        meetupListModel = new DefaultListModel<>();
        meetupList = new JList<>(meetupListModel);

        add(titleLabel, BorderLayout.NORTH);
        add(new JScrollPane(meetupList), BorderLayout.CENTER);
    }

    public void setMeetups(List<Meetup> meetups) {
        meetupListModel.clear();
        if (meetups == null) {
            return;
        }
        for (Meetup meetup : meetups) {
            if (meetup != null) {
                meetupListModel.addElement(meetup.getMeetupId() + " - " + meetup.getTitle());
            }
        }
    }

    public MeetupService getMeetupService() {
        return meetupService;
    }
}
