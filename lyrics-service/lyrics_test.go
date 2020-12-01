package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	gomock "github.com/golang/mock/gomock"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func TestMongoDBConnectionString(t *testing.T) {
	expected := "mongodb://rl:rl@localhost:27017/rl"

	os.Setenv("DB_USERNAME", "rl")
	os.Setenv("DB_PASSWORD", "rl")
	os.Setenv("DB_HOST", "localhost")
	os.Setenv("DB_NAME", "rl")

	if got := getMongoDBConnectionURI(); got != expected {
		t.Errorf("Wrong connection URI: Expected %s - Got %s", expected, got)
	}

}

func TestHealthRequest(t *testing.T) {
	req, err := http.NewRequest("GET", "/health", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(health)

	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	expected := map[string]string{"status": "UP"}
	var got = map[string]string{}

	decoder := json.NewDecoder(rr.Body)
	err = decoder.Decode(&got)

	if got["status"] != expected["status"] {
		t.Errorf("health returned unexpected response: expected %s got %s", expected, got)
	}
}

func TestHealthCORS(t *testing.T) {
	req, err := http.NewRequest("OPTIONS", "/health", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(health)

	handler.ServeHTTP(rr, req)

	expected := "*"
	got := rr.Result().Header["Access-Control-Allow-Origin"]
	if got[0] != expected {
		t.Errorf("health CORS error: expected %s got %s", expected, got)
	}
}

func TestGetLyrics(t *testing.T) {
	req, err := http.NewRequest("GET", "/api/lyrics/5fc3d66fecc9a3f610ed7993", nil)
	if err != nil {
		t.Fatal(err)
	}

	ctrl := gomock.NewController(t)

	m := NewMockLyricsRepository(ctrl)

	id, _ := primitive.ObjectIDFromHex("5fc3d66fecc9a3f610ed7993")

	expected := Lyrics{Id: id, Name: "Even flow", Lyrics: ""}

	m.EXPECT().GetLyrics("5fc3d66fecc9a3f610ed7993").Return(expected)

	lyricsRepository := m
	lyricsService := LyricsService{Repository: lyricsRepository}

	rr := httptest.NewRecorder()

	router := mux.NewRouter()
	router.HandleFunc("/api/lyrics/{lyricsId}", lyricsService.getLyrics)
	router.ServeHTTP(rr, req)

	got := Lyrics{}
	decoder := json.NewDecoder(rr.Body)
	err = decoder.Decode(&got)

	if got != expected {
		t.Errorf("getLyrics returned unexpected response: expected %s got %s", expected, got)
	}
}

func TestGetLyricsCORS(t *testing.T) {
	req, err := http.NewRequest("OPTIONS", "/api/lyrics/id", nil)
	if err != nil {
		t.Fatal(err)
	}

	lyricsService := LyricsService{}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(lyricsService.getLyrics)

	handler.ServeHTTP(rr, req)

	expected := "*"
	got := rr.Result().Header["Access-Control-Allow-Origin"]
	if got[0] != expected {
		t.Errorf("getLyrics CORS error: expected %s got %s", expected, got)
	}
	got = rr.Result().Header["Access-Control-Allow-Headers"]
	if got[0] != expected {
		t.Errorf("getLyrics CORS error: expected %s got %s", expected, got)
	}
}

func TestCreateLyrics(t *testing.T) {
	newLyrics := Lyrics{Name: "Even flow", Lyrics: ""}
	newLyricsJson, _ := json.Marshal(newLyrics)
	req, err := http.NewRequest("POST", "/api/lyrics", bytes.NewReader(newLyricsJson))
	if err != nil {
		t.Fatal(err)
	}

	ctrl := gomock.NewController(t)
	m := NewMockLyricsRepository(ctrl)

	id, _ := primitive.ObjectIDFromHex("5fc3d66fecc9a3f610ed7993")
	expected := newLyrics
	expected.Id = id

	m.EXPECT().CreateLyrics(newLyrics).Return(expected)

	lyricsRepository := m
	lyricsService := LyricsService{Repository: lyricsRepository}

	rr := httptest.NewRecorder()
	router := mux.NewRouter()
	router.HandleFunc("/api/lyrics", lyricsService.createLyrics)
	router.ServeHTTP(rr, req)

	got := Lyrics{}
	decoder := json.NewDecoder(rr.Body)
	err = decoder.Decode(&got)
	fmt.Println(got)
	if got != expected {
		t.Errorf("createLyrics returned unexpected response: expected %s got %s", expected, got)
	}
}

func TestCreateLyricsCORS(t *testing.T) {
	req, err := http.NewRequest("OPTIONS", "/api/lyrics", nil)
	if err != nil {
		t.Fatal(err)
	}

	lyricsService := LyricsService{}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(lyricsService.createLyrics)

	handler.ServeHTTP(rr, req)

	expected := "*"
	got := rr.Result().Header["Access-Control-Allow-Origin"]
	if got[0] != expected {
		t.Errorf("createLyrics CORS error: expected %s got %s", expected, got)
	}
	got = rr.Result().Header["Access-Control-Allow-Headers"]
	if got[0] != expected {
		t.Errorf("getLyrics CORS error: expected %s got %s", expected, got)
	}
}
