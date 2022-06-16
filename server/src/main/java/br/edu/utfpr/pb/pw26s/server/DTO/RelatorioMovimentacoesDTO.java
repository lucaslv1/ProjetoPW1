package br.edu.utfpr.pb.pw26s.server.DTO;

import br.edu.utfpr.pb.pw26s.server.model.Account;
import lombok.Data;

@Data
public class RelatorioMovimentacoesDTO {

    double saldo;
    Account account;

}
