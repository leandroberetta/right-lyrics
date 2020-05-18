package io.veicot.rightlyrics.resource;

import java.util.ArrayList;
import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Page;
import io.veicot.rightlyrics.model.Album;
import io.veicot.rightlyrics.model.dto.AlbumDto;
import io.veicot.rightlyrics.model.mapper.AlbumMapper;
import io.veicot.rightlyrics.repository.AlbumRepository;
import io.veicot.rightlyrics.resource.response.Response;
import io.veicot.rightlyrics.resource.response.SearchResponse;

@ApplicationScoped
@Path("/albums")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AlbumResource {

    private AlbumRepository albumRepository;

    private AlbumMapper albumMapper;

    @Inject
    public AlbumResource(AlbumRepository albumRepository, AlbumMapper albumMapper) {
        this.albumRepository = albumRepository;
        this.albumMapper = albumMapper;

    }

    @GET
    @Path("/")
    public SearchResponse<List<AlbumDto>> getAll(@DefaultValue("") @QueryParam("query") String query,
                                                 @DefaultValue("0") @QueryParam("page") Integer page,
                                                 @DefaultValue("25") @QueryParam("pageSize") Integer pageSize) {

        PanacheQuery<Album> panacheQuery = albumRepository.findAll();

        SearchResponse<List<AlbumDto>> response = new SearchResponse<List<AlbumDto>>();

        response.setStatus(0);
        response.setData(albumMapper.albumsToAlbumsDto(panacheQuery.page(Page.of(page, pageSize)).list()));
        response.setLength(response.getData().size());

        return response;
    }

    @GET
    @Path("/{id}")
    public Response<AlbumDto> get(@PathParam("id") Long id) {
        Album album = albumRepository.findById(id);

        Response<AlbumDto> response = new Response<>();

        response.setStatus(0);
        response.setData(albumMapper.albumToAlbumDto(album));

        return response;
    }

    @POST
    @Transactional
    public Response<AlbumDto> create(Album album) {
        albumRepository.persist(album);

        Response<AlbumDto> response = new Response<>();

        response.setStatus(0);
        response.setData(albumMapper.albumToAlbumDto(album));

        return response;
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response<AlbumDto> update(@PathParam("id") Long id, Album album) {
        Album persistedAlbum = albumRepository.findById(id);

        persistedAlbum.setTitle(album.getTitle());
        persistedAlbum.setArtist(album.getArtist());
        persistedAlbum.setCoverUrl(album.getCoverUrl());
        persistedAlbum.setYear(album.getYear());

        albumRepository.persist(persistedAlbum);

        Response<AlbumDto> response = new Response<>();

        response.setStatus(0);
        response.setData(albumMapper.albumToAlbumDto(persistedAlbum));

        return response;
    }

    @DELETE
    @Path("{id}")
    @Transactional
    public Response<Void> delete(@PathParam("id") Long id) {
        albumRepository.deleteById(id);

        Response<Void> response = new Response<>();

        response.setStatus(0);

        return response;
    }

    @GET
    @Path("/load")
    @Transactional
    public Response<List<AlbumDto>> load() {
        List<Album> albums = new ArrayList<>();

        albums.add(new Album("Californication",
                             "Red Hot Chili Pepers",
                             "https://upload.wikimedia.org/wikipedia/en/d/df/RedHotChiliPeppersCalifornication.jpg",
                             "06/08/1999"));

        albums.add(new Album("Ten",
                             "Pearl Jam",
                             "https://upload.wikimedia.org/wikipedia/en/2/2d/PearlJam-Ten2.jpg",
                             "08/27/1999"));

        albums.add(new Album("The Colour And The Shape",
                             "Foo Fighters",
                             "https://upload.wikimedia.org/wikipedia/en/0/0d/FooFighters-TheColourAndTheShape.jpg",
                             "05/20/1997"));

        albumRepository.persist(albums);

        Response<List<AlbumDto>> response = new Response<>();

        response.setStatus(0);
        response.setData(albumMapper.albumsToAlbumsDto(albums));

        return response;
    }
}
