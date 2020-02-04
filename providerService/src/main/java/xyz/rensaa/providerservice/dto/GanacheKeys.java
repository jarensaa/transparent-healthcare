package xyz.rensaa.providerservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;


@JsonIgnoreProperties(ignoreUnknown = true)
public class GanacheKeys {

  @JsonProperty("private_keys")
  private Map<String, String> privateKeys;

  public Map<String, String> getPrivateKeys() {
    return privateKeys;
  }

  public void setPrivateKeys(Map<String, String> privateKeys) {
    this.privateKeys = privateKeys;
  }
}
