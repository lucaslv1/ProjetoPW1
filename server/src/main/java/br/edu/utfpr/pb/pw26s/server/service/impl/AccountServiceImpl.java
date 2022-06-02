package br.edu.utfpr.pb.pw26s.server.service.impl;

import br.edu.utfpr.pb.pw26s.server.model.Account;
import br.edu.utfpr.pb.pw26s.server.repository.AccountRepository;
import br.edu.utfpr.pb.pw26s.server.repository.UserRepository;
import br.edu.utfpr.pb.pw26s.server.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AccountServiceImpl extends CrudServiceImpl<Account, Long>
    implements AccountService {

    private final AccountRepository accountRepository;

    private final UserRepository userRepository;

    public AccountServiceImpl(@Autowired AccountRepository accountRepository, @Autowired  UserRepository userRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    @Override
    protected JpaRepository<Account, Long> getRepository() {
        return this.accountRepository;
    }

    @Override
    public Account save(Account entity) {
        entity.setUser(userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName()));
        return super.save(entity);
    }
}
