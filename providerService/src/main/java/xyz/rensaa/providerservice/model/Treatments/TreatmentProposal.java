package xyz.rensaa.providerservice.model.Treatments;

import javax.persistence.*;

@Entity
@Table(indexes = {@Index(name = "treatment_proposal_patient_index",  columnList="patientAddress")})
public class TreatmentProposal {

    @Id
    String tempId;

    String licenseAddress;

    String patientAddress;

    @Lob
    String description;

    public TreatmentProposal() {
    }

    public TreatmentProposal(String tempId, String licenseAddress, String patientAddress, String description) {
        this.tempId = tempId;
        this.licenseAddress = licenseAddress;
        this.patientAddress = patientAddress;
        this.description = description;
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
