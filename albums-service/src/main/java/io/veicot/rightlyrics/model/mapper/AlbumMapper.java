package io.veicot.rightlyrics.model.mapper;

import io.veicot.rightlyrics.model.dto.AlbumDto;
import io.veicot.rightlyrics.model.Album;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "cdi")
public interface AlbumMapper {

    AlbumDto albumToAlbumDto(Album album);
    List<AlbumDto> albumsToAlbumsDto(List<Album> albums);
}
