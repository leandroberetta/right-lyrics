package io.veicot.rightlyrics.resource;

import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.h2.H2DatabaseTestResource;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.common.mapper.TypeRef;
import io.veicot.rightlyrics.model.Album;
import io.veicot.rightlyrics.model.dto.AlbumDto;
import io.veicot.rightlyrics.resource.response.Response;
import org.junit.jupiter.api.Test;

import javax.ws.rs.core.MediaType;

import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;

@QuarkusTest
@QuarkusTestResource(H2DatabaseTestResource.class)
public class AlbumsResourceTest {

    @Test
    public void createAlbumTest() {
        Album album = new Album("Californication",
                                "Red Hot Chili Peppers",
                                "https://upload.wikimedia.org/wikipedia/en/d/df/RedHotChiliPeppersCalifornication.jpg",
                                "06/08/1999");

        Response<AlbumDto> response = given()
            .contentType(MediaType.APPLICATION_JSON)
            .body(album)
            .when()
            .post("/albums")
            .then()
            .statusCode(javax.ws.rs.core.Response.Status.OK.getStatusCode())
            .extract().as(new TypeRef<Response<AlbumDto>>() {});

        assertThat(response.getData().getTitle()).isEqualTo("Californication");
        assertThat(response.getData().getArtist()).isEqualTo("Red Hot Chili Peppers");
        assertThat(response.getData().getCoverUrl()).isEqualTo("https://upload.wikimedia.org/wikipedia/en/d/df/RedHotChiliPeppersCalifornication.jpg");
        assertThat(response.getData().getYear()).isEqualTo("06/08/1999");
    }
}
