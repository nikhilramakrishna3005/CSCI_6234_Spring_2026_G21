package micromeet.ui;

import micromeet.entity.Meetup;

public class MeetupDetailView {
    public void showTitle() {
        System.out.println();
        System.out.println("==== Meetup Details ====");
    }

    public void showError(String message) {
        System.out.println("[ERROR] " + message);
    }

    public void showSuccess(String message) {
        System.out.println("[SUCCESS] " + message);
    }

    public void displayMeetupDetails(Meetup meetup) {
        if (meetup == null) {
            System.out.println("No meetup details available.");
            return;
        }

        System.out.println("Meetup ID   : " + meetup.getMeetupId());
        System.out.println("Title       : " + meetup.getTitle());
        System.out.println("Activity    : " + meetup.getActivityType());
        System.out.println("Time        : " + meetup.getTime());
        System.out.println("Capacity    : " + meetup.getCapacity());
        System.out.println("Description : " + meetup.getDescription());
        System.out.println("Host User   : " + meetup.getHostUserId());
        if (meetup.getLocation() != null) {
            System.out.println("Location    : " + meetup.getLocation().getLabel());
        }
        System.out.println("Participants: " + meetup.getParticipants().size());
    }
}
