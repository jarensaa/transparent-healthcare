package xyz.rensaa.providerservice.model.Treatments;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table
public class TreatmentData {

    @Id
    String treatmentAddress;

    String patientAddress;

    String fullDescription;

    String licenseAddress;

    String patientKeySignature;

    String treatmentKeySignature;

    public TreatmentData(String treatmentAddress, String patientAddress, String fullDescription, String licenseAddress, String patientKeySignature, String treatmentKeySignature) {
        this.treatmentAddress = treatmentAddress;
        this.patientAddress = patientAddress;
        this.fullDescription = fullDescription;
        this.licenseAddress = licenseAddress;
        this.patientKeySignature = patientKeySignature;
        this.treatmentKeySignature = treatmentKeySignature;
    }

    public TreatmentData() {
    }

    public String getTreatmentAddress() {
        return treatmentAddress;
    }

    public String getPatientAddress() {
        return patientAddress;
    }

    public String getFullDescription() {
        return fullDescription;
    }

    public String getLicenseAddress() {
        return licenseAddress;
    }

    public String getPatientKeySignature() {
        return patientKeySignature;
    }

    public String getTreatmentKeySignature() {
        return treatmentKeySignature;
    }
}
