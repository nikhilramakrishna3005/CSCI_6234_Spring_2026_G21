package micromeet.ui;

import micromeet.entity.User;

public class LoginView {
    public void showTitle() {
        System.out.println();
        System.out.println("====================================");
        System.out.println("          AUTHENTICATE USER         ");
        System.out.println("====================================");
    }

    public void showError(String message) {
        System.out.println("[ERROR] " + message);
    }

    public void showSuccess(String message) {
        System.out.println("[SUCCESS] " + message);
    }

    public void displayProfile(User user) {
        if (user == null) {
            showError("No user to display.");
            return;
        }
        System.out.println("Logged in as:");
        System.out.println(" - User ID : " + user.getUserId());
        System.out.println(" - Name    : " + user.getName());
        System.out.println(" - Email   : " + user.getEmail());
    }
}
