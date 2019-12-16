#!/usr/bin/env node

const program = require('commander')
const inquirer = require('inquirer')
const shell = require('shelljs')

// 问答操作
const initAction = () => {
    inquirer.prompt([{
        type: 'input', // 问答类型
        message: '请输入项目名称：',
        name: 'name' // 指定答案的key
    }]).then(answer => {
        console.log('项目名为：' + answer.name)
        console.log('正在拷贝项目请稍等...')

        // 拷贝模板代码
        const remote = 'https://github.com/xulch/react-init.git'
        const curName = 'react-init'
        const tarName = answer.name
        shell.exec(`
            git clone ${remote} --depth=1
            mv ${curName} ${tarName}
            rm -rf ./${tarName}/.git
        `, (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`)
            }
            console.log(`${stdout}`)
            console.log(`${stderr}`)
        })
    })
}
// 处理def -V/--version指令
program.version(require('./package.json').version)

// 自定义一个指令，并为该指令添加help描述和执行的回调
program
    .command('init')
    .description('创建项目')
    .action(initAction)

// 代理git和npm
program
    .command('proxy')
    .description('对npm和git进行代理')
    .action(() => {
        shell.exec(`
            git config --global http://web-proxy.tencent.com:8080
            npm config set https-proxy http://web-proxy.oa.com:8080
            npm config set registry https://registry.npm.taobao.org
        `)
        console.log('成功对npm和git进行代理')
        console.log('您可以在内网用git去拷贝外网的代码库，也可以用npm在内网安装依赖')
    })

program
    .command('tencent')
    .description('去除npm和git代理')
    .action(() => {
        shell.exec(`
            git config --global unset http.proxy
            npm config rm https-proxy
            npm config set registry https://registry.tabobao.org
        `)
        console.log('成功去除npm和git代理')
        console.log('您可以才内网用内网去拷贝内网的代码仓库，但是没办法再用内网用npm安装依赖了')
    })

// 将命令参数传入commander管道中
program.parse(process.argv)