package io.veicot.rightlyrics.load;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.veicot.rightlyrics.initialization.importer.Importer;
import io.veicot.rightlyrics.initialization.importer.YAMLImporter;
import io.veicot.rightlyrics.client.AlbumsService;
import io.veicot.rightlyrics.client.LyricsService;
import io.veicot.rightlyrics.client.SongsService;
import io.veicot.rightlyrics.initialization.importer.TypeReference;

import io.veicot.rightlyrics.dto.AlbumDTO;
import io.veicot.rightlyrics.dto.LyricsDTO;
import io.veicot.rightlyrics.dto.ResponseDTO;
import io.veicot.rightlyrics.dto.SongDTO;

@ApplicationScoped
public class LyricsLoader {

    private Logger logger = LoggerFactory.getLogger(LyricsLoader.class);
    
    @Inject
    @RestClient
    AlbumsService albumsService;

    @Inject
    @RestClient
    SongsService songsService;

    @Inject
    @RestClient
    LyricsService lyricsService;

    public void load(String data) {
        Importer importer = new YAMLImporter();
        
        List<AlbumDTO> albums = importer.doImport(new TypeReference<List<AlbumDTO>>() {}, data);        

        for (AlbumDTO album: albums) {
            logger.info("Creating {} album", album.getTitle());            
            ResponseDTO<AlbumDTO> createdAlbum = albumsService.create(album);
            logger.info("Album {} created with ID {}", album.getTitle(), createdAlbum.getData().getId());

            for (SongDTO song: album.getSongs()) {                            
                logger.info("Creating {} lyric", song.getName());
                LyricsDTO lyricsDTO = new LyricsDTO();
                lyricsDTO.setName(song.getName());
                lyricsDTO.setLyrics(song.getLyrics());
                LyricsDTO createdLyric = lyricsService.create(lyricsDTO);
                logger.info("Lyric {} created with ID {}", createdLyric.getName(), createdLyric.get_id());
                
                song.setAlbumId(createdAlbum.getData().getId());
                song.setLyricsId(createdLyric.get_id());
                song.setArtist(album.getArtist());

                logger.info("Creating {} song", song.getName());
                SongDTO createdSong = songsService.create(song);
                logger.info("Song {} created with ID {}", createdSong.getName(), createdSong.getId());               
            }
        }
    }
}