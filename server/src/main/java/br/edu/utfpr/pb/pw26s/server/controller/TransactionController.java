package br.edu.utfpr.pb.pw26s.server.controller;

import br.edu.utfpr.pb.pw26s.server.DTO.TransactionDTO;
import br.edu.utfpr.pb.pw26s.server.model.Transaction;
import br.edu.utfpr.pb.pw26s.server.service.CrudService;
import br.edu.utfpr.pb.pw26s.server.service.MovimentAccountService;
import br.edu.utfpr.pb.pw26s.server.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("transactions")
public class TransactionController extends CrudController<Transaction, Long> {

    private final TransactionService transactionService;

    private final MovimentAccountService movimentAccountService;

    public TransactionController(@Autowired TransactionService transactionService, @Autowired  MovimentAccountService movimentAccountService) {
        this.transactionService = transactionService;
        this.movimentAccountService = movimentAccountService;
    }

    @Override
    protected CrudService<Transaction, Long> getService() {return this.transactionService; }

    @GetMapping("total")
    public List<TransactionDTO> getTransactionsTotal(){
        return movimentAccountService.getTransactionsTotal();
    }

}
