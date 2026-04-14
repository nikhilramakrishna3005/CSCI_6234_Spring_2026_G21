package micromeet.service;

import java.util.ArrayList;
import java.util.List;
import micromeet.entity.ActivityType;
import micromeet.entity.Location;
import micromeet.entity.Meetup;
import micromeet.entity.Participation;
import micromeet.entity.ParticipationStatus;
import micromeet.repository.MeetupRepository;
import micromeet.repository.UserRepository;

public class MeetupService {
    private final MeetupRepository meetupRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public MeetupService() {
        this(new MeetupRepository(), new UserRepository(), new NotificationService());
        this.userRepository.seedSampleUsers();
        this.meetupRepository.seedSampleMeetups();
    }

    public MeetupService(
            MeetupRepository meetupRepository,
            UserRepository userRepository,
            NotificationService notificationService) {
        this.meetupRepository = meetupRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public List<Meetup> getActiveUpcoming() {
        return meetupRepository.listMeetups();
    }

    public Meetup getMeetupDetails(String meetupId) {
        return meetupRepository.loadMeetup(meetupId);
    }

    public Meetup createMeetup(
            String hostId,
            String title,
            String activityType,
            String time,
            int capacity,
            String description,
            String locationLabel) {
        if (hostId == null || userRepository.loadUser(hostId) == null) {
            return null;
        }

        List<Meetup> existing = meetupRepository.listMeetups();
        String meetupId = "meetup-" + (existing.size() + 1);
        String locationId = "loc-" + (existing.size() + 1);
        Location location = new Location(locationId, locationLabel, 0.0, 0.0);

        List<Participation> participants = new ArrayList<>();
        participants.add(
                new Participation(
                        "part-" + meetupId + "-1",
                        hostId,
                        ParticipationStatus.ACCEPTED,
                        "now"));

        Meetup meetup =
                new Meetup(
                        meetupId,
                        title,
                        parseActivityType(activityType),
                        time,
                        capacity,
                        description,
                        hostId,
                        location,
                        participants);

        meetupRepository.saveMeetup(meetup);
        System.out.println("Meetup created: " + meetupId);
        return meetup;
    }

    public Meetup editMeetup(
            String meetupId, String title, String time, int capacity, String description) {
        Meetup meetup = meetupRepository.loadMeetup(meetupId);
        if (meetup == null) {
            return null;
        }

        meetup.applyUpdates(title, time, capacity, description);
        meetupRepository.saveMeetup(meetup);
        notificationService.notifyParticipants(meetupId, "Meetup updated: " + title);
        return meetup;
    }

    public Meetup manageParticipants(String meetupId, String userId, String action) {
        Meetup meetup = meetupRepository.loadMeetup(meetupId);
        if (meetup == null || userId == null || action == null) {
            return null;
        }

        Participation participation = meetup.findParticipationByUserId(userId);
        if ("INVITE".equalsIgnoreCase(action)) {
            if (participation == null) {
                participation =
                        new Participation(
                                "part-" + meetupId + "-" + (meetup.getParticipants().size() + 1),
                                userId,
                                ParticipationStatus.REQUESTED,
                                "now");
                meetup.addParticipation(participation);
            } else {
                participation.setStatus(ParticipationStatus.REQUESTED);
            }
            notificationService.sendInviteOrApproval(userId, "invite");
        } else if ("APPROVE".equalsIgnoreCase(action)) {
            if (participation == null) {
                participation =
                        new Participation(
                                "part-" + meetupId + "-" + (meetup.getParticipants().size() + 1),
                                userId,
                                ParticipationStatus.ACCEPTED,
                                "now");
                meetup.addParticipation(participation);
            } else {
                participation.setStatus(ParticipationStatus.ACCEPTED);
            }
            notificationService.sendInviteOrApproval(userId, "approval");
        } else {
            return meetup;
        }

        meetupRepository.saveMeetup(meetup);
        return meetup;
    }

    public Meetup updateParticipation(String meetupId, String userId, String choice) {
        Meetup meetup = meetupRepository.loadMeetup(meetupId);
        if (meetup == null || userId == null || choice == null) {
            return null;
        }

        Participation participation = meetup.findParticipationByUserId(userId);
        if (participation == null) {
            participation =
                    new Participation(
                            "part-" + meetupId + "-" + (meetup.getParticipants().size() + 1),
                            userId,
                            ParticipationStatus.REQUESTED,
                            "now");
            meetup.addParticipation(participation);
        }

        if ("ACCEPT".equalsIgnoreCase(choice)) {
            participation.setStatus(ParticipationStatus.ACCEPTED);
        } else if ("DECLINE".equalsIgnoreCase(choice)) {
            participation.setStatus(ParticipationStatus.DECLINED);
        } else {
            return meetup;
        }

        meetupRepository.saveMeetup(meetup);
        notificationService.notifyHostOrUser(meetupId, userId, choice);
        return meetup;
    }

    private ActivityType parseActivityType(String activityType) {
        if (activityType == null) {
            return ActivityType.COFFEE;
        }
        try {
            return ActivityType.valueOf(activityType.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            return ActivityType.COFFEE;
        }
    }
}
