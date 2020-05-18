package io.veicot.rightlyrics.model.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import io.veicot.rightlyrics.model.Album;
import io.veicot.rightlyrics.model.Song;
import io.veicot.rightlyrics.model.dto.AlbumDto;

public class AlbumMapperTest {

    AlbumMapper albumMapper;

    @BeforeEach
    public void setUp() {
        this.albumMapper = Mappers.getMapper(AlbumMapper.class);
    }

    @Test
    public void mapAlbumToAlbumDtoTest() {
        Album album = new Album("Californication",
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
