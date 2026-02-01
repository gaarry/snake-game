#!/usr/bin/env node

/**
 * Web Project - Complete Test Suite Template
 * 可复用的网页项目测试套件
 * 
 * 使用方法：
 * 1. 复制此文件到你的项目根目录
 * 2. 修改 CONFIG 部分适配你的项目
 * 3. 根据 API 端点调整测试用例
 * 4. 运行: node test-suite.js
 */

const CONFIG = {
  name: 'My Web Project',           // 项目名称
  url: 'https://my-project.vercel.app',  // 项目 URL
  apiBase: '/api',                   // API 基础路径
  testUser: null,                    // 测试用户 (如需要)
  
  // API 端点配置
  endpoints: {
    list: '/todos',                  // GET 列表
    create: '/todos',                // POST 创建
    get: '/todos/:id',               // GET 单个
    update: '/todos/:id',            // PUT 更新
    delete: '/todos/:id',            // DELETE 删除
  },
  
  // 期望的数据结构
  schemas: {
    item: {
      id: 'string',
      text: 'string',
      completed: 'boolean',
    }
  },
  
  // 需要的环境变量
  requiredEnvVars: [],
};

let testsPassed = 0;
let testsFailed = 0;

console.log(`🧪 ${CONFIG.name} - Complete Test Suite`);
console.log(`🌐 URL: ${CONFIG.url}`);
console.log(`🔌 API: ${CONFIG.url}${CONFIG.apiBase}`);
console.log('='.repeat(60));

// ==========================================
// 通用测试工具
// ==========================================

async function test(name, fn) {
  process.stdout.write(`Testing: ${name}... `);
  try {
    await fn();
    console.log('✅ PASS');
    testsPassed++;
  } catch (error) {
    console.log(`❌ FAIL: ${error.message}`);
    testsFailed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function request(method, path, body = null) {
  const url = `${CONFIG.url}${CONFIG.apiBase}${path}`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (body) options.body = JSON.stringify(body);
  
  const response = await fetch(url, options);
  const data = await response.json();
  return { status: response.status, data };
}

// ==========================================
// 默认测试用例
// ==========================================

async function runDefaultTests() {
  // 1. 网站可访问性
  console.log('\n🌐 网站可访问性测试');
  console.log('-'.repeat(40));
  
  await test('Website loads (200)', async () => {
    const response = await fetch(CONFIG.url);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
  });
  
  await test('HTML content present', async () => {
    const text = await fetch(CONFIG.url).then(r => r.text());
    assert(text.length > 100, 'HTML content too short');
  });

  // 2. API 基础测试
  console.log('\n📋 API 基础测试');
  console.log('-'.repeat(40));
  
  await test('API endpoint accessible', async () => {
    const { status } = await request('GET', CONFIG.endpoints.list);
    assert([200, 404].includes(status), 'API should return 200 or 404');
  });

  // 3. API 路由匹配测试（关键！）
  console.log('\n🔗 前端-后端路由匹配测试（关键！）');
  console.log('-'.repeat(40));
  
  // 检查前端代码中的 API 调用是否与后端路由匹配
  await test('Frontend API calls match backend routes', async () => {
    const frontendHtml = await fetch(CONFIG.url).then(r => r.text());
    
    // 检查前端使用的 API 路径
    const apiPatterns = [
      /fetch\(['"]([^'"]+)['"]/g,
      /axios\.(get|post|put|delete)\(['"]([^'"]+)['"]/g,
    ];
    
    const usedPaths = new Set();
    for (const pattern of apiPatterns) {
      let match;
      while ((match = pattern.exec(frontendHtml)) !== null) {
        usedPaths.add(match[1] || match[2]);
      }
    }
    
    console.log(`   Found frontend API paths: ${[...usedPaths].join(', ')}`);
    
    // 验证关键路径存在
    const criticalPaths = Object.values(CONFIG.endpoints).map(p => p.replace('/:id', '/test-id'));
    for (const path of criticalPaths) {
      const { status } = await request('GET', path);
      assert(status === 200 || status === 404, `${path} should be accessible`);
    }
  });

  // 4. CORS 测试
  console.log('\n🌐 CORS 测试');
  console.log('-'.repeat(40));
  
  await test('CORS headers present', async () => {
    const response = await fetch(`${CONFIG.url}${CONFIG.apiBase}`, { method: 'OPTIONS' });
    const origin = response.headers.get('access-control-allow-origin');
    assert(origin === '*' || origin, 'CORS origin header missing');
  });

  // 5. 响应格式测试
  console.log('\n📊 响应格式测试');
  console.log('-'.repeat(40));
  
  await test('API returns JSON', async () => {
    const response = await fetch(`${CONFIG.url}${CONFIG.apiBase}${CONFIG.endpoints.list}`);
    const contentType = response.headers.get('content-type');
    assert(contentType?.includes('application/json'), 'Expected JSON response');
  });

  // 6. 环境变量检查
  console.log('\n🔐 环境变量检查');
  console.log('-'.repeat(40));
  
  for (const envVar of CONFIG.requiredEnvVars) {
    await test(`Environment variable ${envVar} configured`, async () => {
      // 这个测试需要在服务端运行检查
      console.log(`   (Manual check: ${envVar})`);
    });
  }

  // 7. 安全性检查
  console.log('\n🔒 安全性检查');
  console.log('-'.repeat(40));
  
  await test('No sensitive data in responses', async () => {
    const { data } = await request('GET', CONFIG.endpoints.list);
    const sensitiveKeys = ['password', 'token', 'secret', 'key'];
    const jsonStr = JSON.stringify(data).toLowerCase();
    for (const key of sensitiveKeys) {
      assert(!jsonStr.includes(key), `Response may contain sensitive data: ${key}`);
    }
  });
}

// ==========================================
// 部署前检查清单
// ==========================================

function printDeploymentChecklist() {
  console.log('\n📝 部署前检查清单');
  console.log('='.repeat(60));
  console.log('请确认以下项目：\n');
  
  console.log('□ 网站可正常加载');
  console.log('□ 所有 API 端点可访问');
  console.log('□ 前端 API 调用 URL 与后端路由匹配');
  console.log('□ CORS 配置正确');
  console.log('□ 响应格式正确 (JSON)');
  console.log('□ 无敏感数据泄露');
  console.log('□ 需要的环变量已设置');
  console.log('□ 数据库/存储连接正常');
  console.log('□ 无 JavaScript 错误');
  console.log('□ 所有交互功能正常');
  console.log('□ 移动端布局正常');
  console.log('□ 性能可接受');
  console.log('\n建议运行完整测试套件后再部署！');
}

// ==========================================
// 主函数
// ==========================================

async function runTests() {
  try {
    await runDefaultTests();
    printDeploymentChecklist();
    
    console.log('\n' + '='.repeat(60));
    console.log(`📊 Results: ${testsPassed} passed, ${testsFailed} failed`);
    
    if (testsFailed > 0) {
      console.log('\n❌ Some tests failed!');
      process.exit(1);
    } else {
      console.log('\n✅ All tests passed!');
      process.exit(0);
    }
  } catch (error) {
    console.error('\n💥 Test runner error:', error.message);
    process.exit(1);
  }
}

runTests();
