package br.edu.utfpr.pb.pw26s.server.repository;

import br.edu.utfpr.pb.pw26s.server.DTO.TransactionDTO;
import br.edu.utfpr.pb.pw26s.server.enums.TypeTransaction;
import br.edu.utfpr.pb.pw26s.server.model.Transaction;
import br.edu.utfpr.pb.pw26s.server.security.UserDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("SELECT new br.edu.utfpr.pb.pw26s.server.DTO.TransactionDTO(t.account, t.typeTransaction, SUM(t.value)) " +
            "FROM Transaction t " +
            "GROUP BY t.account, t.typeTransaction")
    List<TransactionDTO> getTotals();

}
