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
      createdAt
    }
  }
`;

export const GET_PORTS = gql`
  query GetPorts {
    ports {
      id
      name
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
