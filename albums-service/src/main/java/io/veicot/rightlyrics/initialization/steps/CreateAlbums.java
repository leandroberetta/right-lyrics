package io.veicot.rightlyrics.initialization.steps;

import javax.enterprise.context.RequestScoped;

@RequestScoped
public class CreateAlbums implements Step {

    @Override
    public StepResult exec(StepContext context) {
        return StepResult.SUCCESS(this.id(), "Done");
    }

}