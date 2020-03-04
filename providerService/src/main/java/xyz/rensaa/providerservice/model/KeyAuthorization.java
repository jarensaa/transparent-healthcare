package xyz.rensaa.providerservice.model;

import javax.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table()
public class KeyAuthorization {

  @Id
  private String userToken;

  private String address;

  private String privateKey;

  private OffsetDateTime creationTime;

  public KeyAuthorization() {
  }

  public KeyAuthorization(String userToken, String address, String privateKey, OffsetDateTime creationTime) {
    this.userToken = userToken;
    this.address = address;
    this.privateKey = privateKey;
    this.creationTime = creationTime;
  }

  public String getUserToken() {
    return userToken;
  }

  public void setUserToken(String userToken) {
    this.userToken = userToken;
  }

  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
  }

  public String getPrivateKey() {
    return privateKey;
  }

  public void setPrivateKey(String privateKey) {
    this.privateKey = privateKey;
  }

  public OffsetDateTime getCreationTime() {
    return creationTime;
  }

  public void setCreationTime(OffsetDateTime creationTime) {
    this.creationTime = creationTime;
  }
}
