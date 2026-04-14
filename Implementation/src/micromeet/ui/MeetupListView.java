package micromeet.ui;

import java.util.List;
import micromeet.entity.Meetup;

public class MeetupListView {
    public void showTitle() {
        System.out.println();
        System.out.println("=== Meetup List ===");
    }

    public void showError(String message) {
        System.out.println("[ERROR] " + message);
    }

    public void showSuccess(String message) {
        System.out.println("[SUCCESS] " + message);
    }

    public void displayMeetups(List<Meetup> meetups) {
        if (meetups == null || meetups.isEmpty()) {
            System.out.println("No meetups available.");
            return;
        }

        for (Meetup meetup : meetups) {
            if (meetup != null) {
                System.out.println(
                        "- "
                                + meetup.getMeetupId()
                                + " | "
                                + meetup.getTitle()
                                + " | "
                                + meetup.getActivityType()
                                + " | "
                                + meetup.getTime());
            }
        }
    }
}
