package onepiece.bounty.rush.oauth2.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableResourceServer
public class ResourceServerConfig extends ResourceServerConfigurerAdapter {

    private static final String RESOURCE_ID = "resource_id";

    @Override
    public void configure(ResourceServerSecurityConfigurer resources) {
        resources.resourceId(RESOURCE_ID).stateless(false);
    }

    @Override
    public void configure(HttpSecurity http) throws Exception {

        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedMethod("*");
        configuration.addAllowedOriginPattern("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        http.authorizeRequests()
            .antMatchers(HttpMethod.GET, "/", "/index.html", "/assets/**", "/static/**", "/*.json", "/*.js", "/*.ico").permitAll()
            .antMatchers("/oauth/**", "/api/login", "/api/auth").permitAll()
            .antMatchers("/**").permitAll()
            .antMatchers("/attach/**", "/*.json", "/api/**").hasRole("USER")
            .antMatchers("/attach/**", "/*.json", "/api/**", "/sys/**").hasRole("ADMIN")
            .anyRequest().authenticated();

        http.cors().configurationSource(source);
    }
}
