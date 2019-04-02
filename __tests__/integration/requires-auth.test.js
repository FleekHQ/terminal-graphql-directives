const { graphql } = require('graphql');
const { start, stop } = require('../helpers/integration-server');
const schema = require('../helpers/schema').default;
const { createTestCtx } = require('../helpers/test-helpers');


describe('RequiresAuth directive test', () => {
  let app;
  let testCtx;
  let folderId;
  let publicFolder;

  beforeAll((done) => {
    app = start(done);
  });

  beforeEach(async (done) => {

    testCtx = createTestCtx();


    done();
  });

  afterAll((done) => {
    stop(app, done);
  });

  it('requireAuth: should return null on field with directive when no user session', async (done) => {
    // setup

    testCtx.user = null;
    testCtx.securitySession = null;

    const query = `
      {
        people {
          personID
          name
          secretField
          requiredSecretField
          requiredIntSecret
        }
      }
    `;

    // general success expectations
    const response = await graphql(schema, query, {}, testCtx);

    // data expectations
    expect(response).toBeDefined();
    expect(response.errors).toBeUndefined();
    expect(response.data).toBeDefined();
    expect(response.data.people).toBeDefined();
    expect(response.data.people).toHaveLength(3);
    // main data fields
    const testPerson = response.data.people[0];
    expect(testPerson.personID).toEqual(1);
    expect(testPerson.name).toEqual('Dave');
    expect(testPerson.secretField).toBeNull();
    expect(testPerson.requiredSecretField).toBeNull();
    expect(testPerson.requiredIntSecret).toBeNull();

    done();
  });

  it('requireAuth: should return field information with directive when user has valid session', async (done) => {
    // setup

    const query = `
      {
        people {
          personID
          name
          secretField
          requiredSecretField
          requiredIntSecret
        }
      }
    `;

    // general success expectations
    const response = await graphql(schema, query, {}, testCtx);

    // data expectations
    expect(response).toBeDefined();
    expect(response.errors).toBeUndefined();
    expect(response.data).toBeDefined();
    expect(response.data.people).toBeDefined();
    expect(response.data.people).toHaveLength(3);
    // main data fields
    const testPerson = response.data.people[0];
    expect(testPerson.personID).toEqual(1);
    expect(testPerson.name).toEqual('Dave');
    expect(testPerson.secretField).toEqual('Dave secret');
    expect(testPerson.requiredSecretField).toEqual('Dave required secret');
    expect(testPerson.requiredIntSecret).toEqual('1');

    done();
  });
});
