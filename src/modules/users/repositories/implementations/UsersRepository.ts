import { getRepository, Repository } from 'typeorm';
import { GamesRepository } from '../../../games/repositories/implementations/GamesRepository';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.findOneOrFail({ id: user_id }, { relations: ["games"] });
    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query("select * from users order by first_name asc");
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const query = `select * from users where LOWER(first_name)='${first_name.toLowerCase()}' and LOWER(last_name) = '${(last_name.toLowerCase())}'`
    return this.repository.query(query);
  }
}
