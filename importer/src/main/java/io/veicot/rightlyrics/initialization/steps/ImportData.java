package io.veicot.rightlyrics.initialization.steps;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

import io.veicot.rightlyrics.rest.dto.AlbumDTO;
import io.veicot.rightlyrics.rest.dto.LyricDTO;
import io.veicot.rightlyrics.rest.dto.ResponseDTO;
import io.veicot.rightlyrics.rest.dto.SongDTO;
import io.veicot.rightlyrics.initialization.importer.Importer;
import io.veicot.rightlyrics.initialization.importer.TypeReference;
import io.veicot.rightlyrics.initialization.importer.YAMLImporter;
import io.veicot.rightlyrics.rest.client.AlbumsService;
import io.veicot.rightlyrics.rest.client.LyricsService;
import io.veicot.rightlyrics.rest.client.SongsService;

@RequestScoped
public class ImportData implements Step {

    private Logger logger = LoggerFactory.getLogger(ImportData.class);

    @Inject
    @RestClient
    AlbumsService albumsService;

    @Inject
    @RestClient
    SongsService songsService;

    @Inject
    @RestClient
    LyricsService lyricsService;

    @Override
    public StepResult exec(StepContext context) {
        String content = readFile("importer/data.yaml");
        Importer importer = new YAMLImporter();
        
        List<AlbumDTO> albums = importer.doImport(new TypeReference<List<AlbumDTO>>() {
        }, content);        

        for (AlbumDTO album: albums) {
            logger.info("Creating {} album", album.getTitle());            
            ResponseDTO<AlbumDTO> createdAlbum = albumsService.create(album);
            logger.info("Album {} created with ID {}", album.getTitle(), createdAlbum.getData().getId());

            for (SongDTO song: album.getSongs()) {                            
                logger.info("Creating {} lyric", song.getName());
                LyricDTO lyricDTO = new LyricDTO();
                lyricDTO.setName(song.getName());
                lyricDTO.setLyric(song.getLyric());
                LyricDTO createdLyric = lyricsService.create(lyricDTO);
                logger.info("Lyric {} created with ID {}", createdLyric.getName(), createdLyric.get_id());
                
                song.setAlbumId(createdAlbum.getData().getId());
                song.setLyricId(createdLyric.get_id());
                song.setArtist(album.getArtist());

                logger.info("Creating {} song", song.getName());
                SongDTO createdSong = songsService.create(song);
                logger.info("Song {} created with ID {}", createdSong.getName(), createdSong.getId());               
            }
        }

        return StepResult.SUCCESS(this.id(), "Done");
    }

    public String readFile(String name) {
        try {
            File file = new File(getClass().getClassLoader().getResource(name).getFile());
            return new String(Files.readAllBytes(file.toPath()));
            //return String.join("\n", Files.readAllLines(file.toPath()));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}