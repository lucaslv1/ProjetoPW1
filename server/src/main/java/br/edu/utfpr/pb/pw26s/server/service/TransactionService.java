package br.edu.utfpr.pb.pw26s.server.service;

import br.edu.utfpr.pb.pw26s.server.DTO.TransactionDTO;
import br.edu.utfpr.pb.pw26s.server.model.Transaction;
import org.springframework.stereotype.Service;

import java.util.List;

public interface TransactionService extends CrudService<Transaction, Long>{

    List<TransactionDTO> getTotals();
}
