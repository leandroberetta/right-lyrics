package io.veicot.rightlyrics.initialization;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.IntStream;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.context.control.ActivateRequestContext;
import javax.enterprise.event.Observes;
import javax.enterprise.inject.Instance;

import com.google.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.quarkus.runtime.ShutdownEvent;
import io.quarkus.runtime.StartupEvent;
import io.veicot.rightlyrics.initialization.steps.Step;
import io.veicot.rightlyrics.initialization.steps.StepContext;
import io.veicot.rightlyrics.initialization.steps.StepResult;

@ActivateRequestContext
@ApplicationScoped
public class Init {

    private Logger logger = LoggerFactory.getLogger(Init.class);

    private List<Step> steps;
    private StepContext context;

    private Instance<Step> stepInstances;

    @Inject
    public Init(Instance<Step> steps) {
        this.stepInstances = steps;
    }

    @PostConstruct
    public void postConstruct() {
        this.steps = buildSteps(stepInstances);
        context = new StepContext();
        sort(this.steps);
    }

    public void onStart(@Observes StartupEvent ev) {
        logger.info("Initialization process started");
        logger.info("{} steps found", this.steps.size());
        logger.info("Context: {}", this.context);
        logSteps(this.steps);
        List<StepResult> results = executeSteps(this.steps);
        logResults(results);

    }

    public void onStop(@Observes ShutdownEvent ev) {
        logger.info("The application is stopping...");
    }

    protected void sort(List<Step> steps) {
        Collections.sort(steps, (s1, s2) -> s2.proprity() - s1.proprity());
    }

    protected List<Step> buildSteps(Instance<Step> stepInstances) {
        List<Step> steps = new ArrayList<>();
        for (Step step : stepInstances) {
            steps.add(step);
        }

        return steps;
    }

    protected List<StepResult> executeSteps(List<Step> steps) {
        List<StepResult> results = new ArrayList<>();
        for (Step step : steps) {
            StepResult stepResult = step.exec(context);
            results.add(stepResult);
            if (stepResult.getStatusCode() != 0) {
                break;
            }
        }
        return results;
    }

    private void logSteps(List<Step> steps) {
        logger.info("Steps");
        IntStream.range(0, steps.size()).forEach(i -> logger.info("...|- Step {} => priority:{} - id: {}", i,
                steps.get(i).proprity(), steps.get(i).id()));
    }

    private void logResults(List<StepResult> results) {
        logger.info("Results");
        results.forEach(s -> logger.info("...|- {}", s.toString()));
    }

}