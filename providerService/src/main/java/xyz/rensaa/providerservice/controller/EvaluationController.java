package xyz.rensaa.providerservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import xyz.rensaa.providerservice.dto.Evaluation.EvaluationCreationDTO;
import xyz.rensaa.providerservice.service.EvaluationService;

@RestController
@RequestMapping("/evaluations")
public class EvaluationController {

    @Autowired
    EvaluationService evaluationService;

    @PostMapping
    private boolean evaluateTreatment(@RequestBody EvaluationCreationDTO evaluationCreationDTO) {
        return  evaluationService.evaluateTreatment(evaluationCreationDTO);
    }
}
