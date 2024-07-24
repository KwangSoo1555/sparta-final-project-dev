import { Injectable } from '@nestjs/common';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NoticesEntity } from 'src/entities/notices.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NoticesService {
  constructor(
    @InjectRepository(NoticesEntity)
    private readonly noticeRepository: Repository<NoticesEntity>,
  ){}

  async createNewNotice(userId: number, noticeDetails: CreateNoticeDto) {
    const newNotice = this.noticeRepository.create({
      ...noticeDetails,
      userId: userId
    });
    
    const createdNotice = await this.noticeRepository.save(newNotice);
    console.log('새로 생성된 공지사항:', createdNotice);
    
    return createdNotice;
  }
  
  async getNotices(page: number, limit: number) {
    const offset = (page - 1) * limit;

    const [notices, totalNotices] = await this.noticeRepository.findAndCount({
      skip: offset,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const totalPages = Math.ceil(totalNotices / limit);

    return {
      data: notices,
      meta: {
        totalItems: totalNotices,
        currentPage: page,
        itemsPerPage: limit,
        totalPages,
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} notice`;
  }

  update(id: number, updateNoticeDto: UpdateNoticeDto) {
    return `This action updates a #${id} notice`;
  }

  remove(id: number) {
    return `This action removes a #${id} notice`;
  }
}
