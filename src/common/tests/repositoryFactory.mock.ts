import { Repository } from 'typeorm';
import { MockType } from './mockType';

// @ts-ignore
export const repositoryFactoryMock: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
    count: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    update: jest.fn((entity) => entity),
    findAndCount: jest.fn((entity) => entity),
    find: jest.fn((entity) => entity),
    remove: jest.fn((entity) => entity),
    delete: jest.fn((entity) => entity),
  }),
);
