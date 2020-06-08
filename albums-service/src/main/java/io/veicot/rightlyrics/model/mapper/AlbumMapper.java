package io.veicot.rightlyrics.model.mapper;

import io.veicot.rightlyrics.model.dto.AlbumDto;
import io.veicot.rightlyrics.model.Album;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "cdi")
public interface AlbumMapper {

    AlbumDto albumToAlbumDto(Album album);

    Album toEntity(AlbumDto album);

    void merge(@MappingTarget Album album, AlbumDto dto);

    List<AlbumDto> albumsToAlbumsDto(List<Album> albums);
}
