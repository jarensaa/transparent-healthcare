package xyz.rensaa.providerservice.model.Treatments;

import javax.annotation.processing.Generated;

// IDEA | Right click | Refactor | Replace Constructor with Builder
@Generated("xyz.rensaa.providerservice.model.Treatments")
public class TreatmentDataBuilder {
    private String treatmentAddress;
    private String patientAddress;
    private String fullDescription;
    private String patientKeySignature;
    private String treatmentKeySignature;

    public TreatmentDataBuilder setTreatmentAddress(String treatmentAddress) {
        this.treatmentAddress = treatmentAddress;
        return this;
    }

    public TreatmentDataBuilder setPatientAddress(String patientAddress) {
        this.patientAddress = patientAddress;
        return this;
    }

    public TreatmentDataBuilder setFullDescription(String fullDescription) {
        this.fullDescription = fullDescription;
        return this;
    }

    public TreatmentDataBuilder setPatientKeySignature(String patientKeySignature) {
        this.patientKeySignature = patientKeySignature;
        return this;
    }

    public TreatmentDataBuilder setTreatmentKeySignature(String treatmentKeySignature) {
        this.treatmentKeySignature = treatmentKeySignature;
        return this;
    }

    public TreatmentData build() {
        return new TreatmentData(treatmentAddress, patientAddress, fullDescription, patientKeySignature, treatmentKeySignature);
    }
}