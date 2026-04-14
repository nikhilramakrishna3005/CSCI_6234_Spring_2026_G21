package micromeet.entity;

public class Credentials {
    private String username;
    private String passwordHash;

    public Credentials() {
    }

    public Credentials(String username, String passwordHash) {
        this.username = username;
        this.passwordHash = passwordHash;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public boolean validateFormat(String username, String password) {
        return username != null
                && !username.trim().isEmpty()
                && password != null
                && !password.trim().isEmpty();
    }

    public boolean matches(String password) {
        return passwordHash != null && passwordHash.equals(password);
    }

    @Override
    public String toString() {
        return "Credentials{"
                + "username='" + username + '\''
                + '}';
    }
}
