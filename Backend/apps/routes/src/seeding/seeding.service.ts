import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  Vessel,
  VesselType,
  VesselStatus,
} from '../vessels/entities/vessel.entity';
import { Route } from '../routes/entities/route.entity';
import {
  Schedule,
  ScheduleStatus,
} from '../schedules/entities/schedule.entity';
import { Port } from '../ports/entities/port.entity';

@Injectable()
export class SeedingService {
  constructor(private readonly dataSource: DataSource) {}

  async seed() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const vesselRepository = queryRunner.manager.getRepository(Vessel);
      const routeRepository = queryRunner.manager.getRepository(Route);
      const scheduleRepository = queryRunner.manager.getRepository(Schedule);
      const portRepository = queryRunner.manager.getRepository(Port);
      // Clear existing data
      // await vesselRepository.clear();
      // await routeRepository.clear();
      // await scheduleRepository.clear();
      // await portRepository.clear();

      // Sample ports data
      const ports = [
        { id: 'HN', name: 'Ha Noi', location: 'Vietnam' },
        { id: 'HCM', name: 'Ho Chi Minh', location: 'Vietnam' },
        { id: 'DN', name: 'Da Nang', location: 'Vietnam' },
        { id: 'GL', name: 'Gia Lai', location: 'Vietnam' },
      ];

      // Create and save ports
      const portEntities = portRepository.create(ports);
      await portRepository.save(portEntities);

      // Sample vessels data
      const vessels = [
        {
          name: 'V01',
          type: VesselType.CONTAINER_SHIP,
          capacity: 2000,
          ownerId: '1',
          status: VesselStatus.AVAILABLE,
        },
        {
          name: 'V02',
          type: VesselType.BULK_CARRIER,
          capacity: 1500,
          ownerId: '2',
          status: VesselStatus.AVAILABLE,
        },
        {
          name: 'V03',
          type: VesselType.TANKER,
          capacity: 3000,
          ownerId: '3',
          status: VesselStatus.AVAILABLE,
        },
      ];

      // Create and save vessels
      const vesselEntities = vesselRepository.create(vessels);
      await vesselRepository.save(vesselEntities);
      // Sample routes data
      const routes = [
        {
          departurePort: portEntities[0],
          destinationPort: portEntities[1],
          distance: 1000,
        },
        {
          departurePort: portEntities[2],
          destinationPort: portEntities[3],
          distance: 400,
        },
        {
          departurePort: portEntities[0],
          destinationPort: portEntities[2],
          distance: 600,
        },
      ];

      // Create and save routes
      const routeEntities = routeRepository.create(routes);
      await routeRepository.save(routeEntities);

      // Sample schedules data
      const schedules = [
        {
          vessel: vesselEntities[0],
          route: routeEntities[0],
          departure_time: '2024-09-25T10:00:00Z',
          arrival_time: '2024-10-01T18:00:00Z',
          status: ScheduleStatus.SCHEDULED,
        },
        {
          vessel: vesselEntities[1],
          route: routeEntities[1],
          departure_time: '2024-09-28T10:00:00Z',
          arrival_time: '2024-10-02T18:00:00Z',
          status: ScheduleStatus.IN_TRANSIT,
        },
        {
          vessel: vesselEntities[2],
          route: routeEntities[2],
          departure_time: '2024-09-20T10:00:00Z',
          arrival_time: '2024-09-22T18:00:00Z',
          status: ScheduleStatus.COMPLETED,
        },
      ];

      const scheduleEntities = scheduleRepository.create(schedules);
      await scheduleRepository.save(scheduleEntities);

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      console.log('error', e);
      throw e;
    } finally {
      await queryRunner.release();
      return { message: 'Seeding done' };
    }
  }
}
