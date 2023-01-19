export type RepoMock<T> = {
  [P in keyof T]?: jest.Mock<any>;
};
