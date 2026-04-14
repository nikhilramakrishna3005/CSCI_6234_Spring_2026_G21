package micromeet.ui;

import java.util.List;
import micromeet.entity.Meetup;

public class MeetupListView {
    public void showTitle() {
        System.out.println();
        System.out.println("=========================================");
        System.out.println("     3) VIEW ACTIVE / UPCOMING MEETUPS");
        System.out.println("=========================================");
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

        System.out.println("ID        | TITLE                      | ACTIVITY | TIME");
        System.out.println("--------------------------------------------------------------");
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
