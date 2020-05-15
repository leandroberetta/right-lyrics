package io.veicot.rightlyrics.model.mapper;

import io.veicot.rightlyrics.model.dto.AlbumDto;
import io.veicot.rightlyrics.model.Album;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface AlbumMapper {

    AlbumMapper INSTANCE = Mappers.getMapper(AlbumMapper.class);

    AlbumDto albumToAlbumDto(Album album);
    List<AlbumDto> albumsToAlbumsDto(List<Album> albums);
}
