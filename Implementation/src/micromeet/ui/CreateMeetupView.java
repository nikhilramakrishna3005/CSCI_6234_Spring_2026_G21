package micromeet.ui;

import micromeet.entity.Meetup;

public class CreateMeetupView {
    public void showTitle() {
        System.out.println();
        System.out.println("======================================");
        System.out.println("         CREATE NEW MEETUP");
        System.out.println("======================================");
    }

    public void showError(String message) {
        System.out.println("[ERROR] " + message);
    }

    public void showSuccess(String message) {
        System.out.println("[SUCCESS] " + message);
    }

    public void displayMeetupDetails(Meetup meetup) {
        if (meetup == null) {
            showError("Meetup not found.");
            return;
        }

        System.out.println("New meetup saved successfully:");
        System.out.println("  ID       : " + meetup.getMeetupId());
        System.out.println("  Title    : " + meetup.getTitle());
        System.out.println("  Activity : " + meetup.getActivityType());
        System.out.println("  Time     : " + meetup.getTime());
        System.out.println("  Capacity : " + meetup.getCapacity());
    }
}
