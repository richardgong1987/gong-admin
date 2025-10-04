package biz

import (
	"github.com/gin-gonic/gin"
	"github.com/richardgong1987/server/middleware"
)

type BizLaptopManagementRouter struct{}

// InitBizLaptopManagementRouter 初始化 bizLaptopManagement表 路由信息
func (s *BizLaptopManagementRouter) InitBizLaptopManagementRouter(Router *gin.RouterGroup, PublicRouter *gin.RouterGroup) {
	bizLaptopManagementRouter := Router.Group("bizLaptopManagement").Use(middleware.OperationRecord())
	bizLaptopManagementRouterWithoutRecord := Router.Group("bizLaptopManagement")
	bizLaptopManagementRouterWithoutAuth := PublicRouter.Group("bizLaptopManagement")
	{
		bizLaptopManagementRouter.POST("createBizLaptopManagement", bizLaptopManagementApi.CreateBizLaptopManagement)             // 新建bizLaptopManagement表
		bizLaptopManagementRouter.DELETE("deleteBizLaptopManagement", bizLaptopManagementApi.DeleteBizLaptopManagement)           // 删除bizLaptopManagement表
		bizLaptopManagementRouter.DELETE("deleteBizLaptopManagementByIds", bizLaptopManagementApi.DeleteBizLaptopManagementByIds) // 批量删除bizLaptopManagement表
		bizLaptopManagementRouter.PUT("updateBizLaptopManagement", bizLaptopManagementApi.UpdateBizLaptopManagement)              // 更新bizLaptopManagement表
	}
	{
		bizLaptopManagementRouterWithoutRecord.GET("findBizLaptopManagement", bizLaptopManagementApi.FindBizLaptopManagement)       // 根据ID获取bizLaptopManagement表
		bizLaptopManagementRouterWithoutRecord.GET("getBizLaptopManagementList", bizLaptopManagementApi.GetBizLaptopManagementList) // 获取bizLaptopManagement表列表
	}
	{
		bizLaptopManagementRouterWithoutAuth.GET("getBizLaptopManagementPublic", bizLaptopManagementApi.GetBizLaptopManagementPublic) // bizLaptopManagement表开放接口
	}
}
