import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vessel } from './entities/vessel.entity';
import { CreateVesselInput } from './dto/create-vessel.input';
import { UpdateVesselInput } from './dto/update-vessel.input';

@Injectable()
export class VesselsService {
  constructor(
    @InjectRepository(Vessel)
    private readonly vesselRepository: Repository<Vessel>,
  ) {}

  async create(createVesselInput: CreateVesselInput): Promise<Vessel> {
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

  async update(
    id: string,
    updateVesselInput: UpdateVesselInput,
  ): Promise<Vessel> {
    const vessel = await this.findOne(id);
    if (!vessel) {
      throw new NotFoundException(`Vessel with ID ${id} not found`);
    }
    Object.assign(vessel, updateVesselInput);
    return this.vesselRepository.save(vessel);
  }

  async remove(id: string): Promise<Vessel> {
    const vessel = await this.findOne(id);
    if (!vessel) {
      throw new NotFoundException(`Vessel with ID ${id} not found`);
    }
    await this.vesselRepository.remove(vessel);
    return vessel;
  }
}