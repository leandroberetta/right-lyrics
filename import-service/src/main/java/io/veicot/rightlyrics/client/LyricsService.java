package io.veicot.rightlyrics.client;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import io.veicot.rightlyrics.dto.LyricsDTO;

@Path("/api/lyrics")
@RegisterRestClient
public interface LyricsService {
 
    @POST
    @Produces("application/json")
    @Consumes("application/json")
    public LyricsDTO create(LyricsDTO lyricsDTO);
}