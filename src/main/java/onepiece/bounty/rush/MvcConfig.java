package onepiece.bounty.rush;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.servlet.config.annotation.*;

@EnableWebMvc
@Configuration
public class MvcConfig implements WebMvcConfigurer {

    private final String uploadImagePath;

    public MvcConfig(@Value("${custom.path.files}") String uploadImagePath) {
        this.uploadImagePath = uploadImagePath;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/assets/**").addResourceLocations("classpath:/templates/react/build/assets/");
        registry.addResourceHandler("/static/**").addResourceLocations("classpath:/templates/react/build/static/");
        registry.addResourceHandler("/*.js").addResourceLocations("classpath:/templates/react/build/");
        registry.addResourceHandler("/*.json").addResourceLocations("classpath:/templates/react/build/");
        registry.addResourceHandler("/*.ico").addResourceLocations("classpath:/templates/react/build/");
        registry.addResourceHandler("/index.html").addResourceLocations("classpath:/templates/react/build/index.html");

        // 기존 일괄 업로드 이미지 경로
        registry.addResourceHandler("/attach/files/**").addResourceLocations("file:///" + uploadImagePath + "files/");
        // 사용자 추가 업로드 이미지 경로
        registry.addResourceHandler("/attach/uploadFiles/**").addResourceLocations("file:///" + uploadImagePath + "uploadFiles/");
        registry.addResourceHandler("/attach/uploadCmnFiles/**").addResourceLocations("file:///" + uploadImagePath + "uploadCmnFiles/");
    }

    /*@Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedMethods("*").allowedOriginPatterns("*").allowCredentials(true);
    }*/

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedHeaders("*")
                .exposedHeaders(HttpHeaders.CONTENT_DISPOSITION) // 파일 다운을 위해서 추가함
                .allowedMethods("*");
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/index.html");
//        registry.addViewController("/history").setViewName("forward:/index.html");
//        registry.addViewController("/stat").setViewName("forward:/index.html");
//        registry.addViewController("/report").setViewName("forward:/index.html");

//        registry.addViewController("/{spring:\\w+}").setViewName("forward:/index.html");
//        registry.addViewController("/**/{spring:\\w+}").setViewName("forward:/index.html");
//        registry.addViewController("/{spring:\\w+}/**{spring:?!(\\.js|\\.css)$}").setViewName("forward:/index.html");
    }


}
