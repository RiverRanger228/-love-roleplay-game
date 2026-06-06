const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
const testRoutes = require('./routes/test');
const chatRoutes = require('./routes/chat');

app.use('/api/test', testRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.json({ message: '恋爱剧本定制 API' });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});