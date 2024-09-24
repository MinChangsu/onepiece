package onepiece.bounty.rush;

import onepiece.bounty.rush.oauth2.service.DefaultUserDetailsService;
import onepiece.bounty.rush.repository.USRRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;

@Configuration
@EnableWebSecurity
//@Profile("!https")
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final USRRepo usrRepo;

    @Autowired
    public SecurityConfig(USRRepo usrRepo) {
        this.usrRepo = usrRepo;
    }

    @Override
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Autowired
    public void globalUserDetails(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(new DefaultUserDetailsService(usrRepo));
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http
            .httpBasic().disable()
            .csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
            .authorizeRequests()
                .antMatchers(HttpMethod.GET, "/", "/index.html", "/static/**", "/*.json", "/*.js", "/*.ico").permitAll()
                .antMatchers("/oauth/**", "/api/login").permitAll()
                .antMatchers("/api/**").hasRole("USER")
                .antMatchers("/api/**", "/sys/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            .and()
                .formLogin().loginPage("/index.html")
                    .loginProcessingUrl("/api/login")
                    .defaultSuccessUrl("/",true)
                    .failureUrl("/index.html?error=true")
            .and()
                .logout()
            .and()
                .exceptionHandling().accessDeniedPage("/403");

        http.cors();
    }
}
