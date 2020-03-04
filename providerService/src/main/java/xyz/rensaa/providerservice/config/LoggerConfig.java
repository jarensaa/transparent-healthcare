package xyz.rensaa.providerservice.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InjectionPoint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import xyz.rensaa.providerservice.repository.KeyAuthorizationRepository;

@Configuration
public class LoggerConfig {

  @Autowired
  KeyAuthorizationRepository keyAuthorizationRepository;

  @Bean
  public Logger produceLogger(InjectionPoint injectionPoint) {
    var classOnWired = injectionPoint.getMember().getDeclaringClass();
    return LoggerFactory.getLogger(classOnWired);
  }
}
