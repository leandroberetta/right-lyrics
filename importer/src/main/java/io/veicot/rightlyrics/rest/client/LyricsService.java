package io.veicot.rightlyrics.rest.client;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import io.veicot.rightlyrics.rest.dto.LyricDTO;

@Path("/api/lyric")
@RegisterRestClient
public interface LyricsService {
 
    @POST
    @Produces("application/json")
    @Consumes("application/json")
    public LyricDTO create(LyricDTO lyricDTO); 
}