import {
  BadRequestException,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { AuthService } from './auth/auth.service';
import {
  parse,
  DocumentNode,
  OperationDefinitionNode,
  FieldNode,
} from 'graphql';

const getToken = (authToken: string): string => {
  const match = authToken.match(/^Bearer (.*)$/);
  if (!match || match.length < 2) {
    throw new HttpException(
      {
        message: 'Invalid Authorization token - Token does not match Bearer .*',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
  return match[1];
};

const decodedToken = (authToken: string) => {
  const decoded = verify(authToken, process.env.ACCESS_SECRET, {
    ignoreExpiration: true,
  });
  const expirationTime = decoded?.exp;
  if (expirationTime * 1000 < Date.now()) {
    throw new HttpException(
      { message: 'Access token expired' },
      HttpStatus.UNAUTHORIZED,
    );
  }
  if (!decoded) {
    throw new HttpException(
      { message: 'Invalid Auth Token' },
      HttpStatus.UNAUTHORIZED,
    );
  }
  return { decoded: decoded, expirationTime: expirationTime };
};

export const handleAuth = async ({ req }, authService: AuthService) => {
  try {
    let userId: string = '';
    let email: string = '';
    const refreshToken: string = req.headers.refreshtoken;
    const rawBody = req.body;
    let typeQuery: string;
    if (rawBody && rawBody.query) {
      const parsedQuery: DocumentNode = parse(rawBody.query);
      const operation = parsedQuery.definitions.find(
        (def) => def.kind === 'OperationDefinition',
      ) as OperationDefinitionNode;
      if (operation) {
        // const operationType = operation.operation; // 'query' or 'mutation'
        // const operationName = operation.name?.value; // Operation name
        const fields = operation.selectionSet.selections
          .filter((selection) => selection.kind === 'Field')
          .map((field) => (field as FieldNode).name.value);
        typeQuery = fields[0];
      }
    }
    const notCheckLogin = ['login'];
    if (notCheckLogin.includes(typeQuery)) {
      return {};
    } else {
      if (req.headers.accesstoken) {
        const cacheService = authService.getCacheService();
        const token = getToken(req.headers.accesstoken);
        const isExist = await cacheService.get(token);
        if (isExist) {
          throw new UnauthorizedException(
            'User unauthorized with invalid accessToken headers',
          );
        }
        const { decoded, expirationTime } = decodedToken(token);
        userId = decoded.userId;
        email = decoded.email;
        if (typeQuery === 'logout') {
          console.log('alo');
          return {
            userid: userId,
            email: email,
            accesstoken: token,
            expirationtime: expirationTime,
          };
        }
        if (typeQuery === 'refreshToken') {
          return {
            userid: userId,
            email: email,
            refreshtoken: refreshToken,
          };
        }
        // console.log(await authService.getUser(userId));
      } else {
        throw new UnauthorizedException(
          'User unauthorized with invalid accessToken headers',
        );
      }
    }
    return {
      userid: userId,
      email: email,
    };
  } catch (err) {
    throw new UnauthorizedException(
      'User unauthorized with invalid accessToken headers',
    );
  }
};
