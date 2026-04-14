package micromeet.entity;

public class Preference {
    private String preferenceId;
    private String key;
    private String value;

    public Preference() {
    }

    public Preference(String preferenceId, String key, String value) {
        this.preferenceId = preferenceId;
        this.key = key;
        this.value = value;
    }

    public String getPreferenceId() {
        return preferenceId;
    }

    public void setPreferenceId(String preferenceId) {
        this.preferenceId = preferenceId;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public void updateValue(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return "Preference{"
            + "preferenceId='" + preferenceId + '\''
            + ", key='" + key + '\''
            + ", value='" + value + '\''
            + '}';
    }
}
