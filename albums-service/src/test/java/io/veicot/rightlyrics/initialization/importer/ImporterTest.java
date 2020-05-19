package io.veicot.rightlyrics.initialization.importer;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.stream.Stream;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ImporterTest {

    private Logger logger = LoggerFactory.getLogger(ImporterTest.class);

    public static Stream<Arguments> data() {
        return Stream.of(
                         Arguments.of(ImportType.JSON, new JsonImporter()),
                         Arguments.of(ImportType.YAML, new YAMLImporter()));
    }

    @ParameterizedTest
    @MethodSource("data")
    public void testSimpleObject(ImportType param, Importer importer) throws IOException {
        String content = readFile("test1", param);
        TestDTO imported = importer.doImport(new TypeReference<TestDTO>() {
        }, content);
        assertThat(imported.getName()).isEqualTo("Fru");
        assertThat(imported.getBirth()).isEqualTo(Date.from(LocalDate.of(1970, 3, 5).atStartOfDay(ZoneId.systemDefault()).toInstant()));

    }

    @ParameterizedTest
    @MethodSource("data")
    public void testCollectionObject(ImportType param, Importer importer) throws IOException {
        String content = readFile("test2", param);
        List<TestDTO> imported = importer.doImport(new TypeReference<List<TestDTO>>() {
        }, content);
        assertThat(imported).extracting(i -> i.getName()).contains("Fru", "Jimmy");

    }

    @ParameterizedTest
    @MethodSource("data")
    public void testSublists(ImportType param, Importer importer) throws IOException {
        String content = readFile("test3", param);
        TestDTO imported = importer.doImport(new TypeReference<TestDTO>() {
        }, content);
        assertThat(imported.getSiblings()).extracting(s -> s.getName()).contains("Jimmy");

    }

    public String readFile(String name, ImportType type) {
        try {
            String p = "src/test/resources/importer/" + name + "." + type.name().toLowerCase();
            logger.info(p);
            Path path = Paths.get(p);
            return String.join("\n", Files.readAllLines(path));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}
