package io.rl.song.service;

import io.rl.song.model.Song;
import io.rl.song.repository.SongRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping(value = "/api/songs")
public class SongController {

    private final SongRepository repository;

    @Value("${hits.service.url}")
    private String hitsService;

    Logger logger = LoggerFactory.getLogger(SongController.class);

    public SongController(SongRepository repository) {
        this.repository = repository;
    }

    @Autowired
    RestTemplate restTemplate;

    @GetMapping("/{id}")
    public ResponseEntity<Song> get(@PathVariable("id") Long id) {
        Optional<Song> songOptional = repository.findById(id);
        
        if (songOptional.isPresent()) {
            Song song = songOptional.get();

            song.setPopularity(this.hitSong(song.getId()));

            return ResponseEntity.ok(song);
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

        for (Song song: songs) {
            song.setPopularity(this.getSongPopularity(song.getId()));
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
            actualSong.setLyricsId(updatedSong.getLyricsId());
            actualSong.setAlbumId(updatedSong.getAlbumId());

            return ResponseEntity.ok(repository.save(actualSong));
        } else 
            return ResponseEntity.notFound().build();
    }

    private String hitSong(Long songId) {
        String popularity = null;                

        try {
           popularity = restTemplate.getForEntity(String.format("%s/api/hits/%d", hitsService, songId), String.class).getBody();
        } catch(Exception e) {
            logger.error(e.getMessage());
        }

        return popularity;
    }

    private String getSongPopularity(Long songId) {
        String popularity = null;

        try {
            popularity = restTemplate.getForEntity(String.format("%s/api/popularity/%d", hitsService, songId), String.class).getBody();            
        } catch(Exception e) {
            logger.error(e.getMessage());
        }

        return popularity;
    }
}

