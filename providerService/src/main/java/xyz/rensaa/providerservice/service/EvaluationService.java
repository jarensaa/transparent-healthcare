package xyz.rensaa.providerservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Hash;
import xyz.rensaa.providerservice.contracts.CMeasureFactory;
import xyz.rensaa.providerservice.dto.Evaluation.EvaluationDTO;
import xyz.rensaa.providerservice.exceptions.TransactionFailedException;

import java.math.BigInteger;

@Service
public class EvaluationService {

    @Autowired
    CMeasureFactory measureFactory;

    @Value("services.treatmentprovider.hostname")
    String hostname;

    public boolean evaluateTreatment (EvaluationDTO evaluationDTO) {
        var evaluationContract = measureFactory.fromPrivateKey(evaluationDTO.privateKey());

        var ratingHashBytes = Hash.sha3(BigInteger.valueOf(evaluationDTO.rating()).toByteArray());

        try {
            evaluationContract.createMeasure(
                    BigInteger.valueOf(evaluationDTO.rating()),
                    ratingHashBytes,
                    hostname).send();
        } catch (Exception e) {
            throw new TransactionFailedException(e.getMessage());
        }

        return true;
    }
}
