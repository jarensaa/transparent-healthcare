package xyz.rensaa.providerservice.model.Treatments;

import javax.persistence.*;

@Entity
@Table(indexes = {@Index(name = "treatment_proposal_patient_index",  columnList="patientAddress")})
public class TreatmentProposal {

    @Id
    String tempId;

    String licenseAddress;

    String patientAddress;

    String treatmentProviderToken;

    @Lob
    String description;

    public TreatmentProposal() {
    }

    public TreatmentProposal(String tempId, String licenseAddress, String patientAddress, String description, String treatmentProviderToken) {
        this.tempId = tempId;
        this.licenseAddress = licenseAddress;
        this.patientAddress = patientAddress;
        this.description = description;
        this.treatmentProviderToken = treatmentProviderToken;
    }

    public String getTreatmentProviderToken() {
        return treatmentProviderToken;
    }

    public String getTempId() {
        return tempId;
    }

    public String getLicenseAddress() {
        return licenseAddress;
    }

    public String getPatientAddress() {
        return patientAddress;
    }

    public String getDescription() {
        return description;
    }
}
