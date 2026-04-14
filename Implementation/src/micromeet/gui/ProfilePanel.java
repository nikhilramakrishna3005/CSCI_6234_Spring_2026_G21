package micromeet.gui;

import javax.swing.BorderFactory;
import javax.swing.JLabel;
import javax.swing.JPanel;
import micromeet.service.ProfileService;

public class ProfilePanel extends JPanel {
    private final ProfileService profileService;

    public ProfilePanel(ProfileService profileService) {
        this.profileService = profileService;
        initializeUi();
    }

    private void initializeUi() {
        setBorder(BorderFactory.createTitledBorder("Profile"));
        add(new JLabel("Profile panel skeleton"));
    }

    public ProfileService getProfileService() {
        return profileService;
    }
}
