package xyz.rensaa.providerservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;

@Configuration
public class TimeConfig {

  @Bean
  public ZoneOffset zoneOffset() {
    return ZoneId.of("Europe/Oslo").getRules().getOffset(Instant.now());
  }
}
