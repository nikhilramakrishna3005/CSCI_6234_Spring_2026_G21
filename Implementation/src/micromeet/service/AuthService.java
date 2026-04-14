package micromeet.service;

import micromeet.entity.Credentials;
import micromeet.entity.User;
import micromeet.repository.UserRepository;

public class AuthService {
    private final UserRepository userRepository;
    private final Credentials credentialsValidator;

    public AuthService() {
        this(new UserRepository());
        this.userRepository.seedSampleUsers();
    }

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.credentialsValidator = new Credentials();
    }

    public User authenticate(String username, String password) {
        if (!credentialsValidator.validateFormat(username, password)) {
            return null;
        }

        User user = userRepository.findUser(username);
        if (user == null) {
            return null;
        }

        return user.verifyPassword(password) ? user : null;
    }
}
