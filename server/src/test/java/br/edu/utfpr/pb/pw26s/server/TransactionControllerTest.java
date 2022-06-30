package br.edu.utfpr.pb.pw26s.server;

import br.edu.utfpr.pb.pw26s.server.enums.TypeAccount;
import br.edu.utfpr.pb.pw26s.server.enums.TypeTransaction;
import br.edu.utfpr.pb.pw26s.server.model.Account;
import br.edu.utfpr.pb.pw26s.server.model.Transaction;
import br.edu.utfpr.pb.pw26s.server.model.User;
import br.edu.utfpr.pb.pw26s.server.repository.AccountRepository;
import br.edu.utfpr.pb.pw26s.server.repository.TransactionRepository;
import br.edu.utfpr.pb.pw26s.server.repository.UserRepository;
import br.edu.utfpr.pb.pw26s.server.security.AuthenticationResponse;
import br.edu.utfpr.pb.pw26s.server.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.test.context.ActiveProfiles;

import java.io.IOException;
import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class TransactionControllerTest {

    public static final String API_TRANSACTIONS = "/transactions";
    private static final String URL_LOGIN = "/login";

    @Autowired
    TestRestTemplate testRestTemplate;

    @Autowired
    TransactionRepository transactionRepository;
    @Autowired
    AccountRepository accountRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    UserService userService;

    @BeforeEach
    public void cleanup() {
        transactionRepository.deleteAll();
        accountRepository.deleteAll();
        userRepository.deleteAll();
        testRestTemplate.getRestTemplate().getInterceptors().clear();
    }

    @Test
    public void postTransaction_whenTransactionIsValidAndUserNotLoggedIn_receiveUnauthorized() {
        Transaction transaction = createValidTransaction();
        ResponseEntity<Object> response = postTransaction(transaction, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    public void postTransaction_whenTransactionIsValidAndUserLoggedIn_receiveOk() {
        authenticate();
        Transaction transaction = createValidTransaction();
        ResponseEntity<Object> response = postTransaction(transaction, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void getTransaction_whenTransactionIdIsProvidedAndUserLoggedIn_receiveCategory() {
        authenticate();
        Transaction transaction = transactionRepository.save(createValidTransaction());
        ResponseEntity<List<Transaction>> list =
                getAllTransaction(new ParameterizedTypeReference<>() {});
        ResponseEntity<Transaction> response =
                getOneTransaction(list.getBody().get(0).getId(), Transaction.class);
        assertThat(response.getBody().getId()).isEqualTo(transaction.getId());
    }

    public <T> ResponseEntity<T> postTransaction(Object request,  Class<T> responseType) {
        return testRestTemplate.postForEntity(API_TRANSACTIONS, request, responseType);
    }

    public <T> ResponseEntity<T> getOneTransaction(Long id,  Class<T> responseType) {
        return testRestTemplate.exchange(API_TRANSACTIONS + "/" + id, HttpMethod.GET,null, responseType);
    }

    public <T> ResponseEntity<T> getAllTransaction(ParameterizedTypeReference<T> responseType) {
        authenticate();
        return testRestTemplate.exchange(API_TRANSACTIONS, HttpMethod.GET, null, responseType);
    }

    private void authenticate() {
        if (testRestTemplate.getRestTemplate().getInterceptors().size() == 0) {
            userService.save(getValidLoginUser());
            ResponseEntity<AuthenticationResponse> responseToken = testRestTemplate.postForEntity(URL_LOGIN, getValidLoginUser(), AuthenticationResponse.class);
            String accessToken = responseToken.getBody().getToken();

            testRestTemplate.getRestTemplate().getInterceptors().add(new ClientHttpRequestInterceptor() {
                @Override
                public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution) throws IOException, IOException {
                    request.getHeaders().add("Authorization", "Bearer " + accessToken);
                    request.getHeaders().setContentType(MediaType.APPLICATION_JSON);
                    return execution.execute(request, body);
                }
            });
        }
    }

    private Account createValidAccount() {
        Account account = new Account();
        account.setNumber(Long.valueOf(1234));
        account.setBank("test-account");
        account.setTypeAccount(TypeAccount.CC);
        account.setUser(userRepository.save(getValidLoginUser()));
        return account;
    }

    private Transaction createValidTransaction() {
        Transaction transaction = new Transaction();
        transaction.setCategory("test-transaction-category");
        transaction.setDescription("test-transaction-description");
        transaction.setValue(50.00);
        transaction.setAccount(accountRepository.save(createValidAccount()));
        transaction.setTypeTransaction(TypeTransaction.Deposit);
        transaction.setDueDate(new Date());
        return transaction;
    }

    public User getValidLoginUser() {
        User user = new User();
        user.setUsername("test-user");
        user.setPassword("P4ssword");
        return user;
    }
}
