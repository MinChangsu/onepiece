package onepiece.bounty.rush;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.scheduling.annotation.EnableScheduling;
import java.util.TimeZone;
import java.util.concurrent.ExecutionException;


/*@Configuration
@EnableAutoConfiguration(exclude = {SecurityAutoConfiguration.class})
@EnableScheduling
@ComponentScan*/
@EnableScheduling
@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
public class Application extends SpringBootServletInitializer {

    private static Class<Application> applicationClass = Application.class;
    private static final Logger LOG =  LoggerFactory.getLogger(Application.class);

    public static void main(String[] args) throws ExecutionException, InterruptedException {

        // 자바 시스템 타임존 변경.
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));

        try {
            SpringApplication.run(Application.class, args);

        } catch (Exception ex) {
            //ex.printStackTrace();
            LOG.error("■■■■■■■■■■■■■■■ 애플리케이션 오류 : {}", ex.getStackTrace());
        }
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(applicationClass);
    }

}
