package io.veicot.rightlyrics.initialization.steps;

public interface Step {

    default String id() {
        return this.getClass().getSimpleName();
    }

    StepResult exec(StepContext context);

    /**
     * Steps that contains higher priority number will be executed first. If two or more steps containst the same number, first step found will be execute. Can't ensure order.
     * @return
     */
    default int proprity() {
        return 0;
    }

}