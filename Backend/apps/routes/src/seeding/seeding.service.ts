import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Port } from '../ports/entities/port.entity';
import { Vessel, VesselType, VesselStatus } from '../vessels/entities/vessel.entity';
import { Route } from '../routes/entities/route.entity';
import { Schedule, ScheduleStatus } from '../schedules/entities/schedule.entity';
import { faker } from '@faker-js/faker';


@Injectable()
export class SeedingService {
  constructor(private readonly dataSource: DataSource) {}

  async seed() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const portRepository = queryRunner.manager.getRepository(Port);
      const vesselRepository = queryRunner.manager.getRepository(Vessel);
      const routeRepository = queryRunner.manager.getRepository(Route);
      const scheduleRepository = queryRunner.manager.getRepository(Schedule);

      // Clear existing data
      // const ports = await portRepository.find();
      // await portRepository.remove(ports);
      // const vessels = await vesselRepository.find();
      // await vesselRepository.remove(vessels);
      // const routes = await routeRepository.find();
      // await routeRepository.remove(routes);
      // const schedules = await scheduleRepository.find();
      // await scheduleRepository.remove(schedules);

      // Seed Ports
      const usedCities = new Set<string>();
      const portfaker = [];
      for(let i = 0; i < 100; i++) {
        let city: string;
        do {
          city = faker.location.city();
        } while (usedCities.has(city));

        usedCities.add(city); 
        const portData = portRepository.create({
          name: city,
          latitude: faker.location.latitude(),
          longitude: faker.location.longitude(),
          country: faker.location.country(),
        });
        portfaker.push(portData)
      }

      await portRepository.save(portfaker);

      // Seed Vessels
      const vesselfaker = [];
      for(let i = 0; i<100; i++){

        const vesselData = vesselRepository.create({
          name: faker.company.name(),
          type: faker.helpers.arrayElement(Object.values(VesselType)),
          capacity: faker.number.int({ min: 1000, max: 10000 }),
          ownerId: faker.number.int({ min:1, max: 100}).toString(), 
        });
        vesselfaker.push(vesselData);
      } 
      await vesselRepository.save(vesselfaker);

      // Seed Routes
      const routefaker = [];
      for(let i = 0; i<100; i++){

        const routeData =  routeRepository.create({
          departurePort: faker.helpers.arrayElement(portfaker),
          destinationPort: faker.helpers.arrayElement(portfaker),
          distance: faker.number.float({ min: 100, max: 100000 }),
          estimatedTimeDays: faker.number.int({ min: 1, max: 20 }),
        });
        routefaker.push(routeData);
      }
      await routeRepository.save(routefaker);

      // Seed Schedules
      const schedulefaker = [];
      for(let i=0; i<100;i++){

        const scheduleData = scheduleRepository.create({
          vessel: faker.helpers.arrayElement(vesselfaker),
          route: faker.helpers.arrayElement(routefaker),
          departure_time: faker.date.future().toISOString(),
          arrival_time: faker.date.future().toISOString(),
          status: faker.helpers.arrayElement(Object.values(ScheduleStatus)),
        });
        schedulefaker.push(scheduleData);

        const vessel = scheduleData.vessel; 
        vessel.status = VesselStatus.IN_TRANSIT;
        await vesselRepository.save(vessel);


      }
      await scheduleRepository.save(schedulefaker);
      // Commit the transaction
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
