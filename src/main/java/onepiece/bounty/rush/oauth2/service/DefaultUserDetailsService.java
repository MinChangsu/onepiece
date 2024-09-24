package onepiece.bounty.rush.oauth2.service;


import onepiece.bounty.rush.controller.auth.CustomUserDetails;
import onepiece.bounty.rush.domain.USRDomain;
import onepiece.bounty.rush.repository.USRRepo;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import javax.servlet.http.HttpSession;
import java.util.Collections;

public class DefaultUserDetailsService implements UserDetailsService {

    private final USRRepo usrRepo;

    public DefaultUserDetailsService(USRRepo usrRepo) {
        this.usrRepo = usrRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {

        USRDomain usrDomain = null;
        try {
            usrDomain = usrRepo.SELECT_LOGIN_USR_WITH_ID(userId);
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (usrDomain != null) {
            try {

                CustomUserDetails user = new CustomUserDetails();
                user.setUsername(usrDomain.getUsrId());
                user.setPassword(passwordNoEncoding(usrDomain));
                user.setLevel(usrDomain.getLvl());
                user.setAuthorities(Collections.singletonList(new SimpleGrantedAuthority(String.valueOf(usrDomain.getAuthCode()))));
                return user;

                /*return new User(usrDomain.getUsrId(),
                        passwordNoEncoding(usrDomain),
                        Collections.singletonList(new SimpleGrantedAuthority(String.valueOf(usrDomain.getAuthCode()))));
*/
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
        return null;
    }

    private String passwordNoEncoding(USRDomain usrDomain) {
        // you can use one of bcrypt/noop/pbkdf2/scrypt/sha256
        // more: https://spring.io/blog/2017/11/01/spring-security-5-0-0-rc1-released#password-encoding
        return "{noop}" + usrDomain.getUsrPw();
//        return usrDomain.getUsrPw();

    }

    private String getUserNameFromToken(HttpSession session) {
        return "";
    }

}
