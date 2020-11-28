package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
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

var collection *mongo.Collection

func main() {
	client, err := mongo.NewClient(options.Client().ApplyURI(fmt.Sprintf("mongodb://%s:%s@%s:27017/%s",
		os.Getenv("DB_USERNAME"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_NAME"))))

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

	collection = client.Database(os.Getenv("DB_NAME")).Collection("lyrics")

	r := mux.NewRouter()

	r.HandleFunc("/api/lyrics/{lyricsId}", getLyrics).Methods(http.MethodGet, http.MethodOptions)
	r.HandleFunc("/api/lyrics", createLyrics).Methods(http.MethodPost, http.MethodOptions).HeadersRegexp("Content-Type", "application/json")
	r.HandleFunc("/health", health).Methods(http.MethodGet, http.MethodOptions)

	r.Use(mux.CORSMethodMiddleware(r))

	srv := &http.Server{
		Addr:         "0.0.0.0:8080",
		WriteTimeout: time.Second * 15,
		ReadTimeout:  time.Second * 15,
		IdleTimeout:  time.Second * 60,
		Handler:      r,
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil {
			log.Println(err)
		}
	}()

	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)

	<-c

	srv.Shutdown(ctx)
	os.Exit(0)
}

func health(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	if r.Method == http.MethodOptions {
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"status": "UP"})
}

func getLyrics(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	if r.Method == http.MethodOptions {
		return
	}

	params := mux.Vars(r)
	id, _ := primitive.ObjectIDFromHex(params["lyricsId"])

	lyrics := Lyrics{}

	err := collection.FindOne(context.TODO(), bson.M{"_id": id}).Decode(&lyrics)

	if err != nil {
		log.Println(err)
	}

	w.Header().Set("content-type", "application/json")
	json.NewEncoder(w).Encode(lyrics)
}

func createLyrics(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	if r.Method == http.MethodOptions {
		return
	}

	lyrics := Lyrics{}

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&lyrics)

	if err != nil {
		panic(err)
	}
	defer r.Body.Close()

	result, err := collection.InsertOne(context.TODO(), lyrics)

	if err != nil {
		log.Fatal(err)
	}

	lyrics.Id = result.InsertedID.(primitive.ObjectID)

	w.Header().Set("content-type", "application/json")
	json.NewEncoder(w).Encode(lyrics)
}
