package io.veicot.rightlyrics.resource;

import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.h2.H2DatabaseTestResource;
import io.quarkus.test.junit.QuarkusTest;
import io.veicot.rightlyrics.model.Album;
import io.veicot.rightlyrics.model.dto.AlbumDto;
import io.veicot.rightlyrics.resource.response.Response;
import org.junit.jupiter.api.Test;

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
                "Red Hot Chili Pepers",
                "https://upload.wikimedia.org/wikipedia/en/d/df/RedHotChiliPeppersCalifornication.jpg",
                "06/08/1999");
        
        given()
            .contentType("application/json")
            .body(album)
        .when()
            .post("/albums")
        .then()
            .statusCode(200)
            .body("status", equalTo(0));
                //.extract().pat.path("data");
        
        //assertThat(albumDto.getTitle()).isEqualTo("Californication");
        //assertThat(albumDto.getArtist()).isEqualTo("Red Hot Chili Peppers");
        //assertThat(albumDto.getCoverUrl()).isEqualTo("https://upload.wikimedia.org/wikipedia/en/d/df/RedHotChiliPeppersCalifornication.jpg");
        //assertThat(albumDto.getYear()).isEqualTo("06/08/1999");

    }
}
