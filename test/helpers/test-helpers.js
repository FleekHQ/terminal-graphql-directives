export const USER_ID = '100';
export const ADMIN_TEAM_ID = '333';
export const MEMBER_TEAM_ID = '111';

const logger = {
  error(e) {
    console.error(e);
  },
  info(str) {
    console.log(str);
  },
  debug(str) {
    console.debug(str);
  },
};

// eslint-disable-next-line import/prefer-default-export
export const createTestCtx = () => {
  const testCtx = {
    user: {
      id: USER_ID,
      teams: {
        MEMBER: [MEMBER_TEAM_ID],
        ADMIN: [ADMIN_TEAM_ID],
      },
    },
    securitySession: { valid: true },
    logger,
  };

  return testCtx;
};
