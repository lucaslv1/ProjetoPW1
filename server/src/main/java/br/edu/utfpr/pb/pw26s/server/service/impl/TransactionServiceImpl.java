package br.edu.utfpr.pb.pw26s.server.service.impl;

import br.edu.utfpr.pb.pw26s.server.DTO.RelatorioMovimentacoesDTO;
import br.edu.utfpr.pb.pw26s.server.DTO.TransactionDTO;
import br.edu.utfpr.pb.pw26s.server.model.Transaction;
import br.edu.utfpr.pb.pw26s.server.repository.TransactionRepository;
import br.edu.utfpr.pb.pw26s.server.service.TransactionService;
import net.bytebuddy.implementation.bytecode.Throw;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.lang.reflect.Executable;
import java.util.List;

@Service
public class TransactionServiceImpl extends CrudServiceImpl<Transaction, Long>
    implements TransactionService {

    private TransactionRepository transactionRepository;

    private MovimentAccountsServiceImpl movimentAccountsService;

    public TransactionServiceImpl(@Autowired TransactionRepository transactionRepository, @Autowired MovimentAccountsServiceImpl movimentAccountsService) {
        this.transactionRepository = transactionRepository;
        this.movimentAccountsService = movimentAccountsService;
    }

    @Override
    protected JpaRepository<Transaction, Long> getRepository() {
        return this.transactionRepository;
    }

    public Transaction saveTransaction(Transaction entity) throws Exception {
        Double total = 0.0;
        List<RelatorioMovimentacoesDTO> lists = movimentAccountsService.listRelatorioMovimentacoes();
        for(RelatorioMovimentacoesDTO rela : lists) {
            if(rela.getAccount() == entity.getAccount()){
                total = rela.getSaldo();
            }
        }
        if(entity.getTypeTransaction().name() == "Deposit") {
            return transactionRepository.save(entity);
        }
        else if(entity.getValue() >= total) {
            return transactionRepository.save(entity);
        } else {
            throw new Exception("Deu ruim no saldo!");
        }
/*
        if(entity.getAccount().getTypeAccount().name() == "C") {
            if(entity.getTypeTransaction().name() == "DebitPayment") {
                return transactionRepository.save(entity);
            } else if(entity.getTypeTransaction().name() == "CreditPayment") {
                return transactionRepository.save(entity);
            }
        } else if (entity.getAccount().getTypeAccount().name() == "CC") {

        }

 */
    }

    @Override
    public List<TransactionDTO> getTotals() {
        return null;
    }
}
