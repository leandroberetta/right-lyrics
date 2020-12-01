package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Lyrics struct {
	Id     primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Name   string             `json:"name" bson:"name"`
	Lyrics string             `json:"lyrics" bson:"lyrics"`
}

type LyricsRepository interface {
	GetLyrics(id string) Lyrics
	CreateLyrics(lyrics Lyrics) Lyrics
}

type LyricsMongoRepository struct {
	Collection *mongo.Collection
}

func (lyricsRepository LyricsMongoRepository) GetLyrics(id string) Lyrics {
	lyrics := Lyrics{}
	oid, _ := primitive.ObjectIDFromHex(id)
	err := lyricsRepository.Collection.FindOne(context.TODO(), bson.M{"_id": oid}).Decode(&lyrics)
	if err != nil {
		log.Fatal(err)
	}
	return lyrics
}

func (lyricsRepository LyricsMongoRepository) CreateLyrics(lyrics Lyrics) Lyrics {
	result, err := lyricsRepository.Collection.InsertOne(context.TODO(), lyrics)
	if err != nil {
		log.Fatal(err)
	}
	lyrics.Id = result.InsertedID.(primitive.ObjectID)
	return lyrics
}

type LyricsService struct {
	Repository LyricsRepository
}

func (lyricsService *LyricsService) getLyrics(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "*")
	if r.Method == http.MethodOptions {
		return
	}
	params := mux.Vars(r)
	lyrics := lyricsService.Repository.GetLyrics(params["lyricsId"])
	w.Header().Set("content-type", "application/json")
	json.NewEncoder(w).Encode(lyrics)
}

func (lyricsService *LyricsService) createLyrics(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "*")
	if r.Method == http.MethodOptions {
		return
	}
	lyrics := Lyrics{}
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&lyrics)
	if err != nil {
		log.Fatal(err)
	}
	defer r.Body.Close()
	lyrics = lyricsService.Repository.CreateLyrics(lyrics)
	w.Header().Set("content-type", "application/json")
	json.NewEncoder(w).Encode(lyrics)
}

func main() {
	client, err := mongo.NewClient(options.Client().ApplyURI(getMongoDBConnectionURI()))

	if err != nil {
		log.Fatal(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = client.Connect(ctx)

	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(ctx)

	collection := client.Database(os.Getenv("DB_NAME")).Collection("lyrics")

	lyricsRepository := LyricsMongoRepository{Collection: collection}
	lyricsService := LyricsService{Repository: lyricsRepository}

	r := mux.NewRouter()

	r.HandleFunc("/api/lyrics/{lyricsId}", lyricsService.getLyrics).Methods(http.MethodGet, http.MethodOptions)
	r.HandleFunc("/api/lyrics", lyricsService.createLyrics).Methods(http.MethodPost, http.MethodOptions).HeadersRegexp("Content-Type", "application/json")
	r.HandleFunc("/health", health).Methods(http.MethodGet, http.MethodOptions)

	r.Use(mux.CORSMethodMiddleware(r))

	log.Fatal(http.ListenAndServe(":8080", r))
}

func getMongoDBConnectionURI() string {
	uri := fmt.Sprintf("mongodb://%s:%s@%s:27017/%s",
		os.Getenv("DB_USERNAME"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_NAME"))

	return uri
}

func health(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	if r.Method == http.MethodOptions {
		return
	}
	w.Header().Set("content-type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "UP"})
}
