package xyz.rensaa.providerservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Hash;
import xyz.rensaa.providerservice.Measure;
import xyz.rensaa.providerservice.contracts.CMeasureFactory;
import xyz.rensaa.providerservice.dto.Evaluation.EvaluationCreationDTO;
import xyz.rensaa.providerservice.dto.Evaluation.EvaluationDTO;
import xyz.rensaa.providerservice.dto.Evaluation.ImmutableEvaluationDTO;
import xyz.rensaa.providerservice.exceptions.TransactionFailedException;

import javax.xml.bind.DatatypeConverter;
import java.math.BigInteger;
import java.util.Optional;

@Service
public class EvaluationService {

    @Autowired
    CMeasureFactory measureFactory;

    @Autowired
    Measure defaultMeasureContract;

    @Value("services.treatmentprovider.hostname")
    String hostname;

    public boolean evaluateTreatment (EvaluationCreationDTO evaluationCreationDTO) {
        var evaluationContract = measureFactory.fromPrivateKey(evaluationCreationDTO.privateKey());

        var ratingHashBytes = Hash.sha3(BigInteger.valueOf(evaluationCreationDTO.rating()).toByteArray());

        try {
            evaluationContract.createMeasure(
                    BigInteger.valueOf(evaluationCreationDTO.rating()),
                    ratingHashBytes,
                    hostname).send();
        } catch (Exception e) {
            throw new TransactionFailedException(e.getMessage());
        }

        return true;
    }

    public Optional<EvaluationDTO> getEvaluationOfTreatment(String treatmentAddress) {
        try {
            var evaluationData = defaultMeasureContract.getMeasureForTreatment(treatmentAddress).send();

            if(evaluationData.component3().length() == 0) {
                return Optional.empty();
            }

            var evaluationDTO = ImmutableEvaluationDTO.builder()
                    .rating(evaluationData.component1().intValue())
                    .fullMeasureHash(DatatypeConverter.printHexBinary(evaluationData.component2()))
                    .fullMeasureUrl(evaluationData.component3())
                    .build();

            return Optional.of(evaluationDTO);
        } catch (Exception e) {
            throw new TransactionFailedException(e.getMessage());
        }

    }

}
