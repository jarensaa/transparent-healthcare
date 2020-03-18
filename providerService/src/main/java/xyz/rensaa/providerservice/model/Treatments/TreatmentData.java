package xyz.rensaa.providerservice.model.Treatments;

import javax.persistence.*;

@Entity
@Table(indexes = {@Index(name = "treatment_data_patient_address_index",  columnList="patientAddress")})
public class TreatmentData {

    @Id
    String treatmentAddress;

    String patientAddress;

    @Lob
    String fullDescription;

    String patientKeySignature;

    String treatmentKeySignature;

    public TreatmentData(String treatmentAddress, String patientAddress, String fullDescription, String patientKeySignature, String treatmentKeySignature) {
        this.treatmentAddress = treatmentAddress;
        this.patientAddress = patientAddress;
        this.fullDescription = fullDescription;
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

    public String getPatientKeySignature() {
        return patientKeySignature;
    }

    public String getTreatmentKeySignature() {
        return treatmentKeySignature;
    }
}
