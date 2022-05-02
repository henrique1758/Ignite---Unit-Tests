import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "../createStatement/CreateStatementController";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  })

  it("should not be able to get balance if user does not exists", async () => {
    await expect(
      getBalanceUseCase.execute({ user_id: "ashjaj2623623" })
    ).rejects.toEqual(new GetBalanceError());
  });

  it("should be able to get balance of an user", async () => {
    const user = await createUserUseCase.execute({
      name: "user 5",
      email: "user5@gmail.com",
      password: "12345"
    });

    await inMemoryStatementsRepository.create({
      amount: 35,
      description: "deposit",
      type: OperationType.DEPOSIT,
      user_id: user.id as string
    });

    const result = await getBalanceUseCase.execute({
      user_id: user.id as string
    });

    expect(result).toHaveProperty("balance")
  });
})
