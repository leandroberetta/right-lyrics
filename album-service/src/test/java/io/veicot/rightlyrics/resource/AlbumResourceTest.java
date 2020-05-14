package io.veicot.rightlyrics.resource;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;

@QuarkusTest
public class AlbumResourceTest {

    @Test
    public void testHelloEndpoint() {
        given()
                .when().get("/albums")
                .then()
                .statusCode(200);
    }
}
