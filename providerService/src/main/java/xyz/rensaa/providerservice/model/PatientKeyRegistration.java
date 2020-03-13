package xyz.rensaa.providerservice.model;

import javax.persistence.*;

@Entity
@Table(indexes = {@Index(name = "patient_key_token_index",  columnList="TOKEN", unique = true)})
public class PatientKeyRegistration {

    @Id
    String address;

    @Column(unique = true)
    String token;

    public PatientKeyRegistration() {
    }

    public PatientKeyRegistration(String address, String token) {
        this.address = address;
        this.token = token;
    }

    public String getAddress() {
        return address;
    }
}
