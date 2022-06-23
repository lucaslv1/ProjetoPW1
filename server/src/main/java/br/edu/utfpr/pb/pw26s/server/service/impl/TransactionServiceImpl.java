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

    @Override
    public Transaction save(Transaction entity)
    {
        Double total = 0.0;
        List<RelatorioMovimentacoesDTO> lists = movimentAccountsService.listRelatorioMovimentacoes();
        for(RelatorioMovimentacoesDTO rela : lists) {
            if(rela.getAccount() == entity.getAccount()){
                total = rela.getSaldo();
            }
        }
        try {
            if(entity.getValue() >= total || (entity.getTypeTransaction().name() == "Deposit") ) {
                return transactionRepository.save(entity);
            }
            throw new Exception();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public List<TransactionDTO> getTotals() {
        return null;
    }
}
