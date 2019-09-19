package io.rl.song.repository;

import io.rl.song.model.Song;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SongRepository extends JpaRepository<Song, Long> {

    List<Song> findByNameIgnoreCaseContaining(String name);
    List<Song> findByArtistIgnoreCaseContaining(String artist);
}