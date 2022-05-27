package br.edu.utfpr.pb.pw26s.server.controller;

import br.edu.utfpr.pb.pw26s.server.model.Account;
import br.edu.utfpr.pb.pw26s.server.service.AccountService;
import br.edu.utfpr.pb.pw26s.server.service.CrudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("accounts")
public class AccountController extends CrudController<Account, Long> {

    @Autowired
    private AccountService accountService;

    @Override
    protected CrudService<Account, Long> getService() {return this.accountService;}
}
