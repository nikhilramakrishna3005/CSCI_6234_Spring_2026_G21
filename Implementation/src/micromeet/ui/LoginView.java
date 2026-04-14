package micromeet.ui;

import micromeet.entity.User;

public class LoginView {
    public void showTitle() {
        System.out.println();
        System.out.println("=== Login ===");
    }

    public void showError(String message) {
        System.out.println("[ERROR] " + message);
    }

    public void showSuccess(String message) {
        System.out.println("[SUCCESS] " + message);
    }

    public void displayProfile(User user) {
        if (user == null) {
            System.out.println("No user to display.");
            return;
        }
        System.out.println("Logged in user: " + user.getName() + " (" + user.getEmail() + ")");
    }
}
