package micromeet;

import java.util.List;
import java.util.Scanner;
import micromeet.entity.Meetup;
import micromeet.entity.User;
import micromeet.repository.MeetupRepository;
import micromeet.repository.UserRepository;
import micromeet.service.AuthService;
import micromeet.service.MeetupService;
import micromeet.service.NotificationService;
import micromeet.service.ProfileService;
import micromeet.ui.CreateMeetupView;
import micromeet.ui.EditMeetupView;
import micromeet.ui.JoinResponseView;
import micromeet.ui.LoginView;
import micromeet.ui.ManageParticipantsView;
import micromeet.ui.MeetupDetailView;
import micromeet.ui.MeetupListView;
import micromeet.ui.ProfileView;

public class Main {
    private final Scanner scanner;

    private final UserRepository userRepository;
    private final MeetupRepository meetupRepository;

    private final AuthService authService;
    private final ProfileService profileService;
    private final NotificationService notificationService;
    private final MeetupService meetupService;

    private final LoginView loginView;
    private final ProfileView profileView;
    private final MeetupListView meetupListView;
    private final MeetupDetailView meetupDetailView;
    private final CreateMeetupView createMeetupView;
    private final EditMeetupView editMeetupView;
    private final ManageParticipantsView manageParticipantsView;
    private final JoinResponseView joinResponseView;

    private User currentUser;

    public Main() {
        this.scanner = new Scanner(System.in);

        this.userRepository = new UserRepository();
        this.userRepository.seedSampleUsers();

        this.meetupRepository = new MeetupRepository();
        this.meetupRepository.seedSampleMeetups();

        this.notificationService = new NotificationService();
        this.authService = new AuthService(userRepository);
        this.profileService = new ProfileService(userRepository);
        this.meetupService = new MeetupService(meetupRepository, userRepository, notificationService);

        this.loginView = new LoginView();
        this.profileView = new ProfileView();
        this.meetupListView = new MeetupListView();
        this.meetupDetailView = new MeetupDetailView();
        this.createMeetupView = new CreateMeetupView();
        this.editMeetupView = new EditMeetupView();
        this.manageParticipantsView = new ManageParticipantsView();
        this.joinResponseView = new JoinResponseView();
    }

    public static void main(String[] args) {
        Main app = new Main();
        app.run();
    }

    private void run() {
        printBanner();
        System.out.println("Please log in to continue.");

        while (currentUser == null) {
            if (!handleAuthentication()) {
                System.out.println("Exiting application.");
                scanner.close();
                return;
            }
        }

        boolean running = true;
        while (running) {
            printMainMenu();
            String choice = prompt("Select option: ");

            switch (choice) {
                case "1":
                    handleAuthentication();
                    break;
                case "2":
                    handleManageProfileAndPreferences();
                    break;
                case "3":
                    handleViewActiveUpcomingMeetups();
                    break;
                case "4":
                    handleViewMeetupDetails();
                    break;
                case "5":
                    handleCreateMeetup();
                    break;
                case "6":
                    handleEditMeetup();
                    break;
                case "7":
                    handleManageParticipants();
                    break;
                case "8":
                    handleJoinResponse();
                    break;
                case "9":
                    handleSendUpdateNotifications();
                    break;
                case "0":
                    running = false;
                    System.out.println("\nThank you for using MicroMeet. Goodbye!");
                    break;
                default:
                    System.out.println("[ERROR] Invalid option. Please choose 0-9.");
                    break;
            }
        }

        scanner.close();
    }

    private boolean handleAuthentication() {
        loginView.showTitle();
        String username = prompt("Username (or type 'exit' to quit): ");
        if ("exit".equalsIgnoreCase(username)) {
            return false;
        }
        String password = prompt("Password: ");

        User authenticated = authService.authenticate(username, password);
        if (authenticated == null) {
            loginView.showError("Authentication failed. Try again.");
            return true;
        }

        currentUser = authenticated;
        loginView.showSuccess("Authentication successful.");
        loginView.displayProfile(currentUser);
        return true;
    }

    private void handleManageProfileAndPreferences() {
        profileView.showTitle();
        System.out.println("1) Update Name/Email");
        System.out.println("2) Update/Add Preference");
        System.out.println("3) View Profile");
        String subChoice = prompt("Choose action: ");

        switch (subChoice) {
            case "1":
                String name = prompt("New name: ");
                String email = prompt("New email: ");
                User updatedProfile = profileService.updateProfile(currentUser.getUserId(), name, email);
                if (updatedProfile == null) {
                    profileView.showError("Could not update profile.");
                } else {
                    currentUser = updatedProfile;
                    profileView.showSuccess("Profile updated.");
                    profileView.displayProfile(updatedProfile);
                }
                break;
            case "2":
                String key = prompt("Preference key: ");
                String value = prompt("Preference value: ");
                User updatedPreference = profileService.updatePreference(currentUser.getUserId(), key, value);
                if (updatedPreference == null) {
                    profileView.showError("Could not update preference.");
                } else {
                    currentUser = updatedPreference;
                    profileView.showSuccess("Preference updated.");
                    profileView.displayProfile(updatedPreference);
                }
                break;
            case "3":
                User profile = profileService.getUserProfile(currentUser.getUserId());
                profileView.displayProfile(profile);
                break;
            default:
                profileView.showError("Invalid profile option.");
                break;
        }
        printDivider();
    }

    private void handleViewActiveUpcomingMeetups() {
        meetupListView.showTitle();
        List<Meetup> meetups = meetupService.getActiveUpcoming();
        meetupListView.displayMeetups(meetups);
        meetupListView.showSuccess("Displayed " + meetups.size() + " meetup(s).");
        printDivider();
    }

    private void handleViewMeetupDetails() {
        meetupDetailView.showTitle();
        String meetupId = prompt("Enter meetup ID: ");
        Meetup meetup = meetupService.getMeetupDetails(meetupId);
        if (meetup == null) {
            meetupDetailView.showError("Meetup not found.");
            return;
        }
        meetupDetailView.displayMeetupDetails(meetup);
        printDivider();
    }

    private void handleCreateMeetup() {
        createMeetupView.showTitle();

        String title = prompt("Title: ");
        String activityType = prompt("Activity type (STUDY/GYM/FOOD/SPORTS/COFFEE): ");
        String time = prompt("Time (string): ");
        int capacity = promptInt("Capacity: ");
        String description = prompt("Description: ");
        String locationLabel = prompt("Location label: ");

        Meetup meetup =
                meetupService.createMeetup(
                        currentUser.getUserId(),
                        title,
                        activityType,
                        time,
                        capacity,
                        description,
                        locationLabel);

        if (meetup == null) {
            createMeetupView.showError("Failed to create meetup.");
            return;
        }

        createMeetupView.showSuccess("Meetup created.");
        createMeetupView.displayMeetupDetails(meetup);
        printDivider();
    }

    private void handleEditMeetup() {
        editMeetupView.showTitle();

        String meetupId = prompt("Meetup ID to edit: ");
        String title = prompt("New title: ");
        String time = prompt("New time (string): ");
        int capacity = promptInt("New capacity: ");
        String description = prompt("New description: ");

        Meetup updated = meetupService.editMeetup(meetupId, title, time, capacity, description);
        if (updated == null) {
            editMeetupView.showError("Meetup not found.");
            return;
        }

        editMeetupView.showSuccess("Meetup updated.");
        editMeetupView.displayMeetupDetails(updated);
        printDivider();
    }

    private void handleManageParticipants() {
        manageParticipantsView.showTitle();

        String meetupId = prompt("Meetup ID: ");
        String userId = prompt("User ID: ");
        String action = prompt("Action (INVITE/APPROVE): ");

        Meetup meetup = meetupService.manageParticipants(meetupId, userId, action);
        if (meetup == null) {
            manageParticipantsView.showError("Could not manage participants.");
            return;
        }

        manageParticipantsView.showSuccess("Participant action completed.");
        meetupDetailView.showTitle();
        meetupDetailView.displayMeetupDetails(meetup);
        printDivider();
    }

    private void handleJoinResponse() {
        joinResponseView.showTitle();

        String meetupId = prompt("Meetup ID: ");
        String choice = prompt("Choice (ACCEPT/DECLINE): ");

        Meetup meetup = meetupService.updateParticipation(meetupId, currentUser.getUserId(), choice);
        if (meetup == null) {
            joinResponseView.showError("Could not process join response.");
            return;
        }

        joinResponseView.showSuccess("Join response processed.");
        joinResponseView.displayMeetupDetails(meetup);
        printDivider();
    }

    private void handleSendUpdateNotifications() {
        System.out.println();
        System.out.println("=======================================");
        System.out.println("9) SEND UPDATE NOTIFICATIONS");
        System.out.println("=======================================");
        String meetupId = prompt("Meetup ID: ");
        String message = prompt("Update message: ");

        notificationService.notifyParticipants(meetupId, message);
        int total = notificationService.processPendingUpdates();
        System.out.println("[SUCCESS] Update notification sent.");
        System.out.println("Total notifications currently stored: " + total);
        printDivider();
    }

    private void printMainMenu() {
        System.out.println();
        System.out.println("=======================================");
        System.out.println("MICROMEET MAIN MENU");
        System.out.println("=======================================");
        if (currentUser != null) {
            System.out.println(
                    "Logged in as: "
                            + currentUser.getName()
                            + " ("
                            + currentUser.getUserId()
                            + ")");
        }
        System.out.println("1. Authenticate User");
        System.out.println("2. Manage Profile & Preferences");
        System.out.println("3. View Active / Upcoming Meetups");
        System.out.println("4. View Meetup Details");
        System.out.println("5. Create Meetup");
        System.out.println("6. Edit Meetup");
        System.out.println("7. Invite / Approve Participants");
        System.out.println("8. Respond to Join Request");
        System.out.println("9. Send Update Notifications");
        System.out.println("0. Exit");
        System.out.println("---------------------------------------");
    }

    private String prompt(String text) {
        System.out.print(text);
        return scanner.nextLine().trim();
    }

    private int promptInt(String text) {
        while (true) {
            String value = prompt(text);
            try {
                return Integer.parseInt(value);
            } catch (NumberFormatException ex) {
                System.out.println("[ERROR] Please enter a valid number.");
            }
        }
    }

    private void printBanner() {
        System.out.println();
        System.out.println("=======================================");
        System.out.println("      WELCOME TO MICROMEET APP");
        System.out.println("=======================================");
        System.out.println("Demo accounts: host1/pass123, user1/pass123, user2/pass123");
        System.out.println("---------------------------------------");
    }

    private void printDivider() {
        System.out.println("---------------------------------------");
    }
}
