package micromeet.entity;

import java.util.ArrayList;
import java.util.List;

public class Meetup {
    private String meetupId;
    private String title;
    private ActivityType activityType;
    private String time;
    private int capacity;
    private String description;
    private String hostUserId;
    private Location location;
    private List<Participation> participants;

    public Meetup() {
        this.participants = new ArrayList<>();
    }

    public Meetup(
            String meetupId,
            String title,
            ActivityType activityType,
            String time,
            int capacity,
            String description,
            String hostUserId,
            Location location,
            List<Participation> participants) {
        this.meetupId = meetupId;
        this.title = title;
        this.activityType = activityType;
        this.time = time;
        this.capacity = capacity;
        this.description = description;
        this.hostUserId = hostUserId;
        this.location = location;
        this.participants = participants != null ? participants : new ArrayList<>();
    }

    public String getMeetupId() {
        return meetupId;
    }

    public void setMeetupId(String meetupId) {
        this.meetupId = meetupId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public ActivityType getActivityType() {
        return activityType;
    }

    public void setActivityType(ActivityType activityType) {
        this.activityType = activityType;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getHostUserId() {
        return hostUserId;
    }

    public void setHostUserId(String hostUserId) {
        this.hostUserId = hostUserId;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public List<Participation> getParticipants() {
        return participants;
    }

    public void setParticipants(List<Participation> participants) {
        this.participants = participants != null ? participants : new ArrayList<>();
    }

    public void applyUpdates(String title, String time, int capacity, String description) {
        this.title = title;
        this.time = time;
        this.capacity = capacity;
        this.description = description;
    }

    public boolean isFull() {
        return getAcceptedParticipantsCount() >= capacity;
    }

    public void addParticipation(Participation participation) {
        if (participation == null) {
            return;
        }
        if (participants == null) {
            participants = new ArrayList<>();
        }
        participants.add(participation);
    }

    public Participation findParticipationByUserId(String userId) {
        if (userId == null || participants == null) {
            return null;
        }
        for (Participation participation : participants) {
            if (participation != null && userId.equals(participation.getUserId())) {
                return participation;
            }
        }
        return null;
    }

    public int getAcceptedParticipantsCount() {
        if (participants == null) {
            return 0;
        }
        int count = 0;
        for (Participation participation : participants) {
            if (participation != null
                    && ParticipationStatus.ACCEPTED.equals(participation.getStatus())) {
                count++;
            }
        }
        return count;
    }

    @Override
    public String toString() {
        return "Meetup{"
                + "meetupId='"
                + meetupId
                + '\''
                + ", title='"
                + title
                + '\''
                + ", activityType="
                + activityType
                + ", time='"
                + time
                + '\''
                + ", capacity="
                + capacity
                + ", hostUserId='"
                + hostUserId
                + '\''
                + '}';
    }
}
