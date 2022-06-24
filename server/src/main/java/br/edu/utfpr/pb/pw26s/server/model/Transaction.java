package br.edu.utfpr.pb.pw26s.server.model;

import br.edu.utfpr.pb.pw26s.server.enums.TypeTransaction;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = {"id"})
public class Transaction {

    @Id
    @GeneratedValue
    private Long id;

    @NotNull
    private Double value;

    @NotNull
    private Date dueDate;

    @NotNull
    @Size(min = 2, max = 50)
    private String category;

    @Size(min = 2, max = 150)
    private String description;

    @NotNull
    private TypeTransaction typeTransaction;

    @ManyToOne
    @JoinColumn(name= "account_number", referencedColumnName = "number")
    private Account account;

    @ManyToOne
    @JoinColumn(name= "accountD_number")
    private Account accountD;

}
