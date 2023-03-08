import dotenv from 'dotenv'
dotenv.config()

const config = {
    POSTGRES_HOST: process.env.POSTGRES_HOST || "127.0.0.1",
    POSTGRES_DB : process.env.POSTGRES_DB || "university",
    POSTGRES_USER : process.env.POSTGRES_USER || "dell",
    POSTGRES_PASSWORD : process.env.POSTGRES_PASSWORD || "aisha@4010058",

    POSTGRES_TEST_DB : process.env.POSTGRES_TEST_DB || "university_test",
    ENV : process.env.ENV || "dev",

    BCRYPT_PASSWORD : process.env.BCRYPT_PASSWORD || "speak-friend-and-enter",
    SALT_ROUNDS : process.env.SALT_ROUNDS || 10,

    TOKEN_SECRET : process.env.TOKEN_SECRET || "thisisasecret123!",
}

export default config