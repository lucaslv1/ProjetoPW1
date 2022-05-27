package br.edu.utfpr.pb.pw26s.server.model;

import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(of = {"number"})
public class Account {

    @Id
    @GeneratedValue
    private Long number;

    @NotNull
    private Integer agency;

    @NotNull
    @Size(min = 2, max = 30)
    private String bank;

    @NotNull
    private enum type {CC, CP, C};

    @OneToOne
    @JoinColumn(name= "user_id", referencedColumnName = "id")
    private User user;

}
