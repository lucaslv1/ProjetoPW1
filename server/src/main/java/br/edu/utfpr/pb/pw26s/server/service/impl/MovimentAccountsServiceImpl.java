package br.edu.utfpr.pb.pw26s.server.service.impl;

import br.edu.utfpr.pb.pw26s.server.DTO.TransactionDTO;
import br.edu.utfpr.pb.pw26s.server.enums.TypeTransaction;
import br.edu.utfpr.pb.pw26s.server.model.Account;
import br.edu.utfpr.pb.pw26s.server.model.Transaction;
import br.edu.utfpr.pb.pw26s.server.repository.TransactionRepository;
import br.edu.utfpr.pb.pw26s.server.service.MovimentAccountService;
import br.edu.utfpr.pb.pw26s.server.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.stream.Collectors;


public class MovimentAccountsServiceImpl implements MovimentAccountService {

    private final TransactionRepository transactionRepository;

    public MovimentAccountsServiceImpl(@Autowired TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    /*

    @Override
    public List<Transaction> listByType(TypeTransaction typeTransaction) {

        List<Transaction> lt = transactionRepository.findAll();
        TesteDTO tDto = new TesteDTO();
        tDto.setN1(lt.stream()
                .filter(o -> o.getTypeTransaction() == TypeTransaction.Withdraw)
                .mapToDouble(Transaction -> Transaction.getValue())
                .sum());

        return transactionRepository.findAllByTypeTransaction(TypeTransaction.Transfer);
    }

     */
    //CRIAR UM SERVICE PARA CALCULAR A DIFERENÇA ENTRE ENTRADAS E SAIDAS

    public List<TransactionDTO> getTransactionsTotal(){
        return transactionRepository.getTotals();
    }

}
