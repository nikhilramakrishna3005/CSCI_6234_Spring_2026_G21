package micromeet.ui;

import micromeet.entity.Preference;
import micromeet.entity.User;

public class ProfileView {
    public void showTitle() {
        System.out.println();
        System.out.println("========================================");
        System.out.println("=== Profile ===");
        System.out.println("========================================");
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
        System.out.println("Preferences:");
        if (user.getPreferences() == null || user.getPreferences().isEmpty()) {
            System.out.println("  - None");
        } else {
            for (Preference preference : user.getPreferences()) {
                if (preference != null) {
                    System.out.println(
                            "  - " + preference.getKey() + " = " + preference.getValue());
                }
            }
        }
    }
}
