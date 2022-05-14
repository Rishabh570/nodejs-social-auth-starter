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
	twitterClientId: env.TWITTER_CLIENT_ID,
	twitterClientSecret: env.TWITTER_CLIENT_SECRET,
	twitterCallbackUrl: '/api/auth/twitter/callback',

	googleClientId: env.GOOGLE_CLIENT_ID,
	googleClientSecret: env.GOOGLE_CLIENT_SECRET,
	googleCallbackUrl: 'http://localhost:3001/api/auth/google/callback',
	
	githubClientId: env.GITHUB_CLIENT_ID,
	githubClientSecret: env.GITHUB_CLIENT_SECRET,
	githubCallbackUrl: '/api/auth/github/callback',
	
	facebookAppId: env.FACEBOOK_APP_ID,
	facebookAppSecret: env.FACEBOOK_APP_SECRET,
	facebookCallbackUrl: '/api/auth/facebook/callback',

	amazonClientId: env.AMAZON_CLIENT_ID,
	amazonClientSecret: env.AMAZON_CLIENT_SECRET,
	amazonCallbackUrl: '/api/auth/amazon/callback',



	// env: env.NODE_ENV,
	// BASE_URL: env.BASE_URL,
	// JWT_SECRET: env.JWT_SECRET,
	// JWT_EXPIRATION_MINUTES: env.JWT_EXPIRATION_MINUTES,
	// RESET_TOKEN_EXPIRATION_MINUTES: env.RESET_TOKEN_EXPIRATION_MINUTES,
	// GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
	// GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
	// COOKIE_TTL: env.COOKIE_TTL,
	// COOKIE_SECRET: env.COOKIE_SECRET,
	// SENDGRID_USERNAME: env.SENDGRID_USERNAME,
	// SENDGRID_API_KEY: env.SENDGRID_API_KEY,
	// EMAIL_TEMPLATE_BASE: env.EMAIL_TEMPLATE_BASE,
	// EMAIL_FROM_SUPPORT: env.EMAIL_FROM_SUPPORT,
	// MULTER_UPLOAD_DEST: MULTER_UPLOAD_DEST,
	// UPLOAD_LIMIT: 5, // MB
	// mongo: {
	// 	uri: env.NODE_ENV === 'test' ? env.MONGO_URI_TESTS : env.MONGO_URI,
	// },
	// logs: env.NODE_ENV === 'production' ? 'combined' : 'dev',
	// STRIPE_SECRET_KEY: env.STRIPE_SECRET_KEY,
	// STRIPE_PUBLISHABLE_KEY: env.STRIPE_PUBLISHABLE_KEY,
	// STRIPE_WEBHOOK_SECRET: env.STRIPE_WEBHOOK_SECRET,
	// MAX_PRODUCT_IMAGES_ALLOWED: env.MAX_PRODUCT_IMAGES_ALLOWED,
	// MULTER_UPLOAD_MAX_FILE_SIZE_ALLOWED:
	// 	env.MULTER_UPLOAD_MAX_FILE_SIZE_ALLOWED,
	// SENTRY_DSN: env.SENTRY_DSN,
	// AWS_ACCESS_KEY_ID: env.AWS_ACCESS_KEY_ID,
	// AWS_SECRET_ACCESS_KEY: env.AWS_SECRET_ACCESS_KEY,
	// AWS_BUCKET_NAME: env.AWS_BUCKET_NAME,
	// CLOUDFRONT_URL: env.CLOUDFRONT_URL,
	// REDIS_URL: env.REDIS_URL,
};
