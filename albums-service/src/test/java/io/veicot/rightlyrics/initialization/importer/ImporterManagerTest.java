package io.veicot.rightlyrics.initialization.importer;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;

import java.util.List;

import javax.enterprise.inject.Instance;

import com.google.common.collect.Lists;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class ImporterManagerTest {

    private ImportManager importManager;

    @BeforeEach
    @SuppressWarnings("unchecked")
    public void setUp() {
        importManager = new ImportManager(mock(Instance.class));
    }

    @Test
    public void testImporterFound() {
        Importer json = mock(Importer.class);
        Importer yaml = mock(Importer.class);

        doReturn(true).when(json).supportsType(ImportType.JSON);
        doReturn(true).when(yaml).supportsType(ImportType.YAML);

        List<Importer> importers = Lists.newArrayList(json, yaml);
        Importer importer = importManager.getImporter(importers, ImportType.JSON);

        assertThat(importer).isEqualTo(json);
    }

    @Test
    public void testImporterNotFound() {
        Importer yaml = mock(Importer.class);

        doReturn(true).when(yaml).supportsType(ImportType.YAML);

        List<Importer> importers = Lists.newArrayList(yaml);

        try {
            importManager.getImporter(importers, ImportType.JSON);
            fail();
        } catch (Exception e) {
        }

    }

}