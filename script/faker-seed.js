import { faker } from "@faker-js/faker";

const createRandomUser = () => {
  return {
    id: faker.string.uuid(),
    username: faker.internet.username(),
    rate: Math.round(Math.random() * 5),
    createdAt: faker.date.past(),
    comment: faker.lorem.paragraph(),
  };
};

const users = faker.helpers.multiple(createRandomUser, {
  count: 5,
});

export default users;
