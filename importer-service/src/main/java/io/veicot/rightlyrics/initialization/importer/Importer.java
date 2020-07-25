package io.veicot.rightlyrics.initialization.importer;

public interface Importer {

    public abstract ImportType type();

    default boolean supportsType(ImportType type) {
        return this.type().equals(type);
    }

    <T> T doImport(TypeReference<T> typeReference, String content);

}
