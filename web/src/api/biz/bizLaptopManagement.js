import service from '@/utils/request'
// @Tags BizLaptopManagement
// @Summary 创建bizLaptopManagement表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.BizLaptopManagement true "创建bizLaptopManagement表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"创建成功"}"
// @Router /bizLaptopManagement/createBizLaptopManagement [post]
export const createBizLaptopManagement = (data) => {
    return service({
        url: '/bizLaptopManagement/createBizLaptopManagement', method: 'post', data
    })
}

// @Tags BizLaptopManagement
// @Summary 删除bizLaptopManagement表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.BizLaptopManagement true "删除bizLaptopManagement表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /bizLaptopManagement/deleteBizLaptopManagement [delete]
export const deleteBizLaptopManagement = (params) => {
    return service({
        url: '/bizLaptopManagement/deleteBizLaptopManagement', method: 'delete', params
    })
}

// @Tags BizLaptopManagement
// @Summary 批量删除bizLaptopManagement表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body request.IdsReq true "批量删除bizLaptopManagement表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /bizLaptopManagement/deleteBizLaptopManagement [delete]
export const deleteBizLaptopManagementByIds = (params) => {
    return service({
        url: '/bizLaptopManagement/deleteBizLaptopManagementByIds', method: 'delete', params
    })
}

// @Tags BizLaptopManagement
// @Summary 更新bizLaptopManagement表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.BizLaptopManagement true "更新bizLaptopManagement表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /bizLaptopManagement/updateBizLaptopManagement [put]
export const updateBizLaptopManagement = (data) => {
    return service({
        url: '/bizLaptopManagement/updateBizLaptopManagement', method: 'put', data
    })
}

// @Tags BizLaptopManagement
// @Summary 用id查询bizLaptopManagement表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data query model.BizLaptopManagement true "用id查询bizLaptopManagement表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /bizLaptopManagement/findBizLaptopManagement [get]
export const findBizLaptopManagement = (params) => {
    return service({
        url: '/bizLaptopManagement/findBizLaptopManagement', method: 'get', params
    })
}

// @Tags BizLaptopManagement
// @Summary 分页获取bizLaptopManagement表列表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data query request.PageInfo true "分页获取bizLaptopManagement表列表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /bizLaptopManagement/getBizLaptopManagementList [get]
export const getBizLaptopManagementList = (params) => {
    return service({
        url: '/bizLaptopManagement/getBizLaptopManagementList', method: 'get', params
    })
}

// @Tags BizLaptopManagement
// @Summary 不需要鉴权的bizLaptopManagement表接口
// @Accept application/json
// @Produce application/json
// @Param data query bizReq.BizLaptopManagementSearch true "分页获取bizLaptopManagement表列表"
// @Success 200 {object} response.Response{data=object,msg=string} "获取成功"
// @Router /bizLaptopManagement/getBizLaptopManagementPublic [get]
export const getBizLaptopManagementPublic = () => {
    return service({
        url: '/bizLaptopManagement/getBizLaptopManagementPublic', method: 'get',
    })
}
