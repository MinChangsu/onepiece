package onepiece.bounty.rush.controller.auth;


import onepiece.bounty.rush.oauth2.config.Const;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(
    value = {"/api/auth"},
    produces = MediaType.APPLICATION_JSON_VALUE
)
@Validated
public class Admin {

    @Autowired
    private TokenStore tokenStore;

    @RequestMapping(method = RequestMethod.GET, path = "/tokens")
    @ResponseStatus(HttpStatus.OK)
    @Secured({"USER"})
    public List<String> findAllTokens() {
        final Collection<OAuth2AccessToken> tokensByClientId = tokenStore.findTokensByClientId(Const.CLIENT_ID);

        return tokensByClientId
            .stream()
            .map(token -> token.getValue())
            .collect(Collectors.toList());
    }
}
