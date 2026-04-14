package micromeet.ui;

public class ManageParticipantsView {
    public void showTitle() {
        System.out.println();
        System.out.println("========================================");
        System.out.println("      Invite / Approve Participants     ");
        System.out.println("========================================");
    }

    public void showError(String message) {
        System.out.println("[X] ERROR: " + message);
    }

    public void showSuccess(String message) {
        System.out.println("[OK] SUCCESS: " + message);
    }
}
