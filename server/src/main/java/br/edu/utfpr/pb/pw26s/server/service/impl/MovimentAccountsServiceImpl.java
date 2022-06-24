package br.edu.utfpr.pb.pw26s.server.service.impl;

import br.edu.utfpr.pb.pw26s.server.DTO.RelatorioMovimentacoesDTO;
import br.edu.utfpr.pb.pw26s.server.DTO.TransactionDTO;
import br.edu.utfpr.pb.pw26s.server.enums.TypeTransaction;
import br.edu.utfpr.pb.pw26s.server.model.Account;
import br.edu.utfpr.pb.pw26s.server.model.Transaction;
import br.edu.utfpr.pb.pw26s.server.model.User;
import br.edu.utfpr.pb.pw26s.server.repository.AccountRepository;
import br.edu.utfpr.pb.pw26s.server.repository.TransactionRepository;
import br.edu.utfpr.pb.pw26s.server.repository.UserRepository;
import br.edu.utfpr.pb.pw26s.server.service.MovimentAccountService;
import br.edu.utfpr.pb.pw26s.server.service.TransactionService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MovimentAccountsServiceImpl implements MovimentAccountService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public MovimentAccountsServiceImpl(@Autowired TransactionRepository transactionRepository,
                                       @Autowired AccountRepository accountRepository,
                                       @Autowired UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    /*

    @Override
    public List<Transaction> listByType(TypeTransaction typeTransaction) {

        List<Transaction> lt = transactionRepository.findAll();
        TesteDTO tDto = new TesteDTO();
        tDto.setN1(lt.stream()
                .filter(o -> o.getTypeTransaction() == TypeTransaction.Withdraw)
                .mapToDouble(TransactionDTO -> TransactionDTO.getValue())
                .sum());

        return transactionRepository.findAllByTypeTransaction(TypeTransaction.Transfer);
    }

     */
    //CRIAR UM SERVICE PARA CALCULAR A DIFERENÇA ENTRE ENTRADAS E SAIDAS

    public List<TransactionDTO> getTransactionsTotal(){
        return transactionRepository.getTotals();
    }

    /*public Double calcInputsAndOuts(List<TransactionDTO> t){

        t.map()

        return null;
    }*/



    public List<RelatorioMovimentacoesDTO> listRelatorioMovimentacoes(){

        User user = userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        List<Account> accounts = accountRepository.findAllByUserId(user.getId());

        RelatorioMovimentacoesDTO relatorioMovimentacoes ;

        List<Transaction> transactionList = transactionRepository.findAll();

        List<RelatorioMovimentacoesDTO> listRela = new ArrayList<>();

        for (Account acc: accounts) {
            relatorioMovimentacoes = new RelatorioMovimentacoesDTO();
            relatorioMovimentacoes.setAccount(acc);
            relatorioMovimentacoes.setSaldo(
                    transactionList.stream() .filter(o ->
                                    (o.getAccount().equals(acc) && o.getTypeTransaction() == TypeTransaction.Deposit)
                            )
                            .mapToDouble(t -> t.getValue())
                            .sum()
                            -
                            transactionList.stream().filter(o ->
                                    (o.getAccount().equals(acc) && o.getTypeTransaction() == TypeTransaction.Withdraw)
                            )
                            .mapToDouble(t -> t.getValue())
                            .sum()
                            -
                            transactionList.stream().filter(o ->
                                    (o.getAccount().equals(acc) && o.getTypeTransaction() == TypeTransaction.Transfer)
                            ).mapToDouble(t -> t.getValue())
                                    .sum()
                            +
                            transactionList.stream().filter(o ->
                                            (o.getAccountD() != null && o.getAccountD().equals(acc) && o.getTypeTransaction() == TypeTransaction.Transfer)
                                    ).mapToDouble(t -> t.getValue())
                                    .sum()
                            -
                            transactionList.stream().filter(o ->
                                            (o.getAccount().equals(acc) && o.getTypeTransaction() == TypeTransaction.Payment)
                                    ).mapToDouble(t -> t.getValue())
                                    .sum()
                            +
                            transactionList.stream().filter(o ->
                                            (o.getAccountD() != null && o.getAccountD().equals(acc) && o.getTypeTransaction() == TypeTransaction.Payment)
                                    ).mapToDouble(t -> t.getValue())
                                    .sum()
                            -
                            transactionList.stream().filter(o ->
                                            (o.getAccount().equals(acc) && o.getTypeTransaction() == TypeTransaction.Pix)
                                    ).mapToDouble(t -> t.getValue())
                                    .sum()
                            +
                            transactionList.stream().filter(o ->
                                            (o.getAccountD() != null && o.getAccountD().equals(acc) && o.getTypeTransaction() == TypeTransaction.Pix)
                                    ).mapToDouble(t -> t.getValue())
                                    .sum()
                            -
                            transactionList.stream().filter(o ->
                                            (o.getAccount().equals(acc) && o.getTypeTransaction() == TypeTransaction.DebitPayment)
                                    ).mapToDouble(t -> t.getValue())
                                    .sum()
                            +
                            transactionList.stream().filter(o ->
                                            (o.getAccountD() != null && o.getAccountD().equals(acc) && o.getTypeTransaction() == TypeTransaction.DebitPayment)
                                    ).mapToDouble(t -> t.getValue())
                                    .sum()
                            -
                            transactionList.stream().filter(o ->
                                            (o.getAccount().equals(acc) && o.getTypeTransaction() == TypeTransaction.CreditPayment)
                                    ).mapToDouble(t -> t.getValue())
                                    .sum()
                            +
                            transactionList.stream().filter(o ->
                                            (o.getAccountD() != null && o.getAccountD().equals(acc) && o.getTypeTransaction() == TypeTransaction.CreditPayment)
                                    ).mapToDouble(t -> t.getValue())
                                    .sum()

            );
            listRela.add(relatorioMovimentacoes);
        }


        return listRela;
    }

}
