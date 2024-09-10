import { setSeederFactory } from 'typeorm-extension';
import { User } from '../users/entities/user.entity';

export const UserFactory = setSeederFactory(User, (faker) => {
  const user = new User();
  user.email = faker.internet.email();
  user.username = faker.person.fullName();
  user.password = faker.internet.password();
  user.address = faker.location.city();
  return user;
});
