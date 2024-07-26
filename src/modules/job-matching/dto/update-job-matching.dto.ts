import { PartialType } from '@nestjs/mapped-types';
import { CreateJobMatchingDto } from './create-job-matching.dto';

export class UpdateJobMatchingDto extends PartialType(CreateJobMatchingDto) {}
