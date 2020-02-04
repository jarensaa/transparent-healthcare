package xyz.rensaa.providerservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ContractAddresses {

  @JsonProperty("authority")
  private String authorityAddress;

  @JsonProperty("treatmentProvider")
  private String treatmentProviderAddress;

  @JsonProperty("licenseProvider")
  private String licenseProviderAddress;

  @JsonProperty("treatment")
  private String treatmentAddress;

  @JsonProperty("measure")
  private String measureAddress;

  public String getAuthorityAddress() {
    return authorityAddress;
  }

  public void setAuthorityAddress(String authorityAddress) {
    this.authorityAddress = authorityAddress;
  }

  public String getTreatmentProviderAddress() {
    return treatmentProviderAddress;
  }

  public void setTreatmentProviderAddress(String treatmentProviderAddress) {
    this.treatmentProviderAddress = treatmentProviderAddress;
  }

  public String getLicenseProviderAddress() {
    return licenseProviderAddress;
  }

  public void setLicenseProviderAddress(String licenseProviderAddress) {
    this.licenseProviderAddress = licenseProviderAddress;
  }

  public String getTreatmentAddress() {
    return treatmentAddress;
  }

  public void setTreatmentAddress(String treatmentAddress) {
    this.treatmentAddress = treatmentAddress;
  }

  public String getMeasureAddress() {
    return measureAddress;
  }

  public void setMeasureAddress(String measureAddress) {
    this.measureAddress = measureAddress;
  }
}
