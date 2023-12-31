package com.keepreading.springbootlibrary.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import com.keepreading.springbootlibrary.entity.Book;
import com.keepreading.springbootlibrary.entity.Message;
import com.keepreading.springbootlibrary.entity.Review;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {
	
	private String theAllowedOrigin = "https://localhost:3000";
	
	@Override
	public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
		HttpMethod[] theUnsupportedActions = {
				HttpMethod.DELETE,
				HttpMethod.PATCH,
				HttpMethod.POST,
				HttpMethod.PUT
			};
		config.exposeIdsFor(Book.class);
		disableHTTPMethods(Book.class, config, theUnsupportedActions);
		
		config.exposeIdsFor(Review.class);
		disableHTTPMethods(Review.class, config, theUnsupportedActions);
		
		config.exposeIdsFor(Message.class);
		disableHTTPMethods(Message.class, config, theUnsupportedActions);
	
		/* CORS Mapping */
		
		cors.addMapping(config.getBasePath() + "/**")
			.allowedOrigins(theAllowedOrigin);
	}
	
	private void disableHTTPMethods(Class theClass, RepositoryRestConfiguration config, HttpMethod[] theUnsupportedAcitons) {
		
		config.getExposureConfiguration()
			.forDomainType(theClass)
			.withItemExposure((metadata,httpMethods) -> httpMethods.disable(theUnsupportedAcitons))
			.withCollectionExposure((metadata,httpMethods) -> httpMethods.disable(theUnsupportedAcitons));
	}
	

}
