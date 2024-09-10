import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Port } from './entities/port.entity';
import { CreatePortInput } from './dto/create-port.input';
import { UpdatePortInput } from './dto/update-port.input';

@Injectable()
export class PortsService {
  constructor(
    @InjectRepository(Port)
    private portRepository: Repository<Port>,
  ) {}

  async create(createPortInput: CreatePortInput): Promise<Port> {
    const newPort = this.portRepository.create(createPortInput);
    return this.portRepository.save(newPort);
  }

  async findAll(): Promise<Port[]> {
    return this.portRepository.find();
  }

  async findOne(id: string): Promise<Port> {
    const port = await this.portRepository.findOneBy({ id });
    if (!port) {
      throw new NotFoundException(`Port with ID "${id}" not found`);
    }
    return port;
  }

  async update(id: string, updatePortInput: UpdatePortInput): Promise<Port> {
    const port = await this.portRepository.preload({
      id: id,
      ...updatePortInput,
    });

    if (!port) {
      throw new NotFoundException(`Port with ID "${id}" not found`);
    }

    return this.portRepository.save(port);
  }

  async remove(id: string): Promise<Port> {
    const port = await this.findOne(id);
    await this.portRepository.remove(port);
    return port;
  }
}
