package micromeet.service;

import micromeet.entity.Preference;
import micromeet.entity.User;
import micromeet.repository.UserRepository;

public class ProfileService {
    private final UserRepository userRepository;

    public ProfileService() {
        this(new UserRepository());
        this.userRepository.seedSampleUsers();
    }

    public ProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User updateProfile(String userId, String newName, String newEmail) {
        User user = userRepository.loadUser(userId);
        if (user == null) {
            return null;
        }

        user.updateProfile(newName, newEmail);
        userRepository.saveUser(user);
        return user;
    }

    public User updatePreference(String userId, String key, String value) {
        User user = userRepository.loadUser(userId);
        if (user == null || key == null || key.trim().isEmpty()) {
            return null;
        }

        boolean updated = false;
        for (Preference preference : user.getPreferences()) {
            if (preference != null && key.equals(preference.getKey())) {
                preference.updateValue(value);
                updated = true;
                break;
            }
        }

        if (!updated) {
            String preferenceId = "pref-" + userId + "-" + (user.getPreferences().size() + 1);
            user.addPreference(new Preference(preferenceId, key, value));
        }

        userRepository.saveUser(user);
        return user;
    }

    public User getUserProfile(String userId) {
        return userRepository.loadUser(userId);
    }
}
