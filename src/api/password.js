import request from '@/utils/request'

export default {
    checkPwd(userId,password){
        //校验密码 usrId, password 旧密码
        return request({
            url:'/user/pwd',
            method:'post',
            data:{
                userId,
                password
            }
        })

    }, //新密码
    updatePwd(userId,password){
        return request({
            url:'/user/pwd',
            method:'put',
            data:{
                userId,
                password
            }
        })
    }
}