package io.veicot.rightlyrics.initialization.importer;

import javax.enterprise.context.RequestScoped;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;

import lombok.ToString;

@RequestScoped
@ToString
public class YAMLImporter extends JacksonImporter {

    public YAMLImporter() {
        super();
    }

    @Override
    public ImportType type() {
        return ImportType.YAML;
    }

    @Override
    protected ObjectMapper getMapper() {
        return new ObjectMapper(new YAMLFactory());
    }

}