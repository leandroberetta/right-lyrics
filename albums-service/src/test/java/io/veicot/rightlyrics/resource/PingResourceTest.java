package io.veicot.rightlyrics.resource;

import io.quarkus.test.junit.QuarkusTest;
import jdk.nashorn.internal.ir.annotations.Ignore;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.is;

@QuarkusTest
@Ignore
public class PingResourceTest {

    @Test
    public void pingResourceTest() {
        given()
                .when().get("/albums")
                .then()
                .statusCode(200).body(is("pong"));
    }
}
