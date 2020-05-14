package io.veicot.rightlyrics.mapper;

import io.veicot.rightlyrics.dto.AlbumDto;
import io.veicot.rightlyrics.model.Album;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.Set;

@Mapper
public interface AlbumMapper {

    AlbumMapper INSTANCE = Mappers.getMapper(AlbumMapper.class);

    AlbumDto albumToAlbumDto(Album album);
    Set<AlbumDto> albumsToAlbumsDto(Set<Album> albums);
}
