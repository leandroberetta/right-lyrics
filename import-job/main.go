package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"gopkg.in/yaml.v2"
)

type Data struct {
	Albums []struct {
		Title    string `yaml:"title"`
		Artist   string `yaml:"artist"`
		CoverUrl string `yaml:"coverUrl"`
		Year     string `yaml:"year"`
		Songs    []struct {
			Name   string `yaml:"name"`
			Lyrics string `yaml:"lyrics"`
		}
	} `yaml:"albums,flow"`
}

type AlbumCreateRequest struct {
	Title    string `json:"title"`
	Artist   string `json:"artist"`
	CoverUrl string `json:"coverUrl"`
	Year     string `json:"year"`
}

type AlbumCreateResponse struct {
	Data struct {
		Id       int    `json:"id"`
		Title    string `json:"title"`
		Artist   string `json:"artist"`
		CoverUrl string `json:"coverUrl"`
		Year     string `json:"year"`
	}
	Status int `json:"status"`
}

type LyricsCreateRequest struct {
	Name   string `json:"name"`
	Lyrics string `json:"lyrics"`
}

type LyricsCreateResponse struct {
	Id     string `json:"_id"`
	Name   string `json:"name"`
	Lyrics string `json:"lyrics"`
}

type SongCreateRequest struct {
	Id          string `json:"id"`
	Name        string `json:"name"`
	Artist      string `json:"artist"`
	LyricsId    string `json:"lyricsId"`
	AlbumId     int    `json:"albumId"`
	YouTubeLink string `json:"youtubeLink"`
}

type SongCreateResponse struct {
	Id          int    `json:"id"`
	Name        string `json:"name"`
	Artist      string `json:"artist"`
	LyricsId    string `json:"lyricsId"`
	AlbumId     int    `json:"albumId"`
	YouTubeLink string `json:"youtubeLink"`
}

func main() {
	data, err := unmarshalData(os.Getenv("DATA_FILE"))

	if err != nil {
		log.Fatalln(err)
	}

	importData(data)
}

func unmarshalData(file string) (*Data, error) {
	data := Data{}
	buffer, err := ioutil.ReadFile(file)

	if err != nil {
		log.Fatalln(err)
	}

	err = yaml.Unmarshal(buffer, &data)

	if err != nil {
		log.Fatalln(err)
	}

	return &data, err
}

func importData(data *Data) {
	for _, album := range data.Albums {
		log.Printf("Creating album %s", album.Title)
		albumId := createAlbum(album.Title, album.Artist, album.CoverUrl, album.Year)
		log.Printf("%s album created with id %d", album.Title, albumId)
		for _, song := range album.Songs {
			log.Printf("Creating lyrics for song %s", song.Name)
			lyricsId := createLyrics(song.Name, song.Lyrics)
			log.Printf("Lytics created with id %s", lyricsId)
			log.Printf("Creating song %s", song.Name)
			songId := createSong(song.Name, album.Artist, lyricsId, "", albumId)
			log.Printf("Song created with id %d", songId)
		}
	}
}

func createAlbum(title, artist, coverUrl, year string) int {
	albumCreateRequest := AlbumCreateRequest{}

	albumCreateRequest.Title = title
	albumCreateRequest.Artist = artist
	albumCreateRequest.CoverUrl = coverUrl
	albumCreateRequest.Year = year

	albumCreateRequestJson, err := json.Marshal(albumCreateRequest)

	if err != nil {
		log.Fatalln(err)
	}

	resp, err := http.Post(
		fmt.Sprintf("%s/api/albums/", os.Getenv("ALBUMS_SERVICE")),
		"application/json",
		bytes.NewReader(albumCreateRequestJson))

	if err != nil {
		log.Fatalln(err)
	}

	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	albumCreateResponse := AlbumCreateResponse{}

	err = json.Unmarshal(body, &albumCreateResponse)

	if err != nil {
		log.Fatalln(err)
	}

	return albumCreateResponse.Data.Id
}

func createLyrics(name, lyrics string) string {
	lyricsCreateRequest := LyricsCreateRequest{}

	lyricsCreateRequest.Name = name
	lyricsCreateRequest.Lyrics = lyrics

	lyricsCreateRequestJson, err := json.Marshal(lyricsCreateRequest)

	if err != nil {
		log.Fatalln(err)
	}

	resp, err := http.Post(
		fmt.Sprintf("%s/api/lyrics/", os.Getenv("LYRICS_SERVICE")),
		"application/json",
		bytes.NewReader(lyricsCreateRequestJson))
	if err != nil {
		log.Fatalln(err)
	}

	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	lyricsCreateResponse := LyricsCreateResponse{}

	err = json.Unmarshal(body, &lyricsCreateResponse)

	if err != nil {
		log.Fatalln(err)
	}

	return lyricsCreateResponse.Id
}

func createSong(name, artist, lyricsId, youTubeLink string, albumId int) int {
	songCreateRequest := SongCreateRequest{}

	songCreateRequest.Name = name
	songCreateRequest.Artist = artist
	songCreateRequest.LyricsId = lyricsId
	songCreateRequest.YouTubeLink = youTubeLink
	songCreateRequest.AlbumId = albumId

	songCreateRequestJson, err := json.Marshal(songCreateRequest)

	if err != nil {
		log.Fatalln(err)
	}

	resp, err := http.Post(
		fmt.Sprintf("%s/api/songs/", os.Getenv("SONGS_SERVICE")),
		"application/json",
		bytes.NewReader(songCreateRequestJson))

	if err != nil {
		log.Fatalln(err)
	}

	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	songCreateResponse := SongCreateResponse{}

	err = json.Unmarshal(body, &songCreateResponse)

	if err != nil {
		log.Fatalln(err)
	}

	return songCreateResponse.Id
}
