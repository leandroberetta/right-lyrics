package io.rl.song.service;

import io.rl.song.model.Hit;
import io.rl.song.model.SearchText;
import io.rl.song.model.Song;

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
import java.util.stream.StreamSupport;

@RestController
@RequestMapping(value = "/api/song")
public class SongController {

    private final SongRepository repository;

    public SongController(SongRepository repository) {
        this.repository = repository;
    }

    @Autowired
    RestTemplate restTemplate;

    @GetMapping("/{id}")
    public Optional<Song> get(@PathVariable("id") Long id) {
        Hit hit = new Hit();
        hit.setId(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        HttpEntity<Hit> entity = new HttpEntity<Hit>(hit,headers);

        try {
            restTemplate.exchange(System.getenv("HITS_SERVICE_URL"), HttpMethod.POST, entity, String.class).getBody();
        } catch(Exception e) {
            ;
        }

        return repository.findById(id);
}

    @GetMapping
    public List<Song> getAll() {
        Spliterator<Song> songs = repository.findAll().spliterator();

        return StreamSupport
                .stream(songs, false)
                .collect(Collectors.toList());
    }

    @PostMapping(path= "/search", consumes = "application/json", produces = "application/json")
    public Set<Song> search(@RequestBody SearchText searchText) {
        List<Song> songsByName = repository.findByNameIgnoreCaseContaining(searchText.getText());
        List<Song> songsByArtist = repository.findByArtistIgnoreCaseContaining(searchText.getText());

        return Stream.concat(songsByName.stream(), songsByArtist.stream()).collect(Collectors.toSet());
    }
}

