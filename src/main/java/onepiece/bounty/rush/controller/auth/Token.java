package onepiece.bounty.rush.controller.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.security.oauth2.provider.token.DefaultTokenServices;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
    value = {"/api/oauth"},
    produces = MediaType.APPLICATION_JSON_VALUE
)
@Validated
public class Token {

    private final DefaultTokenServices tokenServices;

    @Autowired
    public Token(DefaultTokenServices tokenServices) {
        this.tokenServices = tokenServices;
    }

    @RequestMapping(method = RequestMethod.DELETE, path = "/revoke")
    @ResponseStatus(HttpStatus.OK)
    public void revokeToken(Authentication authentication) {
        final String userToken = ((OAuth2AuthenticationDetails) authentication.getDetails()).getTokenValue();
        tokenServices.revokeToken(userToken);
    }

    /*
    @RequestMapping(method = RequestMethod.POST, path = "/clientId")
    public String getClientId(Authentication authentication) {
        // final String userToken = ((OAuth2AuthenticationDetails) authentication.getDetails()).getTokenValue();
        String clientId = tokenServices.getClientId("1e9dbbd11e3d9332cbb1ead03d8688bd");
        System.out.println(clientId);
        return clientId;
    }
    */

}
