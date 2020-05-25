package io.veicot.rightlyrics.initialization.importer;

import java.lang.reflect.Type;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public abstract class JacksonImporter implements Importer {

    private ObjectMapper mapper;

    public JacksonImporter() {
        this.mapper = getMapper();
    }

    public abstract ImportType type();

    protected abstract ObjectMapper getMapper();

    public boolean supportsType(ImportType type) {
        return this.type().equals(type);
    }

    @Override
    public <T> T doImport(TypeReference<T> typeReference,
                          String content) {
        try {

            return this.mapper.readValue(content, convertTypeReference(typeReference));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Can't read " + this.type().name() + " content", e);
        }
    }

    public <T> com.fasterxml.jackson.core.type.TypeReference<T> convertTypeReference(TypeReference<T> typeReference) {
        return new com.fasterxml.jackson.core.type.TypeReference<T>() {

            @Override
            public Type getType() {
                return typeReference.getType();
            }
        };
    }
}
