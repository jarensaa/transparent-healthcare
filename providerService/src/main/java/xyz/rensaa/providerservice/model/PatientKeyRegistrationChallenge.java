package xyz.rensaa.providerservice.model;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table
public class PatientKeyRegistrationChallenge {

    @Id
    String token;

    String challenge;

    public PatientKeyRegistrationChallenge() {
    }

    public PatientKeyRegistrationChallenge(String token, String challenge) {
        this.token = token;
        this.challenge = challenge;
    }

    public String getToken() {
        return token;
    }

    public String getChallenge() {
        return challenge;
    }
}
