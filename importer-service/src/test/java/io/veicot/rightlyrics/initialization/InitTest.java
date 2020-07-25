package io.veicot.rightlyrics.initialization;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;

import java.util.List;

import javax.enterprise.inject.Instance;

import com.google.common.collect.Lists;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import io.veicot.rightlyrics.initialization.steps.Step;
import io.veicot.rightlyrics.initialization.steps.StepResult;

public class InitTest {

    private Init init;

    @BeforeEach
    @SuppressWarnings("unchecked")
    public void setUp() {
        init = new Init(mock(Instance.class));
    }

    @Test
    public void testSort() {
        Step step1 = mock(Step.class);
        Step step2 = mock(Step.class);
        Step step3 = mock(Step.class);

        doReturn(100).when(step2).proprity();

        List<Step> steps = Lists.newArrayList(step1, step3, step2);
        init.sort(steps);

        assertThat(steps).first().isEqualTo(step2);
    }

    @Test
    public void testAllExecutionsGreen() {
        Step step1 = mock(Step.class);
        Step step2 = mock(Step.class);
        Step step3 = mock(Step.class);

        doReturn(StepResult.SUCCESS("step1", "Sucess")).when(step1).exec(any());
        doReturn(StepResult.SUCCESS("step2", "Sucess")).when(step2).exec(any());
        doReturn(StepResult.SUCCESS("step3", "Sucess")).when(step3).exec(any());

        List<Step> steps = Lists.newArrayList(step1, step3, step2);
        List<StepResult> results = init.executeSteps(steps);

        assertThat(results).size().isEqualTo(3);
        assertThat(results).allMatch(r -> r.getStatusCode() == 0);
    }

    @Test
    public void testExecutionRed() {
        Step step1 = mock(Step.class);
        Step step2 = mock(Step.class);
        Step step3 = mock(Step.class);

        doReturn(StepResult.SUCCESS("step1", "Sucess")).when(step1).exec(any());
        doReturn(StepResult.ERROR("step2", 123, "Error")).when(step2).exec(any());
        doReturn(StepResult.SUCCESS("step3", "Sucess")).when(step3).exec(any());

        List<Step> steps = Lists.newArrayList(step1, step2, step3);
        List<StepResult> results = init.executeSteps(steps);

        assertThat(results).size().isEqualTo(2);
    }

}