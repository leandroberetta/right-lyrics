package io.veicot.rightlyrics.initialization.importer;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Instance;

import com.google.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ApplicationScoped
public class ImportManager {

    private Logger logger = LoggerFactory.getLogger(ImportManager.class);
    private List<Importer> importers;
    private Instance<Importer> importersInstance;

    @Inject
    public ImportManager(Instance<Importer> importersInstance) {
        this.importersInstance = importersInstance;

    }

    @PostConstruct
    public void initialize() {
        this.importers = buildImporters();
    }

    public <T> T importEntity(TypeReference<T> typeReference, String content, ImportType importType) {

        Importer importer = getImporter(this.importers, importType);
        T result = importer.doImport(typeReference, content);
        int size = 1;
        if (result instanceof Collection) {
            size = ((Collection) result).size();
        }
        logger.info("Decoded {} entities of type <{}> from importer <{}>", size, typeReference.getType().getTypeName(),
                    importType.name());
        return result;
    }

    protected List<Importer> buildImporters() {
        List<Importer> importers = new ArrayList<>();
        for (Importer step : importersInstance) {
            importers.add(step);
        }

        logger.info("Importers found: {} => ", importers.size(), importers);
        return importers;
    }

    protected Importer getImporter(List<Importer> importers, ImportType importType) {
        Optional<Importer> importer = importers.stream().filter(i -> i.supportsType(importType)).findFirst();
        return importer.orElseThrow(() -> new RuntimeException("No importer found for type " + importType));
    }

}
