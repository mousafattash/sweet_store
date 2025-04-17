// DB/connection.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// 1) Load .env
dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ No DATABASE_URL in environment');
  process.exit(1);
}

// 2) Create Sequelize instance
const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // for Neon’s self‑signed cert
    },
  },
  logging: false,
  define: {
    underscored: true,
    timestamps: false,
  },
});

// 3) Export connect helper and instance
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }
};

export default sequelize;