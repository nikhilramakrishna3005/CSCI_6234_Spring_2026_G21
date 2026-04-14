package micromeet.ui;

public class ManageParticipantsView {
    public void showTitle() {
        System.out.println("\n=== Manage Participants ===");
    }

    public void showError(String message) {
        System.out.println("[ERROR] " + message);
    }

    public void showSuccess(String message) {
        System.out.println("[SUCCESS] " + message);
    }
}
