import { Test, TestingModule } from '@nestjs/testing';
import { UserexamdraftService } from './userexamdraft.service';

describe('UserexamdraftService', () => {
  let service: UserexamdraftService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserexamdraftService],
    }).compile();

    service = module.get<UserexamdraftService>(UserexamdraftService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
