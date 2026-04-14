package micromeet.ui;

import micromeet.entity.User;

public class ProfileView {
    public void showTitle() {
        System.out.println("=== Profile ===");
    }

    public void showError(String message) {
        System.out.println("[ERROR] " + message);
    }

    public void showSuccess(String message) {
        System.out.println("[SUCCESS] " + message);
    }

    public void displayProfile(User user) {
        if (user == null) {
            showError("Profile not found.");
            return;
        }
        System.out.println("User ID: " + user.getUserId());
        System.out.println("Name: " + user.getName());
        System.out.println("Email: " + user.getEmail());
        System.out.println("Availability: " + user.getAvailability());
        System.out.println("Preferences: " + user.getPreferences());
    }
}
