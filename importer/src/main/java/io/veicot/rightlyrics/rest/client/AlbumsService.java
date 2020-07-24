package io.veicot.rightlyrics.rest.client;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import io.veicot.rightlyrics.rest.dto.AlbumDTO;
import io.veicot.rightlyrics.rest.dto.ResponseDTO;

@Path("/albums")
@RegisterRestClient
public interface AlbumsService {
 
    @POST
    @Produces("application/json")
    @Consumes("application/json")
    public ResponseDTO<AlbumDTO> create(AlbumDTO albumDTO); 
}