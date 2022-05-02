import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "../createStatement/CreateStatementController";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );

    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  })

  it("should not be able to get statement operation if user does not exists", async () => {
    const user = await createUserUseCase.execute({
      name: "user 6",
      email: "user6@gmail.com",
      password: "12345"
    });

    const statement = await createStatementUseCase.execute({
      amount: 35,
      description: "deposit",
      type: OperationType.DEPOSIT,
      user_id: user.id as string
    });

    await expect(
      getStatementOperationUseCase.execute({ user_id: "ashjaj2623623", statement_id: statement.id as string })
    ).rejects.toEqual(new GetStatementOperationError.UserNotFound());
  });

  it("should not be able to get statement operation if statement does not exists", async () => {
    const user = await createUserUseCase.execute({
      name: "user 7",
      email: "user7@gmail.com",
      password: "12345"
    });

    await expect(
      getStatementOperationUseCase.execute({ user_id: user.id as string, statement_id: "skjsdjsd23236" })
    ).rejects.toEqual(new GetStatementOperationError.StatementNotFound());
  });

  it("should be able to get statment operation", async () => {
    const user = await createUserUseCase.execute({
      name: "user 8",
      email: "user8@gmail.com",
      password: "12345"
    });

    const statement = await createStatementUseCase.execute({
      amount: 35,
      description: "deposit",
      type: OperationType.DEPOSIT,
      user_id: user.id as string
    });

    const result = await getStatementOperationUseCase.execute({
      user_id: String(user.id),
      statement_id: String(statement.id)
    });

    expect(result).toBeInstanceOf(Statement);
  });
})
