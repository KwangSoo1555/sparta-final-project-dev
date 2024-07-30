import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateReportDto } from "./dto/create-report.dto";
import { UpdateReportDto } from "./dto/update-report.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ReportsEntity } from "src/entities/reports.entity";
import { Repository } from "typeorm";
import { UsersEntity } from "src/entities/users.entity";
import { MESSAGES } from "src/common/constants/message.constant";

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ReportsEntity)
    private readonly reportsRepository: Repository<ReportsEntity>,
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async createReport(userId: number, createReportDto: CreateReportDto): Promise<ReportsEntity> {
    const reportedUser = await this.getUserByEmail(createReportDto.email);
    const reporter = await this.getUserById(userId);

    await this.checkDuplicateReport(userId, reportedUser.id);

    const newReport = this.reportsRepository.create({
      reporterId: reporter.id,
      reportedId: reportedUser.id,
      reason: createReportDto.reason,
      description: createReportDto.description,
    });

    return this.reportsRepository.save(newReport);
  }

  async getReportList(page: number, limit: number, userId: number) {
    const offset = (page - 1) * limit;

    const [reports, totalReports] = await this.reportsRepository.findAndCount({
      where: { reporterId: userId },
      skip: offset,
      take: limit,
      order: { createdAt: "DESC" },
    });

    const totalPages = Math.ceil(totalReports / limit);

    return {
      reports,
      pagination: {
        totalItems: totalReports,
        currentPage: page,
        itemsPerPage: limit,
        totalPages,
      },
    };
  }

  async getReportDetail(userId: number, reportId: number) {
    this.validateId(reportId);
    return this.getReportByIdAndReporter(userId, reportId);
  }

  async updateReport(userId: number, reportId: number, updateReportDto: UpdateReportDto) {
    this.validateId(reportId);
    // 신고자 ID와 신고 ID로 신고 존재 여부 및 권한 확인
    const existingReport = await this.getReportByIdAndReporter(reportId, userId);

    // 업데이트 수행
    const updatedReport = await this.reportsRepository.save({
      ...existingReport,
      ...updateReportDto,
    });

    return updatedReport;
  }

  async deleteReport(reportId: number, userId: number) {
    this.validateId(reportId);
    const data = await this.getReportByIdAndReporter(reportId, userId);
    return await this.reportsRepository.delete(data.id);
  }

  async adminReport(page: number, limit: number) {
    const offset = (page - 1) * limit;

    const [reports, totalReports] = await this.reportsRepository.findAndCount({
      skip: offset,
      take: limit,
      order: { createdAt: "DESC" },
    });
    const totalPages = Math.ceil(totalReports / limit);

    return {
      reports,
      pagination: {
        totalItems: totalReports,
        currentPage: page,
        itemsPerPage: limit,
        totalPages,
      },
    };
  }

  private async getUserByEmail(email: string): Promise<UsersEntity> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(MESSAGES.REPORTS.ERRORS.USER_NOT_FOUND.REPORTED);
    }
    return user;
  }

  private async getUserById(id: number): Promise<UsersEntity> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(MESSAGES.REPORTS.ERRORS.USER_NOT_FOUND.REPORTER);
    }
    return user;
  }

  private async checkDuplicateReport(userId: number, reportedId: number) {
    const existingReport = await this.reportsRepository.findOne({
      where: { reporterId: userId, reportedId },
    });

    if (existingReport) {
      throw new ConflictException(MESSAGES.REPORTS.ERRORS.DUPLICATE_REPORT);
    }
  }

  private async getReportByIdAndReporter(reporterId: number, userId: number) {
    const report = await this.reportsRepository.findOne({
      where: { id: reporterId, reporterId: userId },
    });

    if (!report) {
      throw new NotFoundException(MESSAGES.REPORTS.ERRORS.REPORT_NOT_FOUND);
    }
    return report;
  }

  // ID 유효성 검사 함수
  private validateId(id: number) {
    if (Number.isNaN(id) || id <= 0) {
      throw new NotFoundException(MESSAGES.REPORTS.ERRORS.INVALID_REPORT_ID);
    }
  }
}
