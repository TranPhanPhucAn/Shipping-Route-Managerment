import { gql } from "@apollo/client";

export const QUERY_USER = gql`
  query user($id: String!) {
    user(id: $id) {
      id
      email
      username
      address
      image_url
      phone_number
      createdAt
      gender
      birthday
      role {
        id
        name
      }
    }
  }
`;

export const QUERY_SUPPLIERS = gql`
  query {
    getSuppliers {
      id
      username
    }
  }
`;

export const GET_USER_PAGINATION = gql`
  query paginationUser($paginationUser: PaginationUserDto!) {
    paginationUser(paginationUser: $paginationUser) {
      users {
        id
        email
        username
        address
        image_url
        gender
        birthday
        role {
          id
          name
        }
      }
      totalCount
    }
  }
`;

export const QUERY_ROLE = gql`
  query role($id: String!) {
    role(id: $id) {
      id
      name
      description
      permissions {
        id
      }
    }
  }
`;

export const QUERY_ROLES = gql`
  query {
    roles {
      id
      name
      description
      createdAt
    }
  }
`;

export const QUERY_PERMISSIONS = gql`
  query {
    permissions {
      id
      permission
      description
    }
  }
`;

export const GET_ROUTES = gql`
  query {
    routes {
      id
      departurePort {
        id
        name
      }
      destinationPort {
        id
        name
      }
      distance
      estimatedTimeDays
      createdAt
    }
  }
`;
export const GET_ROUTE = gql`
  query route($id: String!) {
    route(id: $id) {
      id
      departurePort {
        id
        name
      }
      destinationPort {
        id
        name
      }
      distance
      estimatedTimeDays
      createdAt
    }
  }
`;

export const GET_PORTS = gql`
  query GetPorts {
    ports {
      id
      name
      country
      latitude
      longitude
    }
  }
`;

export const GET_PORT_PAGINATION = gql`
  query paginationPort($paginationPort: PaginationPortDto!) {
    paginationPort(paginationPort: $paginationPort) {
      ports {
        id
        name
        country
        latitude
        longitude
      }
      totalCount
    }
  }
`;

export const GET_SCHEDULES = gql`
  query GetSchedules {
    schedules {
      id
      vessel {
        id
        name
      }
      route {
        id
        departurePort {
          id
          name
        }
        destinationPort {
          id
          name
        }
      }
      departure_time
      arrival_time
      status
    }
  }
`;

export const GET_VESSELS = gql`
  query GetVessels {
    vessels {
      id
      name
      type
      capacity
      status
    }
  }
`;

export const GET_VESSELS_PAGINATION = gql`
  query paginationVessels($paginationVessels: PaginationVesselDto!) {
    paginationVessels(paginationVessels: $paginationVessels) {
      vessels {
        id
        name
        type
        capacity
        status
      }
      totalCount
    }
  }
`;

export const GET_VESSELS_PAGINATION_BY_ID = gql`
  query paginationVesselById($paginationVessels: PaginationVesselByIdDto!) {
    paginationVesselById(paginationVessels: $paginationVessels) {
      vessels {
        id
        name
        type
        capacity
        status
      }
      totalCount
    }
  }
`;

export const QUERY_INFOR_BY_OWNER = gql`
  query getInforByOwner($id: String!) {
    getInforByOwner(id: $id) {
      vesselTotal
      available
      inTransits
      underMaintance
    }
  }
`;

export const QUERY_INFOR_VESSEL_TOTAL = gql`
  query getInforVesselTotal {
    getInforVesselTotal {
      vesselTotal
      available
      inTransits
      underMaintance
    }
  }
`;

export const SEARCH_BY_PORT = gql`
  query schedulesByPort($country: String!, $portName: String!, $date: String!) {
    schedulesByPort(country: $country, portName: $portName, date: $date) {
      id
      vessel {
        id
        name
        type
      }
      route {
        id
        departurePort {
          id
          name
        }
        destinationPort {
          id
          name
        }
      }
      departure_time
      arrival_time
      status
    }
  }
`;
export const GET_SCHEDULE_PAGINATION = gql`
  query paginationSchedule($paginationSchedule: PaginationScheduleDto!) {
    paginationSchedule(paginationSchedule: $paginationSchedule) {
      schedules {
        id
        status
        vessel {
          id
          name
        }
        route {
          id
          departurePort {
            id
            name
            country
          }
          destinationPort {
            id
            name
            country
          }
        }
        departure_time
        arrival_time
      }
      totalCount
    }
  }
`;
export const GET_SCHEDULE_PAGINATION_BY_ID = gql`
  query paginationScheduleById(
    $paginationSchedule: PaginationScheduleByIdDto!
  ) {
    paginationScheduleById(paginationSchedule: $paginationSchedule) {
      schedules {
        id
        status
        vessel {
          id
          name
        }
        route {
          id
          departurePort {
            id
            name
            country
          }
          destinationPort {
            id
            name
            country
          }
        }
        departure_time
        arrival_time
      }
      totalCount
    }
  }
`;

export const GET_ROUTE_PAGINATION = gql`
  query paginationRoute($paginationRoute: PaginationRoutesDto!) {
    paginationRoute(paginationRoute: $paginationRoute) {
      routes {
        id
        departurePort {
          id
          name
        }
        destinationPort {
          id
          name
        }
        distance
        estimatedTimeDays
        createdAt
      }
      totalCount
    }
  }
`;
