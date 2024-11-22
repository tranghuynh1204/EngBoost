import { Test, TestingModule } from '@nestjs/testing';
import { UserexamdraftController } from './userexamdraft.controller';
import { UserexamdraftService } from './userexamdraft.service';

describe('UserexamdraftController', () => {
  let controller: UserexamdraftController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserexamdraftController],
      providers: [UserexamdraftService],
    }).compile();

    controller = module.get<UserexamdraftController>(UserexamdraftController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
