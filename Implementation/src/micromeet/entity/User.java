package micromeet.entity;

import java.util.ArrayList;
import java.util.List;

public class User {
    private String userId;
    private String name;
    private String email;
    private AvailabilityStatus availability;
    private Credentials credentials;
    private List<Preference> preferences;

    public User() {
        this.preferences = new ArrayList<>();
    }

    public User(String userId, String name, String email, AvailabilityStatus availability,
                Credentials credentials, List<Preference> preferences) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.availability = availability;
        this.credentials = credentials;
        this.preferences = preferences != null ? new ArrayList<>(preferences) : new ArrayList<>();
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public AvailabilityStatus getAvailability() {
        return availability;
    }

    public void setAvailability(AvailabilityStatus availability) {
        this.availability = availability;
    }

    public Credentials getCredentials() {
        return credentials;
    }

    public void setCredentials(Credentials credentials) {
        this.credentials = credentials;
    }

    public List<Preference> getPreferences() {
        return preferences;
    }

    public void setPreferences(List<Preference> preferences) {
        this.preferences = preferences != null ? new ArrayList<>(preferences) : new ArrayList<>();
    }

    public boolean verifyPassword(String password) {
        return credentials != null && credentials.matches(password);
    }

    public void addPreference(Preference preference) {
        if (preference != null) {
            preferences.add(preference);
        }
    }

    public void updateProfile(String name, String email) {
        this.name = name;
        this.email = email;
    }

    @Override
    public String toString() {
        return "User{"
            + "userId='" + userId + '\''
            + ", name='" + name + '\''
            + ", email='" + email + '\''
            + ", availability=" + availability
            + ", preferencesCount=" + (preferences == null ? 0 : preferences.size())
            + '}';
    }
}
