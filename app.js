const ap = require('koa')
const app=new ap()
const koa = require('koa-router')()


const json = require('koa-json')
const onerror = require('koa-onerror')
const jwt = require('koa-jwt')
const logger = require('koa-logger')


const admin = require('./routes/admin.js')
const upload = require('./routes/upload.js')
const bodyparser=require('koa-bodyparser')
// error handler
onerror(app)


// middlewares
app.use(bodyparser({formLimit: '5mb',jsonLimit:'5mb',textLimit:'5mb'}));
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
app.use(json())
app.use(logger())

koa.use('/admin', admin.routes()); // 挂载到koa-router上，同时会让所有的admin的请求路径前面加上'/admin'的请求路径。
koa.use('/api', upload.routes()); 
app.use(koa.routes()); // 将路由规则挂载到Koa上。
// logger



app.listen(8889,() => {
  console.log('Koa is listening in 8889');
});

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
