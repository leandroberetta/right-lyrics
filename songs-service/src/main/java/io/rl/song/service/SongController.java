package io.rl.song.service;

import io.rl.song.model.SearchText;
import io.rl.song.model.Song;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.Spliterator;
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

    @GetMapping("/{id}")
    public Optional<Song> get(@PathVariable("id") Long id) {
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

