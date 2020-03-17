package xyz.rensaa.providerservice.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Table;

@Entity
@Table(indexes = {
        @Index(name = "treatment_provider_hire_provider_address_index",  columnList="providerAddress"),
        @Index(name = "treatment_provider_hire_license_address_index",  columnList="licenseAddress")
})
public class TreatmentProviderHire {

    @Id
    String token;

    String licenseAddress;

    String providerAddress;

    public TreatmentProviderHire() {
    }

    public TreatmentProviderHire(String token, String licenseAddress, String providerAddress) {
        this.token = token;
        this.licenseAddress = licenseAddress;
        this.providerAddress = providerAddress;
    }

    public String getToken() {
        return token;
    }

    public String getLicenseAddress() {
        return licenseAddress;
    }

    public String getProviderAddress() {
        return providerAddress;
    }
}
