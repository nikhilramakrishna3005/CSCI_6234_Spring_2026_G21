package micromeet.gui;

import java.awt.BorderLayout;
import java.awt.Frame;
import java.util.ArrayList;
import java.util.List;
import javax.swing.DefaultListModel;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JList;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.ListSelectionModel;
import javax.swing.SwingUtilities;
import micromeet.entity.Meetup;
import micromeet.service.MeetupService;

public class MeetupListPanel extends JPanel {
    private final MeetupService meetupService;
    private final JLabel titleLabel;
    private final DefaultListModel<String> meetupListModel;
    private final JList<String> meetupList;
    private final List<Meetup> meetupItems;

    public MeetupListPanel(MeetupService meetupService) {
        this.meetupService = meetupService;
        this.meetupItems = new ArrayList<>();
        setLayout(new BorderLayout(10, 10));
        titleLabel = new JLabel("All Meetups");
        meetupListModel = new DefaultListModel<>();
        meetupList = new JList<>(meetupListModel);
        meetupList.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);

        JButton refreshButton = new JButton("Refresh");
        refreshButton.addActionListener(e -> refreshMeetups());

        JPanel topPanel = new JPanel(new BorderLayout());
        topPanel.add(titleLabel, BorderLayout.WEST);
        topPanel.add(refreshButton, BorderLayout.EAST);

        add(topPanel, BorderLayout.NORTH);
        add(new JScrollPane(meetupList), BorderLayout.CENTER);
        meetupList.addListSelectionListener(
                e -> {
                    if (!e.getValueIsAdjusting()) {
                        openSelectedMeetupDetails();
                    }
                });

        refreshMeetups();
    }

    public void setMeetups(List<Meetup> meetups) {
        meetupListModel.clear();
        meetupItems.clear();
        if (meetups == null || meetups.isEmpty()) {
            titleLabel.setText("All Meetups (0)");
            return;
        }

        for (Meetup meetup : meetups) {
            if (meetup != null) {
                meetupItems.add(meetup);
                meetupListModel.addElement(buildMeetupLine(meetup));
            }
        }
        titleLabel.setText("All Meetups (" + meetupItems.size() + ")");
    }

    public void refreshMeetups() {
        setMeetups(meetupService.getActiveUpcoming());
    }

    private void openSelectedMeetupDetails() {
        int index = meetupList.getSelectedIndex();
        if (index < 0 || index >= meetupItems.size()) {
            return;
        }
        Meetup selectedMeetup = meetupItems.get(index);
        MeetupDetailPanel detailPanel = new MeetupDetailPanel(meetupService);
        detailPanel.showMeetup(selectedMeetup);

        Frame owner = (Frame) SwingUtilities.getWindowAncestor(this);
        JDialog dialog = new JDialog(owner, "Meetup Details", true);
        dialog.setDefaultCloseOperation(JDialog.DISPOSE_ON_CLOSE);
        dialog.add(detailPanel);
        dialog.setSize(560, 340);
        dialog.setLocationRelativeTo(this);
        dialog.setVisible(true);
    }

    private String buildMeetupLine(Meetup meetup) {
        return meetup.getMeetupId()
                + " | "
                + meetup.getTitle()
                + " | "
                + meetup.getActivityType()
                + " | "
                + meetup.getTime();
    }

    public MeetupService getMeetupService() {
        return meetupService;
    }
}
