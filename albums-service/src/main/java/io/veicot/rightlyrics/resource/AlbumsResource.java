package io.veicot.rightlyrics.resource;

import io.veicot.rightlyrics.dto.AlbumDto;
import io.veicot.rightlyrics.mapper.AlbumMapper;
import io.veicot.rightlyrics.model.Album;
import io.veicot.rightlyrics.resource.response.SearchResponse;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Set;

@Path("/albums")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AlbumsResource {

    private Set<Album> albums = Collections.newSetFromMap(Collections.synchronizedMap(new LinkedHashMap<>()));

    public AlbumsResource() {
        albums.add(new Album(1L, "Californication", "Red Hot Chili Pepers", "someUrl", "06/08/1999"));
        albums.add(new Album(1L, "Ten", "Pearl Jam", "someUrl", "08/27/1999"));
        albums.add(new Album(1L, "The Colour And The Shape", "Red Hot Chili Pepers", "someUrl", "05/20/1997"));
    }

    @GET
    public SearchResponse<Set<AlbumDto>> getAll() {
        SearchResponse<Set<AlbumDto>> response = new SearchResponse<Set<AlbumDto>>();

        response.setStatus(0);
        response.setData(AlbumMapper.INSTANCE.albumsToAlbumsDto(albums));
        response.setLength(response.getData().size());

        return response;
    }
}
