import { IsOptional, IsString, MaxLength, Min } from 'class-validator';
import * as dayjs from 'dayjs';
import { Between, LessThan, MoreThan } from 'typeorm';

import { BadRequestException } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export abstract class BaseDTO {
  public get filter(): Record<any, any> {
    this.parseFilters();

    return this._filter;
  }

  protected _filter: Record<any, any> = {};

  protected parseFilters(): void {
    return;
  }

  public addFilter(data: Record<any, any>): void {
    Object.assign(this._filter, data);
  }
}

export class PaginationDTO extends BaseDTO {
  @ApiPropertyOptional({
    example: 0,
  })
  @IsOptional()
  @Min(0)
  offset: number;

  @ApiProperty({
    example: 10,
  })
  @IsOptional()
  @Min(0)
  limit: number;

  @ApiProperty({
    example: '-createdAt',
  })
  @MaxLength(60)
  @IsOptional()
  sort?: string;
}

export class PaginatedDateTimeDTO extends PaginationDTO {
  protected parseFilters(): void {
    super.parseFilters();

    if (this.fromDate && !dayjs(this.fromDate).isValid()) {
      throw new BadRequestException('invalid format for from date');
    }

    if (this.toDate && !dayjs(this.toDate).isValid()) {
      throw new BadRequestException('invalid format for to date');
    }

    if (this.fromDate && this.toDate) {
      if (dayjs(this.fromDate).isAfter(dayjs(this.toDate))) {
        throw new BadRequestException('from date must be before to date');
      }
    }

    if (this.fromDate && this.toDate) {
      this.addFilter({
        createdAt: Between(dayjs(this.fromDate).toDate(), dayjs(this.toDate).endOf('day').toDate()),
      });
    } else if (this.fromDate) {
      this.addFilter({
        createdAt: MoreThan(dayjs(this.fromDate).toDate()),
      });
    } else if (this.toDate) {
      this.addFilter({
        createdAt: LessThan(dayjs(this.toDate).endOf('day').toDate()),
      });
    }
  }

  @ApiPropertyOptional({
    description: 'the start date of the report',
  })
  @IsOptional()
  @IsString()
  fromDate?: string;

  @ApiPropertyOptional({
    description: 'the end date of the report',
  })
  @IsOptional()
  @IsString()
  toDate?: string;
}
