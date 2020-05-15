package io.veicot.rightlyrics.resource;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Page;
import io.veicot.rightlyrics.model.dto.AlbumDto;
import io.veicot.rightlyrics.model.mapper.AlbumMapper;
import io.veicot.rightlyrics.model.Album;
import io.veicot.rightlyrics.repository.AlbumRepository;
import io.veicot.rightlyrics.resource.response.Response;
import io.veicot.rightlyrics.resource.response.SearchResponse;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.*;

@ApplicationScoped
@Path("/albums")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AlbumResource {

    @Inject
    AlbumRepository albumRepository;

    public AlbumResource() {}

    @GET
    public SearchResponse<List<AlbumDto>> getAll(@DefaultValue("") @QueryParam("query") String query,
                                                 @DefaultValue("0") @QueryParam("page") Integer page,
                                                 @DefaultValue("25") @QueryParam("pageSize") Integer pageSize) {

        PanacheQuery<Album> panacheQuery = albumRepository.findAll();

        SearchResponse<List<AlbumDto>> response = new SearchResponse<List<AlbumDto>>();

        response.setStatus(0);
        response.setData(AlbumMapper.INSTANCE.albumsToAlbumsDto(panacheQuery.page(Page.of(page, pageSize)).list()));
        response.setLength(response.getData().size());

        return response;
    }

    @GET
    @Path("{id}")
    public Response<AlbumDto> get(@PathParam("id") Long id) {
        Album album = albumRepository.findById(id);

        Response<AlbumDto> response = new Response<>();

        response.setStatus(0);
        response.setData(AlbumMapper.INSTANCE.albumToAlbumDto(album));

        return response;
    }

    @POST
    @Transactional
    public Response<AlbumDto> create(Album album) {
        albumRepository.persist(album);

        Response<AlbumDto> response = new Response<>();

        response.setStatus(0);
        response.setData(AlbumMapper.INSTANCE.albumToAlbumDto(album));

        return response;
    }

    @PUT
    @Transactional
    public Response<AlbumDto> update(Album album) {
        PanacheQuery  panacheQuery = albumRepository.find("title = ?1 and artist = ?2", album.getTitle(), album.getArtist());

        Album persistedAlbum = (Album) panacheQuery.singleResult();

        persistedAlbum.setTitle(album.getTitle());
        persistedAlbum.setArtist(album.getArtist());
        persistedAlbum.setCoverUrl(album.getCoverUrl());
        persistedAlbum.setYear(album.getYear());

        albumRepository.persist(persistedAlbum);

        Response<AlbumDto> response = new Response<>();

        response.setStatus(0);
        response.setData(AlbumMapper.INSTANCE.albumToAlbumDto(persistedAlbum));

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

        albums.add(new Album(
                "Californication",
                "Red Hot Chili Pepers",
                "https://upload.wikimedia.org/wikipedia/en/d/df/RedHotChiliPeppersCalifornication.jpg",
                "06/08/1999"));

        albums.add(new Album(
                "Ten",
                "Pearl Jam",
                "https://upload.wikimedia.org/wikipedia/en/2/2d/PearlJam-Ten2.jpg",
                "08/27/1999"));

        albums.add(new Album(
                "The Colour And The Shape",
                "Foo Fighters",
                "https://upload.wikimedia.org/wikipedia/en/0/0d/FooFighters-TheColourAndTheShape.jpg",
                "05/20/1997"));

        albumRepository.persist(albums);

        Response<List<AlbumDto>> response = new Response<>();

        response.setStatus(0);
        response.setData(AlbumMapper.INSTANCE.albumsToAlbumsDto(albums));

        return response;
    }
}
