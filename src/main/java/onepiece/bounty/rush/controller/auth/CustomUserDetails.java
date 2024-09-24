package onepiece.bounty.rush.controller.auth;

import lombok.Data;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;

@Data
@ToString
public class CustomUserDetails implements UserDetails {

    private static final long serialVersionUID = -4608347932140057654L;
    private String username;
    private String password;
    private int level;
    private Collection<? extends GrantedAuthority> authorities;
    private boolean accountNonExpired = true;
    private boolean accountNonLocked = true;
    private boolean credentialsNonExpired = true;
    private boolean enabled = true;

}