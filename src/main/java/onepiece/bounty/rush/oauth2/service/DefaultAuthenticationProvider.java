package onepiece.bounty.rush.oauth2.service;

import onepiece.bounty.rush.domain.USRDomain;
import onepiece.bounty.rush.repository.USRRepo;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Collections;

public class DefaultAuthenticationProvider implements AuthenticationProvider {

    private final USRRepo usrRepo;

    public DefaultAuthenticationProvider(USRRepo usrRepo) {
        this.usrRepo = usrRepo;
    }

    @Override
    public Authentication authenticate(final Authentication authentication) throws AuthenticationException {

        if (authentication.getName() == null || authentication.getCredentials() == null) {
            return null;
        }

        if (authentication.getName().isEmpty() || authentication.getCredentials().toString().isEmpty()) {
            return null;
        }

        USRDomain usrDomain = null;
        try {
            usrDomain = this.usrRepo.SELECT_LOGIN_USR_WITH_ID(authentication.getName());
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (usrDomain != null) {

            final String providedUserId = authentication.getName();
            final Object providedUserPassword = authentication.getCredentials();

            if (providedUserId.equalsIgnoreCase(usrDomain.getUsrId())
                    && providedUserPassword.equals(usrDomain.getUsrPw())) {
                return new UsernamePasswordAuthenticationToken(
                        usrDomain.getUsrId(),
                        usrDomain.getUsrPw(),
                        Collections.singleton(new SimpleGrantedAuthority(usrDomain.getAuthCode())));
            }
        }

        throw new UsernameNotFoundException("Invalid username or password.");
    }

    @Override
    public boolean supports(final Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
}
