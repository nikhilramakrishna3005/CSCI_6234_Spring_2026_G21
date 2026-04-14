package micromeet.repository;

import java.util.ArrayList;
import java.util.List;
import micromeet.entity.ActivityType;
import micromeet.entity.Location;
import micromeet.entity.Meetup;
import micromeet.entity.Participation;
import micromeet.entity.ParticipationStatus;

public class MeetupRepository {
    private final List<Meetup> meetups;

    public MeetupRepository() {
        this.meetups = new ArrayList<>();
    }

    public List<Meetup> listMeetups() {
        return new ArrayList<>(meetups);
    }

    public Meetup loadMeetup(String meetupId) {
        if (meetupId == null) {
            return null;
        }
        for (Meetup meetup : meetups) {
            if (meetup != null && meetupId.equals(meetup.getMeetupId())) {
                return meetup;
            }
        }
        return null;
    }

    public void saveMeetup(Meetup meetup) {
        if (meetup == null || meetup.getMeetupId() == null) {
            return;
        }
        for (int i = 0; i < meetups.size(); i++) {
            Meetup existing = meetups.get(i);
            if (existing != null && meetup.getMeetupId().equals(existing.getMeetupId())) {
                meetups.set(i, meetup);
                return;
            }
        }
        meetups.add(meetup);
    }

    public List<Meetup> listMeetupsWithChanges() {
        return listMeetups();
    }

    public void seedSampleMeetups() {
        if (!meetups.isEmpty()) {
            return;
        }

        Location library = new Location("loc-1", "Main Library", 33.7756, -84.3963);
        List<Participation> studyParticipants = new ArrayList<>();
        studyParticipants.add(
                new Participation("part-1", "u-host-1", ParticipationStatus.ACCEPTED, "2026-04-14T09:00"));
        studyParticipants.add(
                new Participation("part-2", "u-user-1", ParticipationStatus.REQUESTED, "2026-04-14T09:30"));

        Meetup studyMeetup =
                new Meetup(
                        "meetup-1",
                        "Exam Prep Study Group",
                        ActivityType.STUDY,
                        "2026-04-15T18:00",
                        6,
                        "Review core topics together.",
                        "u-host-1",
                        library,
                        studyParticipants);

        Location coffeeShop = new Location("loc-2", "Campus Coffee Corner", 33.7765, -84.3981);
        List<Participation> coffeeParticipants = new ArrayList<>();
        coffeeParticipants.add(
                new Participation("part-3", "u-host-1", ParticipationStatus.ACCEPTED, "2026-04-14T10:00"));
        coffeeParticipants.add(
                new Participation("part-4", "u-user-2", ParticipationStatus.ACCEPTED, "2026-04-14T10:20"));

        Meetup coffeeMeetup =
                new Meetup(
                        "meetup-2",
                        "Morning Coffee Catch-up",
                        ActivityType.COFFEE,
                        "2026-04-16T08:30",
                        4,
                        "Quick coffee and networking.",
                        "u-host-1",
                        coffeeShop,
                        coffeeParticipants);

        meetups.add(studyMeetup);
        meetups.add(coffeeMeetup);
    }
}
