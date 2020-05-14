package io.veicot.rightlyrics.mapper;

import io.veicot.rightlyrics.dto.AlbumDto;
import io.veicot.rightlyrics.model.Album;
import io.veicot.rightlyrics.model.Song;
import org.junit.jupiter.api.Test;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import static org.assertj.core.api.Assertions.*;

public class AlbumMapperTest {

    @Test
    public void shouldMapAlbumToDto() {
        Album album = new Album(1L,
                "Californication",
                "Red Hot Chili Pepers",
                "someUrl",
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

