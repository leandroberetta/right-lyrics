package io.veicot.rightlyrics.model.mapper;

import io.veicot.rightlyrics.model.Song;
import io.veicot.rightlyrics.model.dto.AlbumDto;
import io.quarkus.test.junit.QuarkusTest;
import io.veicot.rightlyrics.model.Album;
import org.junit.jupiter.api.Test;

import java.util.*;

import javax.inject.Inject;

import static org.assertj.core.api.Assertions.*;

 @QuarkusTest
public class AlbumMapperTest {

    @Inject
    AlbumMapper albumMapper;

    @Test
    public void mapAlbumToAlbumDtoTest() {
        Album album = new Album(
                "Californication",
                "Red Hot Chili Peppers",
                "https://upload.wikimedia.org/wikipedia/en/d/df/RedHotChiliPeppersCalifornication.jpg",
                "06/08/1999");

        Set<Song> songs = Collections.newSetFromMap(Collections.synchronizedMap(new LinkedHashMap<>()));

        songs.add(new Song(1L));
        songs.add(new Song(2L));
        songs.add(new Song(3L));

        album.setSongs(songs);

        AlbumDto albumDto = albumMapper.albumToAlbumDto(album);

        assertThat(albumDto).isNotNull();
        assertThat(albumDto.getTitle()).isEqualTo("Californication");
    }
}

