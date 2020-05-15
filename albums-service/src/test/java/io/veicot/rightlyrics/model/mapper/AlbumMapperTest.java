package io.veicot.rightlyrics.model.mapper;

import io.veicot.rightlyrics.model.Song;
import io.veicot.rightlyrics.model.dto.AlbumDto;
import io.veicot.rightlyrics.model.Album;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.assertj.core.api.Assertions.*;

public class AlbumMapperTest {

    @Test
    public void mapAlbumToAlbumDtoTest() {
        Album album = new Album(
                "Californication",
                "Red Hot Chili Pepers",
                "http://someUrl.com/californication",
                "06/08/1999");

        Set<Song> songs = Collections.newSetFromMap(Collections.synchronizedMap(new LinkedHashMap<>()));

        songs.add(new Song(1L));
        songs.add(new Song(2L));
        songs.add(new Song(3L));

        album.setSongs(songs);

        AlbumDto albumDto = AlbumMapper.INSTANCE.albumToAlbumDto(album);

        assertThat(albumDto).isNotNull();
        assertThat(albumDto.getTitle()).isEqualTo("Californication");
    }
}

