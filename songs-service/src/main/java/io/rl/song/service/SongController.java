package io.rl.song.service;

import io.rl.song.model.Song;
import io.rl.song.repository.SongRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
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
    public ResponseEntity<Song> get(@PathVariable("id") Long id) {
        Optional<Song> song = repository.findById(id);
        
        if (song.isPresent()) {
            this.hitSong(song.get());

            return ResponseEntity.ok(song.get());
        } else
            return ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<Song>> getAll(@RequestParam(defaultValue = "", required = false) String filter) {
        List<Song> songs;

        if (filter.isEmpty()) {
            songs = repository.findAll();
        } else {
            List<Song> songsByName = repository.findByNameIgnoreCaseContaining(filter);
            List<Song> songsByArtist = repository.findByArtistIgnoreCaseContaining(filter);
    
            songs = new ArrayList<Song>(Stream.concat(songsByName.stream(), songsByArtist.stream()).collect(Collectors.toSet()));
        }
        
        return ResponseEntity.ok(songs);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Song> delete(@PathVariable Long id) {
        if (repository.findById(id).isPresent()) {
            repository.deleteById(id);

            return ResponseEntity.ok().build();
        } else
            return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Song> create(@RequestBody Song song) {
        return ResponseEntity.ok(repository.save(song));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Song> update(@PathVariable Long id, @RequestBody Song updatedSong) {
        Optional<Song> song = repository.findById(id);

        if (song.isPresent()) {
            Song actualSong = song.get();

            actualSong.setName(updatedSong.getName());
            actualSong.setArtist(updatedSong.getArtist());
            actualSong.setLyricId(updatedSong.getLyricId());

            return ResponseEntity.ok(repository.save(actualSong));
        } else 
            return ResponseEntity.notFound().build();
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
}

