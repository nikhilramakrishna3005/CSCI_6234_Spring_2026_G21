package micromeet.repository;

import java.util.ArrayList;
import java.util.List;

import micromeet.entity.AvailabilityStatus;
import micromeet.entity.Credentials;
import micromeet.entity.Preference;
import micromeet.entity.User;

public class UserRepository {
    private final List<User> users;

    public UserRepository() {
        this.users = new ArrayList<>();
    }

    public User findUser(String username) {
        if (username == null) {
            return null;
        }
        for (User user : users) {
            if (user != null
                    && user.getCredentials() != null
                    && username.equals(user.getCredentials().getUsername())) {
                return user;
            }
        }
        return null;
    }

    public User loadUser(String userId) {
        if (userId == null) {
            return null;
        }
        for (User user : users) {
            if (user != null && userId.equals(user.getUserId())) {
                return user;
            }
        }
        return null;
    }

    public void saveUser(User user) {
        if (user == null) {
            return;
        }
        User existing = loadUser(user.getUserId());
        if (existing != null) {
            int index = users.indexOf(existing);
            users.set(index, user);
            return;
        }
        users.add(user);
    }

    public List<User> getAllUsers() {
        return new ArrayList<>(users);
    }

    public void seedSampleUsers() {
        if (!users.isEmpty()) {
            return;
        }

        User host = new User(
                "u-host-1",
                "Host One",
                "host1@micromeet.local",
                AvailabilityStatus.ONLINE,
                new Credentials("host1", "pass123"),
                new ArrayList<>());
        host.addPreference(new Preference("pref-host-1", "activity", "COFFEE"));

        User user1 = new User(
                "u-user-1",
                "User One",
                "user1@micromeet.local",
                AvailabilityStatus.ONLINE,
                new Credentials("user1", "pass123"),
                new ArrayList<>());
        user1.addPreference(new Preference("pref-user-1", "activity", "STUDY"));

        User user2 = new User(
                "u-user-2",
                "User Two",
                "user2@micromeet.local",
                AvailabilityStatus.OFFLINE,
                new Credentials("user2", "pass123"),
                new ArrayList<>());
        user2.addPreference(new Preference("pref-user-2", "activity", "GYM"));

        users.add(host);
        users.add(user1);
        users.add(user2);
    }
}
