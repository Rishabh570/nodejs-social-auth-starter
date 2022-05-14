'use-strict';
// import .env variables
require('dotenv-safe').config();

const { env } = process; // this has ".env" keys & values

module.exports = {
	port: env.PORT,
  databaseURL: env.DATABASE_URL,
	databaseName: env.DATABASE_NAME,
	api: {
		prefix: '/api',
	},
	cookieName: 'sid',

	googleClientId: env.GOOGLE_CLIENT_ID,
	googleClientSecret: env.GOOGLE_CLIENT_SECRET,
	googleCallbackUrl: 'http://localhost:3001/api/auth/google/callback',
	
	githubClientId: env.GITHUB_CLIENT_ID,
	githubClientSecret: env.GITHUB_CLIENT_SECRET,
	githubCallbackUrl: '/api/auth/github/callback',

	amazonClientId: env.AMAZON_CLIENT_ID,
	amazonClientSecret: env.AMAZON_CLIENT_SECRET,
	amazonCallbackUrl: '/api/auth/amazon/callback',
};
