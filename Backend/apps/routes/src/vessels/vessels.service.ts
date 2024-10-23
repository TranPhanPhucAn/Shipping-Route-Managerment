import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { Vessel, VesselStatus, VesselType } from './entities/vessel.entity';
import { CreateVesselInput } from './dto/create-vessel.input';
import { UpdateVesselInput } from './dto/update-vessel.input';
import {
  PaginationVesselByIdDto,
  PaginationVesselDto,
} from './dto/pagination-vessels';

@Injectable()
export class VesselsService {
  constructor(
    @InjectRepository(Vessel)
    private readonly vesselRepository: Repository<Vessel>,
  ) {}

  async create(createVesselInput: CreateVesselInput): Promise<Vessel> {
    const name = await this.vesselRepository.findOne({
      where: { name: createVesselInput.name },
    });
    if (name) {
      throw new BadRequestException(`This Vessel Name was exited!`);
    }
    const newVessel = this.vesselRepository.create(createVesselInput);
    return this.vesselRepository.save(newVessel);
  }
  async findAll(): Promise<Vessel[]> {
    return this.vesselRepository.find();
  }

  async findOne(id: string): Promise<Vessel> {
    const vessel = await this.vesselRepository.findOneBy({ id });
    if (!vessel) {
      throw new NotFoundException(`Vessel with ID ${id} not found`);
    }
    return vessel;
  }
  async save(vessel: Vessel): Promise<Vessel> {
    return this.vesselRepository.save(vessel);
  }

  async update(
    id: string,
    updateVesselInput: UpdateVesselInput,
  ): Promise<Vessel> {
    const vessel = await this.vesselRepository.findOne({
      where: { id },
    });
    if (!vessel) {
      throw new NotFoundException(`Vessel with Name "${id}" not found`);
    }
    vessel.name = updateVesselInput.name;
    vessel.type = updateVesselInput.type;
    vessel.capacity = updateVesselInput.capacity;
    vessel.status = updateVesselInput.status;
    return this.vesselRepository.save(vessel);
  }

  async remove(id: string): Promise<string> {
    const vessel = await this.vesselRepository.findOne({
      where: { id },
    });
    if (!vessel) {
      throw new NotFoundException(`Vessel with ID ${id} not found`);
    }
    await this.vesselRepository.delete(id);
    return id;
  }

  async getInforByOwner(id: string) {
    const vesselTotal = this.vesselRepository.count({
      where: {
        ownerId: id,
      },
    });
    const available = this.vesselRepository.count({
      where: {
        ownerId: id,
        status: VesselStatus.AVAILABLE,
      },
    });
    const inTransits = this.vesselRepository.count({
      where: {
        ownerId: id,
        status: VesselStatus.IN_TRANSIT,
      },
    });
    const underMaintance = this.vesselRepository.count({
      where: {
        ownerId: id,
        status: VesselStatus.UNDER_MAINTENANCE,
      },
    });
    return {
      vesselTotal: vesselTotal,
      available: available,
      inTransits: inTransits,
      underMaintance: underMaintance,
    };
  }

  async getInforVesselTotal() {
    const vesselTotal = this.vesselRepository.count();
    const available = this.vesselRepository.count({
      where: {
        status: VesselStatus.AVAILABLE,
      },
    });
    const inTransits = this.vesselRepository.count({
      where: {
        status: VesselStatus.IN_TRANSIT,
      },
    });
    const underMaintance = this.vesselRepository.count({
      where: {
        status: VesselStatus.UNDER_MAINTENANCE,
      },
    });
    return {
      vesselTotal: vesselTotal,
      available: available,
      inTransits: inTransits,
      underMaintance: underMaintance,
    };
  }

  async paginationVessels(paginationVessels: PaginationVesselDto) {
    const { limit, offset, sort, search, statusFilter, typeFilter } =
      paginationVessels;

    const skips = limit * offset;
    const order: Record<string, 'ASC' | 'DESC'> = {};
    if (sort) {
      sort.split(',').forEach((sortParam: string) => {
        const [field, direction] = sortParam.split(' ');
        order[field] = direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      });
    }

    order['id'] = 'DESC';

    const queryOptions: any = {
      take: limit,
      skip: skips,
      order,
    };

    const whereCondition: any = {};
    if (search) {
      whereCondition.name = ILike(`%${search}%`);
    }
    if (statusFilter) {
      const statusArray = statusFilter.split(',') as VesselStatus[];
      if (statusArray.length > 0) {
        whereCondition.status = In(statusArray);
      }
    }
    if (typeFilter) {
      const typeArray = typeFilter.split(',') as VesselType[];
      if (typeArray.length > 0) {
        whereCondition.type = In(typeArray);
      }
    }

    if (Object.keys(whereCondition).length > 0) {
      queryOptions.where = whereCondition;
    }

    const [result, total] =
      await this.vesselRepository.findAndCount(queryOptions);
    const totalCount = total;

    return {
      vessels: result,
      totalCount: totalCount,
    };
  }

  async paginationVesselById(paginationVessel: PaginationVesselByIdDto) {
    const { ownerId, limit, offset, sort, search, statusFilter, typeFilter } =
      paginationVessel;
    const skips = limit * offset;
    const order: Record<string, 'ASC' | 'DESC'> = {};
    if (sort) {
      sort.split(',').forEach((sortParam: string) => {
        const [field, direction] = sortParam.split(' ');
        order[field] = direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      });
    }

    order['id'] = 'DESC';

    const queryOptions: any = {
      take: limit,
      skip: skips,
      order,
    };

    const whereCondition: any = {};
    whereCondition.ownerId = ownerId;
    if (search) {
      whereCondition.name = ILike(`%${search}%`);
    }
    if (statusFilter) {
      const statusArray = statusFilter.split(',') as VesselStatus[];
      if (statusArray.length > 0) {
        whereCondition.status = In(statusArray);
      }
    }
    if (typeFilter) {
      const typeArray = typeFilter.split(',') as VesselType[];
      if (typeArray.length > 0) {
        whereCondition.type = In(typeArray);
      }
    }

    if (Object.keys(whereCondition).length > 0) {
      queryOptions.where = whereCondition;
    }

    const [result, total] =
      await this.vesselRepository.findAndCount(queryOptions);
    const totalCount = total;

    return {
      vessels: result,
      totalCount: totalCount,
    };
  }
}
