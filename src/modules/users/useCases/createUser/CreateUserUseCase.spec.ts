import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to create a new user", async () => {
    const result = await createUserUseCase.execute({
      name: "carlos henrique",
      email: "henriquemonteiro942@gmail.com",
      password: "herozero10"
    });

    expect(result).toBeInstanceOf(User);
  });

  it("should not be able to create a new user with an existent email", async () => {
    await createUserUseCase.execute({
      name: "carlos henrique",
      email: "henriquemonteiro714@gmail.com",
      password: "herozero10"
    });

    await expect(
      createUserUseCase.execute({
        name: "carlos henrique",
        email: "henriquemonteiro714@gmail.com",
        password: "herozero10"
      })
    ).rejects.toEqual(new CreateUserError());
  })
});
