// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  rootDir: './',
  testEnvironment: 'jest-environment-jsdom', // Ensure jsdom is used
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Use <rootDir> to resolve paths correctly
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], // Correct case for <rootDir>
};

export default config;
