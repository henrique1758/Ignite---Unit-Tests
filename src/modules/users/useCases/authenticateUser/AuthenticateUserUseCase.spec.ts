import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  })

  it("should not be possible to access the account if the email or password is wrong", async () => {
    await createUserUseCase.execute({
      name: "henrique monteiro",
      email: "henriquemonteiro037@gmail.com",
      password: "123456"
    });

    await expect(
      authenticateUserUseCase.execute({
        email: "henriquemonteiro714@gmail.com",
        password: "123456",
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

  it("should not be possible to access the account if the email or password is wrong", async () => {
    await createUserUseCase.execute({
      name: "henrique monteiro",
      email: "henriquemonteiro000@gmail.com",
      password: "1234"
    });

    await expect(
      authenticateUserUseCase.execute({
        email: "henriquemonteiro000@gmail.com",
        password: "1234",
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

  it("should be able to authenticate an user", async () => {
    const user = {
      name: "henrique monteiro",
      email: "henriquemonteiro999@gmail.com",
      password: "123"
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });

    expect(result).toHaveProperty("user");
  });
})
