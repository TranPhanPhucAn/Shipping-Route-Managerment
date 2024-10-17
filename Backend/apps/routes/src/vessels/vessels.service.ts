import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vessel, VesselStatus } from './entities/vessel.entity';
import { CreateVesselInput } from './dto/create-vessel.input';
import { UpdateVesselInput } from './dto/update-vessel.input';

@Injectable()
export class VesselsService {
  constructor(
    @InjectRepository(Vessel)
    private readonly vesselRepository: Repository<Vessel>,
  ) {}

  async create(createVesselInput: CreateVesselInput): Promise<Vessel> {
    const name = await this.vesselRepository.findOne({
      where: {name: createVesselInput.name}
    }
    );
    if(name){
      throw new BadRequestException(`This Vessel Name was exited!`)
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
      where:{id}
    });
    const updateVessel = updateVesselInput;

    if (!vessel) {
      throw new NotFoundException(`Vessel with Name "${id}" not found`);
    }
    return this.vesselRepository.save(updateVessel);
  }

  async remove(id: string): Promise<Vessel> {
    const vessel = await this.findOne(id);
    if (!vessel) {
      throw new NotFoundException(`Vessel with ID ${id} not found`);
    }
    await this.vesselRepository.remove(vessel);
    return vessel;
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
}
