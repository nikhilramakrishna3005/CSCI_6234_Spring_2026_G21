package micromeet.ui;

import micromeet.entity.Meetup;

public class JoinResponseView {
    public void showTitle() {
        System.out.println();
        System.out.println("========================================");
        System.out.println("        JOIN REQUEST RESPONSE");
        System.out.println("========================================");
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
        System.out.println("Meetup : " + meetup.getTitle() + " (" + meetup.getMeetupId() + ")");
        System.out.println("Status : Response recorded successfully.");
    }
}
