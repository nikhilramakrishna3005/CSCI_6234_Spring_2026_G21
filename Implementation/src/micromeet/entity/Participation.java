package micromeet.entity;

public class Participation {
    private String participationId;
    private String userId;
    private ParticipationStatus status;
    private String joinedAt;

    public Participation() {
    }

    public Participation(String participationId, String userId, ParticipationStatus status, String joinedAt) {
        this.participationId = participationId;
        this.userId = userId;
        this.status = status;
        this.joinedAt = joinedAt;
    }

    public String getParticipationId() {
        return participationId;
    }

    public void setParticipationId(String participationId) {
        this.participationId = participationId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public ParticipationStatus getStatus() {
        return status;
    }

    public String getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(String joinedAt) {
        this.joinedAt = joinedAt;
    }

    public void setStatus(ParticipationStatus status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "Participation{"
                + "participationId='" + participationId + '\''
                + ", userId='" + userId + '\''
                + ", status=" + status
                + ", joinedAt='" + joinedAt + '\''
                + '}';
    }
}
