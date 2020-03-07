import {
  InMemoryDbService,
  RequestInfoUtilities,
  ParsedRequestUrl,
  RequestInfo,
  ResponseOptions,
  STATUS,
  getStatusText
} from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  authenticated = false;

  createDb() {
    const authentication = {};
    const logout: any = [];
    const authenticate = {};

    const account = {
      login: 'admin',
      firstName: 'NGX-admin',
      authorities: []
    };

    const movies = [
      {
        id: 1,
        title: 'Star Wars: Episode IV - A New Hope',
        rated: 'PG',
        genres: ['Action', 'Adventure', 'Fantasy'],
        director: 'George Lucas',
        writer: 'George Lucas',
        releaseDate: '1977-05-25T00:00:00',
        actors: [
          'Mark Hamill',
          'Harrison Ford',
          'Carrie Fisher',
          'Peter Cushing'
        ],
        plot:
          "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a wookiee and two droids to save the universe from the Empire's world-destroying battle-station, while also attempting to rescue Princess Leia from the evil Darth Vader."
      },
      {
        id: 2,
        title: 'Star Wars: Episode V - The Empire Strikes Back',
        rated: 'PG',
        genres: ['Action', 'Adventure', 'Fantasy'],
        director: 'Irvin Kershner',
        writer: 'Leigh Brackett',
        releaseDate: '1980-05-21T00:00:00',
        actors: [
          'Mark Hamill',
          'Harrison Ford',
          'Carrie Fisher',
          'Billy Dee Williams'
        ],
        plot:
          'After the rebels have been brutally overpowered by the Empire on their newly established base, Luke Skywalker takes advanced Jedi training with Master Yoda, while his friends are pursued by Darth Vader as part of his plan to capture Luke.'
      },
      {
        id: 3,
        title: 'Star Wars: Episode VI - Return of the Jedi',
        rated: 'PG',
        genres: ['Action', 'Adventure', 'Fantasy'],
        director: 'Richard Marquand',
        writer: 'Lawrence Kasdan',
        releaseDate: '1983-05-25T00:00:00',
        actors: [
          'Mark Hamill',
          'Harrison Ford',
          'Carrie Fisher',
          'Billy Dee Williams'
        ],
        plot:
          'After rescuing Han Solo from the palace of Jabba the Hutt, the rebels attempt to destroy the second Death Star, while Luke struggles to make Vader return from the dark side of the Force.'
      },
      {
        id: 4,
        title: 'Star Wars: Episode I - The Phantom Menace',
        rated: 'PG',
        genres: ['Action', 'Adventure', 'Fantasy'],
        director: 'George Lucas',
        writer: 'George Lucas',
        releaseDate: '1999-05-19T00:00:00',
        actors: [
          'Liam Neeson',
          'Ewan McGregor',
          'Natalie Portman',
          'Jake Lloyd'
        ],
        plot:
          'Two Jedi Knights escape a hostile blockade to find allies and come across a young boy who may bring balance to the Force, but the long dormant Sith resurface to reclaim their old glory.'
      },
      {
        id: 5,
        title: 'Star Wars: Episode III - Revenge of the Sith',
        rated: 'PG-13',
        genres: ['Action', 'Adventure', 'Fantasy'],
        director: 'George Lucas',
        writer: 'George Lucas',
        releaseDate: '2002-05-16T00:00:00',
        actors: [
          'Ewan McGregor',
          'Natalie Portman',
          'Hayden Christensen',
          'Ian McDiarmid'
        ],
        plot:
          'Three years after the onset of the Clone Wars; the noble Jedi Knights are spread out across the galaxy leading a massive clone army in the war against the Separatists. After Chancellor ...'
      },
      {
        id: 6,
        title: 'Star Wars: Episode II - Attack of the Clones',
        rated: 'PG',
        genres: ['Action', 'Adventure', 'Fantasy'],
        director: 'George Lucas',
        writer: 'George Lucas',
        releaseDate: '2005-05-19T00:00:00',
        actors: [
          'Ewan McGregor',
          'Natalie Portman',
          'Hayden Christensen',
          'Christopher Lee'
        ],
        plot:
          'Ten years after initially meeting, Anakin Skywalker shares a forbidden romance with Padmé, while Obi-Wan investigates an assassination attempt on the Senator and discovers a secret clone army crafted for the Jedi.'
      }
    ];
    return { authentication, logout, account, authenticate, movies };
  }

  parseRequestUrl(url: string, utils: RequestInfoUtilities): ParsedRequestUrl {
    // const newUrl = url.replace(/api\/user-info/, 'api/userInfos');

    const parsed = utils.parseRequestUrl(url);
    return parsed;
  }

  post(reqInfo: RequestInfo) {
    const collectionName = reqInfo.collectionName;
    if (collectionName === 'authentication') {
      return this.loginUser(reqInfo);
    } else if (collectionName === 'logout') {
      return this.logoutUser(reqInfo);
    }
    return undefined; // let the default POST handle all others
  }

  get(reqInfo: RequestInfo) {
    const collectionName = reqInfo.collectionName;
    if (collectionName === 'account') {
      return this.getUserInfo(reqInfo);
    } else if (collectionName === 'authenticate') {
      return this.finishOptions(
        {
          body: {},
          status: STATUS.OK
        },
        reqInfo
      );
    }
    return undefined; // let the default GET handle all others
  }

  private loginUser(reqInfo: RequestInfo) {
    return reqInfo.utils.createResponse$(() => {
      const body = (reqInfo.req as any).body;
      const data = body.includes('username=admin&password=admin')
        ? {}
        : undefined;

      if (data) {
        this.authenticated = true;
      } else {
        this.authenticated = false;
      }

      const options: ResponseOptions = data
        ? {
            body: data,
            status: STATUS.OK
          }
        : {
            body: { error: `Invalid username or password` },
            status: STATUS.NOT_FOUND
          };
      return this.finishOptions(options, reqInfo);
    });
  }

  private logoutUser(reqInfo: RequestInfo) {
    return reqInfo.utils.createResponse$(() => {
      this.authenticated = false;

      const options: ResponseOptions = {
        body: {},
        status: STATUS.OK
      };
      return this.finishOptions(options, reqInfo);
    });
  }

  private getUserInfo(reqInfo: RequestInfo) {
    return reqInfo.utils.createResponse$(() => {
      const data = this.authenticated ? reqInfo.collection : undefined;

      const options: ResponseOptions = data
        ? {
            body: data,
            status: STATUS.OK
          }
        : {
            body: { error: `` },
            status: STATUS.UNAUTHORIZED
          };
      return this.finishOptions(options, reqInfo);
    });
  }

  private finishOptions(
    options: ResponseOptions,
    { headers, url }: RequestInfo
  ) {
    if (options.status) {
      options.statusText = getStatusText(options.status);
    }
    options.headers = headers;
    options.url = url;
    return options;
  }
}
