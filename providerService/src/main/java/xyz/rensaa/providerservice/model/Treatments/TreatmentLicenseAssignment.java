package xyz.rensaa.providerservice.model.Treatments;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Table;

@Entity
@Table(indexes = {@Index(name = "treatment_assignment_license_index",  columnList="licenseAddress")})
public class TreatmentLicenseAssignment {

    @Id
    String treatmentAddress;

    String licenseAddress;

    public TreatmentLicenseAssignment() {
    }

    public TreatmentLicenseAssignment(String treatmentAddress, String licenseAddress) {
        this.treatmentAddress = treatmentAddress;
        this.licenseAddress = licenseAddress;
    }

    public String getTreatmentAddress() {
        return treatmentAddress;
    }

    public String getLicenseAddress() {
        return licenseAddress;
    }
}
