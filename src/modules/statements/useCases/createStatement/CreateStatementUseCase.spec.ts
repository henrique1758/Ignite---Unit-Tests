import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "./CreateStatementController";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

import UserNotFound = CreateStatementError.UserNotFound;
import InsufficientFunds = CreateStatementError.InsufficientFunds;

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  })

  it("should not be able to create a statement if user does not exists!", async () => {
    await expect(
      createStatementUseCase.execute({
        amount: 12,
        description: "deposit",
        type: OperationType.DEPOSIT,
        user_id: "jashjshusyd1267162"
      })
    ).rejects.toBeInstanceOf(UserNotFound);
  });

  it("should not be able to withdraw if the amount is greater than the balance", async () => {
    const user = await createUserUseCase.execute({
      name: "user 3",
      email: "user3@gmail.com",
      password: "123456"
    });

    await createStatementUseCase.execute({
      amount: 36,
      description: "deposit",
      type: OperationType.DEPOSIT,
      user_id: user.id as string
    });

    await expect(
      createStatementUseCase.execute({
        amount: 48,
        description: "deposit",
        type: OperationType.WITHDRAW,
        user_id: user.id as string
      })
    ).rejects.toBeInstanceOf(InsufficientFunds);
  });

  it("should be able to create a statement", async () => {
    const user = await createUserUseCase.execute({
      name: "user 4",
      email: "user4@gmail.com",
      password: "12345"
    });

    const result = await createStatementUseCase.execute({
      amount: 32,
      description: "deposit",
      type: OperationType.DEPOSIT,
      user_id: user.id as string
    });

    expect(result).toHaveProperty("id")
  });
})
