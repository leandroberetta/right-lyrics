package io.veicot.rightlyrics.model;

import javax.persistence.Entity;
import javax.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@Data
@AllArgsConstructor
public class Song {

    @Id
    private Long id;

    public Song() {
    }
}
