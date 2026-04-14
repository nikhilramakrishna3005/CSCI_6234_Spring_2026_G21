package micromeet;

import micromeet.entity.Meetup;
import micromeet.entity.User;
import micromeet.repository.MeetupRepository;
import micromeet.repository.UserRepository;

public class Main {
    public static void main(String[] args) {
        // Test repositories
        UserRepository userRepo = new UserRepository();
        userRepo.seedSampleUsers();

        MeetupRepository meetupRepo = new MeetupRepository();
        meetupRepo.seedSampleMeetups();

        // Print users
        System.out.println("Users:");
        for (User u : userRepo.getAllUsers()) {
            System.out.println(u);
        }

        // Print meetups
        System.out.println("\nMeetups:");
        for (Meetup m : meetupRepo.listMeetups()) {
            System.out.println(m);
        }
    }
}
