package br.edu.utfpr.pb.pw26s.server;

import br.edu.utfpr.pb.pw26s.server.enums.TypeAccount;
import br.edu.utfpr.pb.pw26s.server.model.Account;
import br.edu.utfpr.pb.pw26s.server.model.User;
import br.edu.utfpr.pb.pw26s.server.repository.AccountRepository;
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
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class AccountControllerTest {
    public static final String API_ACCOUNTS = "/accounts";
    private static final String URL_LOGIN = "/login";

    @Autowired
    TestRestTemplate testRestTemplate;

    @Autowired
    AccountRepository accountRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    UserService userService;

    @BeforeEach
    public void cleanup() {
        userRepository.deleteAll();
        accountRepository.deleteAll();
        testRestTemplate.getRestTemplate().getInterceptors().clear();
    }

    @Test
    public void postAccount_whenAccountIsValidAndUserNotLoggedIn_receiveUnauthorized() {
        Account account = createValidAccount();
        ResponseEntity<Object> response = postAccount(account, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    public void postAccount_whenAccountIsValidAndUserLoggedIn_receiveOk() {
        authenticate();
        Account account = createValidAccount();
        ResponseEntity<Object> response = postAccount(account, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void getAccount_whenAccountIdIsProvidedAndUserLoggedIn_receiveAccount() {
        authenticate();
        Account account = accountRepository.save(createValidAccount());
        ResponseEntity<List<Account>> accountList =
                getAllAccounts(new ParameterizedTypeReference<>() {});
        ResponseEntity<Account> response =
                getOneAccount(accountList.getBody().get(0).getNumber(), Account.class);
        assertThat(response.getBody().getNumber()).isEqualTo(account.getNumber());
    }

    public <T> ResponseEntity<T> postAccount(Object request,  Class<T> responseType) {
        return testRestTemplate.postForEntity(API_ACCOUNTS, request, responseType);
    }

    public <T> ResponseEntity<T> getOneAccount(Long id,  Class<T> responseType) {
            return testRestTemplate.exchange(API_ACCOUNTS + "/" + id, HttpMethod.GET,null, responseType);
    }

    public <T> ResponseEntity<T> getAllAccounts(ParameterizedTypeReference<T> responseType) {
        authenticate();
        return testRestTemplate.exchange(API_ACCOUNTS, HttpMethod.GET, null, responseType);
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

    public User getValidLoginUser() {
        User user = new User();
        user.setUsername("test-user");
        user.setPassword("P4ssword");
        return user;
    }

    private Account createValidAccount() {
        Account account = new Account();
        account.setNumber(Long.valueOf(1234));
        account.setBank("test-account");
        account.setTypeAccount(TypeAccount.CC);
        account.setUser(userRepository.save(getValidLoginUser()));
        return account;
    }
}
