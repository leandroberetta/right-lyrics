package io.veicot.rightlyrics.resource;

import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.h2.H2DatabaseTestResource;
import io.quarkus.test.junit.QuarkusTest;
import jdk.nashorn.internal.ir.annotations.Ignore;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.is;

@QuarkusTest
@QuarkusTestResource(H2DatabaseTestResource.class)
public class PingResourceTest {

    @Test
    public void pingResourceTest() {
        given()
                .when().get("/ping")
                .then()
                .statusCode(200).body(is("pong"));
    }
}
