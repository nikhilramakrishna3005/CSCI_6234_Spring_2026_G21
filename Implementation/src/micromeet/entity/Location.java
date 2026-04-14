package micromeet.entity;

public class Location {
    private String locationId;
    private String label;
    private double latitude;
    private double longitude;

    public Location() {
    }

    public Location(String locationId, String label, double latitude, double longitude) {
        this.locationId = locationId;
        this.label = label;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public String getLocationId() {
        return locationId;
    }

    public void setLocationId(String locationId) {
        this.locationId = locationId;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public void updateFrom(String label, double latitude, double longitude) {
        this.label = label;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    @Override
    public String toString() {
        return "Location{"
            + "locationId='" + locationId + '\''
            + ", label='" + label + '\''
            + ", latitude=" + latitude
            + ", longitude=" + longitude
            + '}';
    }
}
