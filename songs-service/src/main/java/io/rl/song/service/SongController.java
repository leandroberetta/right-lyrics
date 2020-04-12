package io.rl.song.service;

import io.rl.song.api.*;
import io.rl.song.model.Song;

import io.rl.song.repository.SongRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping(value = "/api/song")
public class SongController {

    private final SongRepository repository;

    private static final String  HIT_SERVICE = System.getenv("HITS_SERVICE_URL") != null ?  System.getenv("HITS_SERVICE_URL") : "http://localhost:8080";




    Logger logger = LoggerFactory.getLogger(SongController.class);

    public SongController(SongRepository repository) {
        this.repository = repository;
    }

    @Autowired
    RestTemplate restTemplate;

    @GetMapping("/{id}")
    public Response get(@PathVariable("id") Long id) {
        Optional<Song> song = repository.findById(id);
        if (song.isPresent()) {
            this.hitSong(song.get());

            return this.createSuccessResponse(this.mapSongToSongResponse(song.get()));
        } else
            return this.createErrorResponse("Error");
    }

    @GetMapping
    public Response getAll() {
        List<Song> songs = repository.findAll();

        return this.createSuccessResponse(this.mapSongsToSongResponseList(songs));
    }

    @PostMapping(path= "/search", consumes = "application/json", produces = "application/json")
    public Response search(@RequestBody SearchTextRequest searchText) {
        List<Song> songsByName = repository.findByNameIgnoreCaseContaining(searchText.getText());
        List<Song> songsByArtist = repository.findByArtistIgnoreCaseContaining(searchText.getText());

        Set<Song> songs = Stream.concat(songsByName.stream(), songsByArtist.stream()).collect(Collectors.toSet());

        return this.createSuccessResponse(this.mapSongsToSongResponseList(songs.stream().collect(Collectors.toList())));
    }

    private List<SongResponse> mapSongsToSongResponseList(List<Song> songs) {
        List<SongResponse> songResponses = new ArrayList<SongResponse>();

        for (Song song: songs) {
            songResponses.add(this.mapSongToSongResponse(song));
        }

        return songResponses;
    }

    private SongResponse mapSongToSongResponse(Song song) {
        SongResponse songResponse = new SongResponse();

        songResponse.setId(song.getId());
        songResponse.setName(song.getName());
        songResponse.setArtist(song.getArtist());
        songResponse.setLyricId(song.getLyricId());
        songResponse.setPopularity(this.getSongPopularity(song));

        return songResponse;
    }

    private String hitSong(Song song) {
        String popularity = null;

        HitRequest hit = new HitRequest();
        HitResponse hitResponse;

        hit.setId(song.getId());

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        HttpEntity<HitRequest> entity = new HttpEntity<HitRequest>(hit,headers);

        try {

            hitResponse = restTemplate.exchange(String.format("%s/api/hits", HIT_SERVICE),
                    HttpMethod.POST,
                    entity,
                    HitResponse.class).getBody();

            popularity =  hitResponse.getPopularity();
        } catch(Exception e) {
            logger.error(e.getMessage());
        }

        return popularity;
    }

    private String getSongPopularity(Song song) {
        String popularity = null;

        HitResponse hitResponse;

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));

        try {
            hitResponse = restTemplate.getForEntity(
                    String.format("%s/api/popularity/%d",HIT_SERVICE, song.getId()),
                    HitResponse.class).getBody();

            popularity =  hitResponse.getPopularity();
        } catch(Exception e) {
            logger.error(e.getMessage());
        }

        return popularity;
    }

    private Response createErrorResponse(String message) {
        Response response = new Response();

        response.setStatus(-1);
        response.setMessage(message);

        return response;
    }

    private Response createSuccessResponse(Object data) {
        Response response = new Response();

        response.setStatus(0);
        response.setData(data);

        return response;
    }
}

