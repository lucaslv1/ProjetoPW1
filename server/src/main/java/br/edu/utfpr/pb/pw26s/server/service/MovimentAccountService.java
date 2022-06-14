package br.edu.utfpr.pb.pw26s.server.service;

import br.edu.utfpr.pb.pw26s.server.DTO.TransactionDTO;
import br.edu.utfpr.pb.pw26s.server.enums.TypeTransaction;
import br.edu.utfpr.pb.pw26s.server.model.Transaction;

import java.util.List;

public interface MovimentAccountService {

    List<TransactionDTO> getTransactionsTotal();
}