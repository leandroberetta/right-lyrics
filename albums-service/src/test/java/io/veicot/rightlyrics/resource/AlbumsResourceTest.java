package io.veicot.rightlyrics.resource;

import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.h2.H2DatabaseTestResource;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.response.Response;
import io.veicot.rightlyrics.model.Album;
import io.veicot.rightlyrics.model.dto.AlbumDto;
import io.veicot.rightlyrics.model.mapper.AlbumMapper;
import org.junit.jupiter.api.Test;

import javax.ws.rs.core.MediaType;
import java.util.HashMap;

import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.equalTo;

@QuarkusTest
@QuarkusTestResource(H2DatabaseTestResource.class)
public class AlbumsResourceTest {

    @Test
    public void createAlbumTest() {
        Album album = new Album(
                "Californication",
                "Red Hot Chili Peppers",
                "https://upload.wikimedia.org/wikipedia/en/d/df/RedHotChiliPeppersCalifornication.jpg",
                "06/08/1999");
        
        Response response = given()
            .contentType(MediaType.APPLICATION_JSON)
            .body(album)
        .when()
            .post("/albums")
        .then()
            .statusCode(200)
            .extract()
            .response();

        HashMap<String, String> albumMap = response.path("data");

        assertThat(albumMap.get("title")).isEqualTo("Californication");
        assertThat(albumMap.get("artist")).isEqualTo("Red Hot Chili Peppers");
    }
}
